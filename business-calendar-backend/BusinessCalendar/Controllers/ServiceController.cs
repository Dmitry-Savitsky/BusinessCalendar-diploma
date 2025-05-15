using BusinessCalendar.Application.DTOs.ServiceDtos;
using BusinessCalendar.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BusinessCalendar.Application.Helpers;

[ApiController]
[Route("api/[controller]")]
public class ServiceController : ControllerBase
{
    private readonly ServiceService _serviceService;

    public ServiceController(ServiceService serviceService)
    {
        _serviceService = serviceService;
    }

    // Получить все услуги текущей компании
    [HttpGet]
    [Authorize(Policy = "CompanyPolicy")]
    public async Task<IActionResult> GetAll()
    {
        var companyGuid = User.GetCompanyGuid();
        List<ServiceDto> dtos = await _serviceService.GetAllForCompanyAsync(companyGuid);
        return Ok(dtos);
    }

    [Authorize(Policy = "ExecutorPolicy")]
    [HttpGet("{publicId:guid}")]
    public async Task<IActionResult> GetByGuid(Guid publicId)
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        if (role == "Company")
        {
            var companyGuid = User.GetCompanyGuid();
            var service = await _serviceService.GetByPublicIdForCompanyAsync(publicId, companyGuid);

            if (service == null)
                return Forbid();

            return Ok(service);
        }
        else if (role == "Executor")
        {
            var executorGuid = User.GetExecutorGuid();
            var service = await _serviceService.GetByPublicIdForExecutorAsync(publicId, executorGuid);

            if (service == null)
                return Forbid();

            return Ok(service);
        }

        return Forbid();
    }

    // Создание новой услуги
    [HttpPost]
    [Authorize(Policy = "CompanyPolicy")]
    public async Task<IActionResult> Create([FromBody] ServiceCreateDto dto)
    {
        var companyGuid = User.GetCompanyGuid();
        var created = await _serviceService.CreateServiceAsync(companyGuid, dto);
        return CreatedAtAction(nameof(GetAll), new { id = created.PublicId }, created);
    }

    // Обновление услуги
    [HttpPut("{publicId}")]
    [Authorize(Policy = "CompanyPolicy")]
    public async Task<IActionResult> Update(Guid publicId, [FromBody] ServiceUpdateDto dto)
    {
        var companyGuid = User.GetCompanyGuid();
        var updated = await _serviceService.UpdateServiceAsync(publicId, companyGuid, dto);
        return Ok(updated);
    }

    // Удаление услуги
    [HttpDelete("{publicId}")]
    [Authorize(Policy = "CompanyPolicy")]
    public async Task<IActionResult> Delete(Guid publicId)
    {
        var companyGuid = User.GetCompanyGuid();
        await _serviceService.DeleteServiceAsync(publicId, companyGuid);
        return NoContent();
    }
}
