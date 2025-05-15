using BusinessCalendar.Application.DTOs.ServiceDtos;
using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Interfaces;

public class ServiceService
{
    private readonly IUnitOfWork _unitOfWork;

    public ServiceService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<ServiceDto>> GetAllForCompanyAsync(string companyGuid)
    {
        var company = await _unitOfWork.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid));
        if (company == null)
            throw new UnauthorizedAccessException("Компания не найдена.");

        var services = await _unitOfWork.ServiceRepository.GetByCompanyIdAsync(company.Id);

        return services.Select(service => new ServiceDto
        {
            PublicId = service.PublicId,
            ServiceName = service.ServiceName,
            ServiceType = service.ServiceType,
            ServicePrice = service.ServicePrice,
            DurationMinutes = service.DurationMinutes,
            RequiresAddress = service.RequiresAddress
        }).ToList();
    }

    public async Task<ServiceDto?> GetByPublicIdForCompanyAsync(Guid publicId, string companyGuid)
    {
        var company = await _unitOfWork.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid));
        if (company == null)
            throw new UnauthorizedAccessException("Компания не найдена.");

        var service = await _unitOfWork.ServiceRepository.GetByPublicIdForCompanyAsync(publicId, company.Id);
        if (service == null) return null;

        return new ServiceDto
        {
            PublicId = service.PublicId,
            ServiceName = service.ServiceName,
            ServiceType = service.ServiceType,
            ServicePrice = service.ServicePrice,
            DurationMinutes = service.DurationMinutes,
            RequiresAddress = service.RequiresAddress
        };
    }

    public async Task<ServiceDto?> GetByPublicIdForExecutorAsync(Guid publicId, string executorGuid)
    {
        var executor = await _unitOfWork.ExecutorRepository.GetByGuidAsync(Guid.Parse(executorGuid));
        if (executor == null)
            throw new UnauthorizedAccessException("Исполнитель не найден.");

        var service = await _unitOfWork.ServiceRepository.GetByPublicIdForExecutorAsync(publicId, executor.Id);
        if (service == null) return null;

        return new ServiceDto
        {
            PublicId = service.PublicId,
            ServiceName = service.ServiceName,
            ServiceType = service.ServiceType,
            ServicePrice = service.ServicePrice,
            DurationMinutes = service.DurationMinutes,
            RequiresAddress = service.RequiresAddress
        };
    }

    public async Task<Service> CreateServiceAsync(string companyGuid, ServiceCreateDto dto)
    {
        var company = await _unitOfWork.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid));
        if (company == null)
            throw new UnauthorizedAccessException("Компания не найдена.");

        var service = new Service
        {
            ServiceName = dto.ServiceName,
            ServiceType = dto.ServiceType,
            ServicePrice = dto.ServicePrice,
            DurationMinutes = dto.DurationMinutes,
            RequiresAddress = false,       // всегда false при создании
            CompanyId = company.Id
        };

        await _unitOfWork.Services.AddAsync(service);
        await _unitOfWork.SaveChangesAsync();

        return service;
    }

    public async Task<Service> UpdateServiceAsync(Guid servicePublicId, string companyGuid, ServiceUpdateDto dto)
    {
        var company = await _unitOfWork.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid));
        if (company == null)
            throw new UnauthorizedAccessException("Компания не найдена.");

        var service = await _unitOfWork.ServiceRepository.GetByGuidAsync(servicePublicId);
        if (service == null || service.CompanyId != company.Id)
            throw new UnauthorizedAccessException("Нет доступа к ресурсу");

        if (!string.IsNullOrEmpty(dto.ServiceName))
            service.ServiceName = dto.ServiceName;
        if (dto.ServiceType.HasValue)
            service.ServiceType = dto.ServiceType.Value;
        if (dto.ServicePrice.HasValue)
            service.ServicePrice = dto.ServicePrice.Value;
        if (dto.DurationMinutes.HasValue)
            service.DurationMinutes = dto.DurationMinutes.Value;
        if (dto.RequiresAddress.HasValue)
            service.RequiresAddress = dto.RequiresAddress.Value;

        _unitOfWork.Services.Update(service);
        await _unitOfWork.SaveChangesAsync();

        return service;
    }

    public async Task DeleteServiceAsync(Guid servicePublicId, string companyGuid)
    {
        var company = await _unitOfWork.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid));
        if (company == null)
            throw new UnauthorizedAccessException("Компания не найдена.");

        var service = await _unitOfWork.ServiceRepository.GetByGuidAsync(servicePublicId);
        if (service == null || service.CompanyId != company.Id)
            throw new UnauthorizedAccessException("Нет доступа к ресурсу");

        _unitOfWork.Services.Delete(service);
        await _unitOfWork.SaveChangesAsync();
    }
}

