using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Exceptions;
using BusinessCalendar.Core.Interfaces;
using BusinessCalendar.Application.DTOs.OrdersDtos;

namespace BusinessCalendar.Application.Services
{
    public class OrderService
    {
        private readonly IUnitOfWork _uow;

        public OrderService(IUnitOfWork uow)
        {
            _uow = uow;
        }

        /// <summary>
        /// Создать заказ сразу по нескольким услугам.
        /// </summary>
        public async Task<OrderDto> CreateOrderAsync(OrderCreateDto dto)
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
                var service = await _uow.ServiceRepository.GetByGuidAsync(item.ServiceGuid)
                              ?? throw new NotFoundException($"Сервис {item.ServiceGuid} не найден");
                var executor = await _uow.ExecutorRepository.GetByGuidAsync(item.ExecutorGuid)
                                ?? throw new NotFoundException($"Исполнитель {item.ExecutorGuid} не найден");

                if (service.CompanyId != company.Id || executor.CompanyId != company.Id)
                    throw new UnauthorizedException("Услуга или исполнитель не вашей компании");

                var startUtc = item.Start.UtcDateTime;
                var dur = service.DurationMinutes
                          ?? throw new BadRequestException("У услуги не задана длительность");
                var endUtc = startUtc.AddMinutes(dur);

                CheckExecutorAvailability(executor, startUtc, endUtc);

                // проверяем конфликты с уже записанными заказами
                bool taken = await _uow.ServiceInOrderRepository.ExistsConflictAsync(
                    executor.Id, startUtc, endUtc);
                if (taken)
                    throw new ConflictException("Выбранный слот уже занят");

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
                Confirmed = true,
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
                    Start = i.Start,
                    RequiresAddress = i.RequiresAddress
                }).ToList()
            };
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


    }
}
