using BusinessCalendar.Application.DTOs.ExecutorHasServiceDtos;
using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Interfaces;
using System;
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

        public async Task AddAsync(string companyGuid, ExecutorHasServiceCreateDto dto)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid));
            if (company == null)
                throw new UnauthorizedAccessException("Компания не найдена");

            var exec = await _uow.Executors.GetByIdAsync(dto.ExecutorId);
            var serv = await _uow.Services.GetByIdAsync(dto.ServiceId);

            if (exec == null || serv == null
                || exec.CompanyId != company.Id
                || serv.CompanyId != company.Id)
            {
                throw new UnauthorizedAccessException("Исполнитель или услуга не принадлежат вашей компании");
            }

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

        public async Task DeleteAsync(string companyGuid, Guid executorGuid, Guid serviceGuid)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid));
            if (company == null)
                throw new UnauthorizedAccessException("Компания не найдена");

            var exec = await _uow.ExecutorRepository.GetByGuidAsync(executorGuid);
            var serv = await _uow.ServiceRepository.GetByGuidAsync(serviceGuid);

            if (exec == null || serv == null
                || exec.CompanyId != company.Id
                || serv.CompanyId != company.Id)
            {
                throw new UnauthorizedAccessException("Нет прав на удаление этой связи");
            }

            var link = await _uow.ExecutorHasServiceRepository
                .GetByExecutorAndServiceAsync(exec.Id, serv.Id);

            if (link == null)
                throw new KeyNotFoundException("Связь не найдена");

            _uow.ExecutorHasServices.Delete(link);
            await _uow.SaveChangesAsync();
        }

        public async Task<List<ExecutorHasServiceDto>> GetForCompanyAsync(string companyGuid)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid));
            if (company == null)
                throw new UnauthorizedAccessException("Компания не найдена");

            var list = await _uow.ExecutorHasServiceRepository.GetByCompanyIdAsync(company.Id);

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

        public async Task<List<ExecutorHasServiceDto>> GetForExecutorAsync(string executorGuid)
        {
            var executor = await _uow.ExecutorRepository.GetByGuidAsync(Guid.Parse(executorGuid));
            if (executor == null)
                throw new UnauthorizedAccessException("Исполнитель не найден");

            var list = await _uow.ExecutorHasServiceRepository.GetByExecutorIdAsync(executor.Id);

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
