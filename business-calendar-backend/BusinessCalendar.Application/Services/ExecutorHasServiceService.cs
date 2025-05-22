using BusinessCalendar.Application.DTOs.ExecutorHasServiceDtos;
using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Exceptions;
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
            => _uow = uow;

        /// <summary>
        /// Компания добавляет связь исполнитель–услуга по публичным GUID.
        /// </summary>
        public async Task AddAsync(string companyGuid, ExecutorHasServiceCreateDto dto)
        {
            // 1) Проверить компанию
            var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid))
                          ?? throw new UnauthorizedAccessException("Компания не найдена.");

            // 2) Найти исполнителя/услугу по GUID
            var executor = await _uow.ExecutorRepository.GetByGuidAsync(dto.ExecutorGuid)
                           ?? throw new NotFoundException("Исполнитель не найден.");
            var service = await _uow.ServiceRepository.GetByGuidAsync(dto.ServiceGuid)
                           ?? throw new NotFoundException("Услуга не найдена.");

            // 3) Проверить их принадлежность компании
            if (executor.CompanyId != company.Id || service.CompanyId != company.Id)
                throw new UnauthorizedAccessException("Нельзя связать сущности чужой компании.");

            // 4) Проверить дубликат
            var exists = await _uow.ExecutorHasServiceRepository
                .GetByExecutorAndServiceAsync(executor.Id, service.Id);
            if (exists != null)
                throw new InvalidOperationException("Такая связь уже существует.");

            // 5) Создать
            await _uow.ExecutorHasServices.AddAsync(new ExecutorHasService
            {
                ExecutorId = executor.Id,
                ServiceId = service.Id
            });
            await _uow.SaveChangesAsync();
        }

        /// <summary>
        /// Компания удаляет связь по публичным GUID.
        /// </summary>
        public async Task DeleteAsync(string companyGuid, Guid executorGuid, Guid serviceGuid)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid))
                          ?? throw new UnauthorizedAccessException("Компания не найдена.");

            var executor = await _uow.ExecutorRepository.GetByGuidAsync(executorGuid)
                            ?? throw new NotFoundException("Исполнитель не найден.");
            var service = await _uow.ServiceRepository.GetByGuidAsync(serviceGuid)
                            ?? throw new NotFoundException("Услуга не найдена.");

            if (executor.CompanyId != company.Id || service.CompanyId != company.Id)
                throw new UnauthorizedAccessException("Нет прав на удаление этой связи.");

            var link = await _uow.ExecutorHasServiceRepository
                .GetByExecutorAndServiceAsync(executor.Id, service.Id)
                ?? throw new KeyNotFoundException("Связь не найдена.");

            _uow.ExecutorHasServices.Delete(link);
            await _uow.SaveChangesAsync();
        }

        /// <summary>
        /// Компания смотрит все свои связи.
        /// </summary>
        public async Task<List<ExecutorHasServiceDto>> GetForCompanyAsync(string companyGuid)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid))
                          ?? throw new UnauthorizedAccessException("Компания не найдена.");

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

        /// <summary>
        /// Исполнитель смотрит только свои связи.
        /// </summary>
        public async Task<List<ExecutorHasServiceDto>> GetForExecutorAsync(string executorGuid)
        {
            var executor = await _uow.ExecutorRepository.GetByGuidAsync(Guid.Parse(executorGuid))
                           ?? throw new UnauthorizedAccessException("Исполнитель не найден.");

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

        /// <summary>
        /// Компания получает исполнителей для своей услуги.
        /// </summary>
        public async Task<List<ExecutorHasServiceDto>> GetByServicePublicIdAsync(string companyGuid, Guid serviceGuid)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid))
                          ?? throw new UnauthorizedAccessException("Компания не найдена.");

            var service = await _uow.ServiceRepository.GetByGuidAsync(serviceGuid)
                         ?? throw new NotFoundException("Услуга не найдена.");

            if (service.CompanyId != company.Id)
                throw new UnauthorizedAccessException("Нет прав.");

            var links = await _uow.ExecutorHasServiceRepository.GetByServiceIdAsync(service.Id);
            return links.Select(x => new ExecutorHasServiceDto
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
        /// Компания получает список услуг для своего исполнителя.
        /// </summary>
        public async Task<List<ExecutorHasServiceDto>> GetByExecutorPublicIdForCompanyAsync(string companyGuid, Guid executorGuid)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid))
                          ?? throw new UnauthorizedAccessException("Компания не найдена.");

            var executor = await _uow.ExecutorRepository.GetByGuidAsync(executorGuid)
                           ?? throw new NotFoundException("Исполнитель не найден.");

            if (executor.CompanyId != company.Id)
                throw new UnauthorizedAccessException("Нет прав.");

            var links = await _uow.ExecutorHasServiceRepository.GetByExecutorIdAsync(executor.Id);
            return links.Select(x => new ExecutorHasServiceDto
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
        /// Исполнитель получает свои услуги.
        /// </summary>
        public async Task<List<ExecutorHasServiceDto>> GetByExecutorPublicIdForExecutorAsync(string executorGuidToken, Guid executorGuid)
        {
            if (!Guid.TryParse(executorGuidToken, out var tokenGuid) ||
                tokenGuid != executorGuid)
                throw new UnauthorizedAccessException("Нельзя смотреть чужие данные.");

            var executor = await _uow.ExecutorRepository.GetByGuidAsync(executorGuid)
                           ?? throw new NotFoundException("Исполнитель не найден.");

            var links = await _uow.ExecutorHasServiceRepository.GetByExecutorIdAsync(executor.Id);
            return links.Select(x => new ExecutorHasServiceDto
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





        /////////////////// ВИДЖЕТ /////////////////////////
        




        public async Task<List<ExecutorHasServiceDto>> GetExecutorServicesForWidgetAsync(Guid companyGuid, Guid executorGuid)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(companyGuid)
                          ?? throw new NotFoundException("Компания не найдена");

            var executor = await _uow.ExecutorRepository.GetByGuidAsync(executorGuid)
                           ?? throw new NotFoundException("Исполнитель не найден");

            if (executor.CompanyId != company.Id)
                throw new UnauthorizedAccessException("Исполнитель не принадлежит компании.");

            var links = await _uow.ExecutorHasServiceRepository.GetByExecutorIdAsync(executor.Id);
            return links.Select(x => new ExecutorHasServiceDto
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

        public async Task<List<ExecutorHasServiceDto>> GetServiceExecutorsForWidgetAsync(Guid companyGuid, Guid serviceGuid)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(companyGuid)
                          ?? throw new NotFoundException("Компания не найдена");

            var service = await _uow.ServiceRepository.GetByGuidAsync(serviceGuid)
                         ?? throw new NotFoundException("Услуга не найдена");

            if (service.CompanyId != company.Id)
                throw new UnauthorizedAccessException("Услуга не принадлежит компании.");

            var links = await _uow.ExecutorHasServiceRepository.GetByServiceIdAsync(service.Id);
            return links.Select(x => new ExecutorHasServiceDto
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
