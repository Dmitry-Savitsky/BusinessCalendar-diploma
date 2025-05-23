﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Exceptions;
using BusinessCalendar.Core.Interfaces;
using BusinessCalendar.Application.DTOs.OrdersDtos;
using Microsoft.Extensions.Logging; 

namespace BusinessCalendar.Application.Services
{
    public class OrderService
    {
        private readonly IUnitOfWork _uow;
        private readonly ILogger<OrderService> _logger;
        private readonly BookingService _booking;

        public OrderService(IUnitOfWork uow, ILogger<OrderService> logger, BookingService booking)
        {
            _uow = uow;
            _logger = logger;
            _booking = booking;
        }

        /// <summary>
        /// Создать заказ сразу по нескольким услугам.
        /// </summary>
        public async Task<OrderDto> CreateOrderAsync(OrderCreateDto dto)
        {
            try
            {
                // 1. Проверяем компанию
                var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(dto.CompanyGuid));
                if (company == null)
                    throw new UnauthorizedException("Компания не найдена");

                // 2. Ищем клиента в базе или создаём
                var client = await _uow.ClientRepository.GetByPhoneAndCompanyAsync(dto.ClientPhone, company.Id)
                 ?? await CreateClientAsync(company.PublicId, dto.ClientName, dto.ClientPhone);

                
                // 3. Если нужна хотя бы одна адресная услуга — проверяем dto.ClientAddress
                int? addressId = null;
                if (dto.Items.Any(i => i.RequiresAddress))
                {
                    if (string.IsNullOrWhiteSpace(dto.ClientAddress))
                        throw new BadRequestException("Не задан адрес клиента для требуемой услуги");

                    var addr = new ClientAddress
                    {
                        ClientId = client.Id,
                        Address = dto.ClientAddress!
                    };
                    await _uow.ClientAddresses.AddAsync(addr);
                    await _uow.SaveChangesAsync();
                    addressId = addr.Id;
                }

                // 4. Составляем список интервалов и выполняем все проверки
                var intervals = new List<(DateTime Start, DateTime End)>();
                foreach (var item in dto.Items)
                {
                    // 4.1 Проверяем сущности
                    var service = await _uow.ServiceRepository.GetByGuidAsync(item.ServiceGuid)
                                   ?? throw new NotFoundException($"Сервис {item.ServiceGuid} не найден");
                    var executor = await _uow.ExecutorRepository.GetByGuidAsync(item.ExecutorGuid)
                                   ?? throw new NotFoundException($"Исполнитель {item.ExecutorGuid} не найден");

                    if (service.CompanyId != company.Id || executor.CompanyId != company.Id)
                        throw new UnauthorizedException("Услуга или исполнитель не вашей компании");

                    // 4.2 Длительность и конец
                    var startUtc = item.Start.UtcDateTime;
                    var dur = service.DurationMinutes
                                   ?? throw new BadRequestException("У услуги не задана длительность");
                    var endUtc = startUtc.AddMinutes(dur);

                    // 4.3 **Проверка через BookingService**:
                    //    передаём в GetSlotsAsync именно начало слота
                    var availableSlots = await _booking.GetSlotsAsync(
                        dto.CompanyGuid, item.ServiceGuid, item.ExecutorGuid, item.Start);

                    // если в списке нет ровно такой метки Available==true — отказ
                    if (!availableSlots.Any(s => s.Time == item.Start && s.Available))
                        throw new ConflictException($"Слот {item.Start:O} недоступен");

                    intervals.Add((startUtc, endUtc));
                }

                // 5. Создаём и сохраняем Order
                var order = new Order
                {
                    ClientId = client.Id,
                    ClientAddressId = addressId,
                    CompanyId = company.Id,
                    OrderStart = intervals.Min(t => t.Start),
                    OrderEnd = intervals.Max(t => t.End),
                    Confirmed = false,
                    OrderComment = dto.Comment
                };
                await _uow.Orders.AddAsync(order);
                await _uow.SaveChangesAsync();

                // 6. Создаём ServiceInOrder
                foreach (var item in dto.Items)
                {
                    var svc = await _uow.ServiceRepository.GetByGuidAsync(item.ServiceGuid);
                    var exe = await _uow.ExecutorRepository.GetByGuidAsync(item.ExecutorGuid);
                    var sUtc = item.Start.UtcDateTime;
                    var eUtc = sUtc.AddMinutes(svc.DurationMinutes!.Value);

                    var sio = new ServiceInOrder
                    {
                        OrderId = order.Id,
                        ServiceId = svc.Id,
                        ExecutorId = exe.Id,
                        ServiceStart = sUtc,
                        ServiceEnd = eUtc
                    };
                    await _uow.ServiceInOrders.AddAsync(sio);
                }
                await _uow.SaveChangesAsync();

                // 7. Формируем и возвращаем DTO
                return new OrderDto
                {
                    PublicId = order.PublicId,
                    Comment = order.OrderComment,
                    Items = dto.Items.Select(i => new OrderItemDto
                    {
                        ServiceGuid = i.ServiceGuid,
                        ExecutorGuid = i.ExecutorGuid,
                        Start = i.Start,            // DateTimeOffset локальный
                        RequiresAddress = i.RequiresAddress,
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CreateOrderAsync for CompanyGuid={CompanyGuid}", dto.CompanyGuid);
                throw;  // или перехватить и обернуть в пользовательское
            }
        }

        private async Task<Client> CreateClientAsync(Guid companyGuid, string name, string phone)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(companyGuid)
                          ?? throw new NotFoundException("Компания не найдена");

            var cl = new Client
            {
                CompanyId = company.Id,
                ClientName = name,
                ClientPhone = phone
            };

            await _uow.Clients.AddAsync(cl);
            await _uow.SaveChangesAsync();
            return cl;
        }


        private void CheckExecutorAvailability(Executor ex, DateTime startUtc, DateTime endUtc)
        {
            var dayNo = (int)startUtc.DayOfWeek;

            var workTime = ex.WorkTimes?.FirstOrDefault(wt => wt.DayNo == dayNo);
            if (workTime == null || !workTime.IsWorking)
                throw new ConflictException("Исполнитель в этот день не работает");

            var timeStart = new TimeOnly(startUtc.Hour, startUtc.Minute);
            var timeEnd = new TimeOnly(endUtc.Hour, endUtc.Minute);

            if (!workTime.FromTime.HasValue || !workTime.TillTime.HasValue)
                throw new ConflictException("У исполнителя не указано рабочее время");

            if (timeStart < workTime.FromTime.Value || timeEnd > workTime.TillTime.Value)
                throw new ConflictException("Выбранное время не входит в рабочие часы исполнителя");

            if (workTime.BreakStart.HasValue && workTime.BreakEnd.HasValue)
            {
                if (timeStart < workTime.BreakEnd && timeEnd > workTime.BreakStart)
                    throw new ConflictException("Выбранное время пересекается с перерывом исполнителя");
            }
        }

        // ***************** rud for order *******************

        /// <summary>
        /// Все заказы текущей компании (CRM), детально.
        /// </summary>
        public async Task<List<OrderDetailDto>> GetAllForCompanyAsync(string companyGuid)
        {
            var company = await _uow.CompanyRepository
                               .GetByGuidAsync(Guid.Parse(companyGuid))
                         ?? throw new NotFoundException("Компания не найдена");

            var orders = await _uow.OrderRepository.GetAllByCompanyIdAsync(company.Id);
            return MapToDetailDtos(orders);
        }

        public async Task<OrderDetailDto> GetByPublicIdAsync(string companyGuid, Guid orderGuid)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid))
                         ?? throw new NotFoundException("Компания не найдена");

