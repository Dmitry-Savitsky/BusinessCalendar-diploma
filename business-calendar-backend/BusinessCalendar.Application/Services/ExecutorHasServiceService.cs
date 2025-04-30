using BusinessCalendar.Application.DTOs;
using BusinessCalendar.Application.DTOs.ExecutorHasServiceDtos;
using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessCalendar.Application.Services
{
    public class ExecutorHasServiceService
    {
        private readonly IUnitOfWork _uow;

        public ExecutorHasServiceService(IUnitOfWork uow)
        {
            _uow = uow;
        }

        /// <summary>
        /// Создание связи executor-service (только компания)
        /// </summary>
        public async Task AddAsync(int companyId, ExecutorHasServiceCreateDto dto)
        {
            // валидируем принадлежность
            var exec = await _uow.Executors.GetByIdAsync(dto.ExecutorId);
            var serv = await _uow.Services.GetByIdAsync(dto.ServiceId);

            if (exec == null || serv == null
                || exec.CompanyId != companyId
                || serv.CompanyId != companyId)
            {
                throw new UnauthorizedAccessException("Исполнитель или услуга не принадлежат вашей компании");
            }

            // проверяем дубликат
            var exist = await _uow.ExecutorHasServiceRepository
                .GetByExecutorAndServiceAsync(dto.ExecutorId, dto.ServiceId);
            if (exist != null)
                throw new InvalidOperationException("Связь уже существует");

            var link = new ExecutorHasService
            {
                ExecutorId = dto.ExecutorId,
                ServiceId = dto.ServiceId
            };

            await _uow.ExecutorHasServices.AddAsync(link);
            await _uow.SaveChangesAsync();
        }

        /// <summary>
        /// Удаление связи (только компания)
        /// </summary>
        public async Task DeleteAsync(int companyId, int executorId, int serviceId)
        {
            var link = await _uow.ExecutorHasServiceRepository
                .GetByExecutorAndServiceAsync(executorId, serviceId);
            if (link == null)
                throw new KeyNotFoundException("Связь не найдена");

            if (link.Executor.CompanyId != companyId
                || link.Service.CompanyId != companyId)
            {
                throw new UnauthorizedAccessException("Нет прав на удаление этой связи");
            }

            _uow.ExecutorHasServices.Delete(link);
            await _uow.SaveChangesAsync();
        }

        /// <summary>
        /// Просмотр связей для компании
        /// </summary>
        public async Task<List<ExecutorHasServiceDto>> GetForCompanyAsync(int companyId)
        {
            var list = await _uow.ExecutorHasServiceRepository.GetByCompanyIdAsync(companyId);
            return list.Select(x => new ExecutorHasServiceDto
            {
                ExecutorPublicId = x.Executor.PublicId,
                ExecutorName = x.Executor.ExecutorName,
                ExecutorImgPath = x.Executor.ImgPath,

                ServicePublicId = x.Service.PublicId,
                ServiceName = x.Service.ServiceName,
                ServicePrice = x.Service.ServicePrice,
                DurationMinutes = x.Service.DurationMinutes
            }).ToList();
        }

        /// <summary>
        /// Просмотр связей для исполнителя
        /// </summary>
        public async Task<List<ExecutorHasServiceDto>> GetForExecutorAsync(int executorId)
        {
            var list = await _uow.ExecutorHasServiceRepository.GetByExecutorIdAsync(executorId);
            return list.Select(x => new ExecutorHasServiceDto
            {
                ExecutorPublicId = x.Executor.PublicId,
                ExecutorName = x.Executor.ExecutorName,
                ExecutorImgPath = x.Executor.ImgPath,

                ServicePublicId = x.Service.PublicId,
                ServiceName = x.Service.ServiceName,
                ServicePrice = x.Service.ServicePrice,
                DurationMinutes = x.Service.DurationMinutes
            }).ToList();
        }
    }
}
