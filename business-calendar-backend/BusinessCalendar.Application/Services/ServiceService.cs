using BusinessCalendar.Application.DTOs.ServiceDtos;
using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Application.Services
{
    public class ServiceService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ServiceService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<Service>> GetAllForCompanyAsync(int companyId)
        {
            return await _unitOfWork.ServiceRepository.GetByCompanyIdAsync(companyId);
        }

        public async Task<ServiceDto?> GetByPublicIdForCompanyAsync(Guid publicId, int companyId)
        {
            var service = await _unitOfWork.ServiceRepository.GetByPublicIdForCompanyAsync(publicId, companyId);
            if (service == null) return null;

            return new ServiceDto
            {
                PublicId = service.PublicId,
                ServiceName = service.ServiceName,
                ServicePrice = service.ServicePrice,
                ServiceType = service.ServiceType,
                DurationMinutes = service.DurationMinutes
            };

        }

        public async Task<ServiceDto?> GetByPublicIdForExecutorAsync(Guid publicId, int executorId)
        {
            var service = await _unitOfWork.ServiceRepository.GetByPublicIdForExecutorAsync(publicId, executorId);
            if (service == null) return null;

            return new ServiceDto
            {
                PublicId = service.PublicId,
                ServiceName = service.ServiceName,
                ServicePrice = service.ServicePrice,
                ServiceType = service.ServiceType,
                DurationMinutes = service.DurationMinutes
            };

        }


        public async Task<Service> CreateServiceAsync(int companyId, ServiceCreateDto dto)
        {
            var service = new Service
            {
                ServiceName = dto.ServiceName,
                ServiceType = dto.ServiceType,
                ServicePrice = dto.ServicePrice,
                DurationMinutes = dto.DurationMinutes,
                CompanyId = companyId
            };


            await _unitOfWork.Services.AddAsync(service);
            await _unitOfWork.SaveChangesAsync();

            return service;
        }

        public async Task<Service> UpdateServiceAsync(Guid servicePublicId, int companyId, ServiceUpdateDto dto)
        {
            var service = await _unitOfWork.ServiceRepository.GetByGuidAsync(servicePublicId);
            if (service == null || service.CompanyId != companyId)
                throw new UnauthorizedAccessException("Нет доступа к ресурсу");

            if (!string.IsNullOrEmpty(dto.ServiceName))
                service.ServiceName = dto.ServiceName;
            if (dto.ServiceType.HasValue)
                service.ServiceType = dto.ServiceType.Value;
            if (dto.ServicePrice.HasValue)
                service.ServicePrice = dto.ServicePrice.Value;
            if (dto.DurationMinutes.HasValue)
                service.DurationMinutes = dto.DurationMinutes.Value;

            _unitOfWork.Services.Update(service);
            await _unitOfWork.SaveChangesAsync();

            return service;
        }

        public async Task DeleteServiceAsync(Guid servicePublicId, int companyId)
        {
            var service = await _unitOfWork.ServiceRepository.GetByGuidAsync(servicePublicId);
            if (service == null || service.CompanyId != companyId)
                throw new UnauthorizedAccessException("Нет доступа к ресурсу");

            _unitOfWork.Services.Delete(service);
            await _unitOfWork.SaveChangesAsync();
        }
    }

}