            var order = await _uow.OrderRepository
                .GetByPublicIdAsync(orderGuid)              // должны Include(o => o.Client, o => o.ClientAddress, o => o.Services).ThenInclude(...)
                ?? throw new NotFoundException("Заказ не найден");

            if (order.CompanyId != company.Id)
                throw new UnauthorizedException("Нет доступа к этому заказу");

            // часовой пояс Минска
            var tz = TimeZoneInfo.FindSystemTimeZoneById("Europe/Minsk");

            // конвертация начала/конца
            var startOffset = TimeZoneInfo.ConvertTime(
                new DateTimeOffset(order.OrderStart, TimeSpan.Zero), tz);
            var endOffset = order.OrderEnd.HasValue
                ? TimeZoneInfo.ConvertTime(new DateTimeOffset(order.OrderEnd.Value, TimeSpan.Zero), tz)
                : (DateTimeOffset?)null;

            return new OrderDetailDto
            {
                PublicId = order.PublicId,
                Comment = order.OrderComment,
                Confirmed = order.Confirmed,
                Completed = order.Completed,
                OrderStart = startOffset,
                OrderEnd = endOffset,

                // заполняем данные клиента
                ClientPublicId = order.Client.PublicId,
                ClientName = order.Client.ClientName,
                ClientPhone = order.Client.ClientPhone,
                ClientAddress = order.ClientAddress?.Address,

                Items = order.Services.Select(sio =>
                {
                    // конвертим начало каждой услуги
                    var utcStart = sio.ServiceStart!.Value;
                    var localStart = TimeZoneInfo.ConvertTime(
                        new DateTimeOffset(utcStart, TimeSpan.Zero), tz);

                    return new OrderItemDetailDto
                    {
                        ServiceGuid = sio.Service.PublicId,
                        ServiceName = sio.Service.ServiceName,
                        ServiceType = sio.Service.ServiceType,
                        ServicePrice = sio.Service.ServicePrice,

                        ExecutorGuid = sio.Executor.PublicId,
                        ExecutorName = sio.Executor.ExecutorName,
                        ExecutorImgPath = sio.Executor.ImgPath,

                        Start = localStart,
                        RequiresAddress = sio.Service.RequiresAddress
                    };
                }).ToList()
            };
        }

        /// <summary>
        /// Все заказы текущей компании, в которых встречается услуга serviceGuid.
        /// </summary>
        public async Task<List<OrderDetailDto>> GetAllForCompanyByServiceAsync(string companyGuid, Guid serviceGuid)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid))
                          ?? throw new NotFoundException("Компания не найдена");

            // загружаем все
            var orders = await _uow.OrderRepository.GetAllByCompanyIdAsync(company.Id);

            // фильтрация по serviceGuid
            var filtered = orders
                .Where(o => o.Services.Any(sio => sio.Service.PublicId == serviceGuid))
                .ToList();

            // маппинг в OrderDetailDto (в точности как в GetAllForCompanyAsync)
            return MapToDetailDtos(filtered);
        }

        /// <summary>
        /// Все заказы текущей компании, в которых участвует исполнитель executorGuid.
        /// </summary>
        public async Task<List<OrderDetailDto>> GetAllForCompanyByExecutorAsync(string companyGuid, Guid executorGuid)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid))
                          ?? throw new NotFoundException("Компания не найдена");

            var orders = await _uow.OrderRepository.GetAllByCompanyIdAsync(company.Id);

            var filtered = orders
                .Where(o => o.Services.Any(sio => sio.Executor.PublicId == executorGuid))
                .ToList();

            return MapToDetailDtos(filtered);
        }

        /// <summary>
        /// Все заказы, в которых участвует текущий исполнитель.
        /// </summary>
        public async Task<List<OrderDetailDto>> GetMyOrdersAsync(string executorGuid)
        {
            // 1) Парсим и находим исполнителя
            if (!Guid.TryParse(executorGuid, out var parsedGuid))
                throw new ArgumentException("Некорректный GUID исполнителя.");

            var executor = await _uow.ExecutorRepository.GetByGuidAsync(parsedGuid)
                           ?? throw new NotFoundException("Исполнитель не найден.");

            // 2) Берём компанию исполнителя
            var companyId = executor.CompanyId;

            // 3) Загружаем все заказы компании (уже включает Service⇢Service,Executor и Client/ClientAddress)
            var orders = await _uow.OrderRepository.GetAllByCompanyIdAsync(companyId);

            // 4) Фильтруем по исполнителю
            var myOrders = orders
                .Where(o => o.Services.Any(sio => sio.ExecutorId == executor.Id))
                .ToList();

            // 5) Маппим через общий метод
            return MapToDetailDtos(myOrders);
        }


        // Вынесем общий маппинг в приватный метод
        private List<OrderDetailDto> MapToDetailDtos(List<Order> orders)
        {
            var tz = TimeZoneInfo.FindSystemTimeZoneById("Europe/Minsk");

            return orders.Select(o =>
            {
                var startOffset = TimeZoneInfo.ConvertTime(new DateTimeOffset(o.OrderStart, TimeSpan.Zero), tz);
                var endOffset = o.OrderEnd.HasValue
                    ? TimeZoneInfo.ConvertTime(new DateTimeOffset(o.OrderEnd.Value, TimeSpan.Zero), tz)
                    : (DateTimeOffset?)null;

                return new OrderDetailDto
                {
                    PublicId = o.PublicId,
                    Comment = o.OrderComment,
                    Confirmed = o.Confirmed,
                    Completed = o.Completed,
                    OrderStart = startOffset,
                    OrderEnd = endOffset,

                    ClientPublicId = o.Client.PublicId,
                    ClientName = o.Client.ClientName,
                    ClientPhone = o.Client.ClientPhone,
                    ClientAddress = o.ClientAddress?.Address,

                    Items = o.Services.Select(sio =>
                    {
                        var utcStart = sio.ServiceStart!.Value;
                        var localStart = TimeZoneInfo.ConvertTime(
                            new DateTimeOffset(utcStart, TimeSpan.Zero), tz);

                        return new OrderItemDetailDto
                        {
                            ServiceGuid = sio.Service.PublicId,
                            ServiceName = sio.Service.ServiceName,
                            ServiceType = sio.Service.ServiceType,
                            ServicePrice = sio.Service.ServicePrice,

                            ExecutorGuid = sio.Executor.PublicId,
                            ExecutorName = sio.Executor.ExecutorName,
                            ExecutorImgPath = sio.Executor.ImgPath,

                            Start = localStart,
                            RequiresAddress = sio.Service.RequiresAddress
                        };
                    }).ToList()
                };
            }).ToList();
        }


        /// <summary>
        /// Обновить только поля Confirmed и Completed.
        /// </summary>
        public async Task UpdateAsync(string companyGuid, Guid orderGuid, OrderUpdateDto dto)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid))
                         ?? throw new NotFoundException("Компания не найдена");

            var order = await _uow.OrderRepository.GetByPublicIdAsync(orderGuid)
                        ?? throw new NotFoundException("Заказ не найден");

            if (order.CompanyId != company.Id)
                throw new UnauthorizedException("Нет доступа к этому заказу");

            if (dto.Confirmed.HasValue)
                order.Confirmed = dto.Confirmed;
            if (dto.Completed.HasValue)
                order.Completed = dto.Completed;

            await _uow.SaveChangesAsync();
        }

        /// <summary>
        /// Удалить заказ и все позиции ServiceInOrder.
        /// </summary>
        public async Task DeleteAsync(string companyGuid, Guid orderGuid)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid))
                         ?? throw new NotFoundException("Компания не найдена");

            var order = await _uow.OrderRepository.GetByPublicIdAsync(orderGuid)
                        ?? throw new NotFoundException("Заказ не найден");

            if (order.CompanyId != company.Id)
                throw new UnauthorizedException("Нет доступа к этому заказу");

            // Сначала удаляем все позиции
            foreach (var sio in order.Services.ToList())
                _uow.ServiceInOrders.Delete(sio);

            // Затем сам заказ
            _uow.Orders.Delete(order);

            await _uow.SaveChangesAsync();
        }

    }
}
