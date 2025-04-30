using BusinessCalendar.Application.DTOs;
using BusinessCalendar.Application.DTOs.ServiceDtos;
using BusinessCalendar.Application.Services;
using BusinessCalendar.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BusinessCalendar.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "CompanyPolicy")]
    public class ServiceController : ControllerBase
    {
        private readonly ServiceService _serviceService;

        public ServiceController(ServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        // Получить все услуги текущей компании
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            int companyId = GetCompanyIdFromToken();
            var services = await _serviceService.GetAllForCompanyAsync(companyId);
            return Ok(services);
        }

        [Authorize(Policy = "ExecutorPolicy")]
        [HttpGet("{publicId:guid}")]
        public async Task<IActionResult> GetByGuid(Guid publicId)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (role == "Company")
            {
                int companyId = int.Parse(User.FindFirst("CompanyId")!.Value);
                var service = await _serviceService.GetByPublicIdForCompanyAsync(publicId, companyId);

                if (service == null)
                    return Forbid(); // либо NotFound(), если хочешь маскировать существование ресурса

                return Ok(service);
            }
            else if (role == "Executor")
            {
                int executorId = int.Parse(User.FindFirst("ExecutorId")!.Value);
                var service = await _serviceService.GetByPublicIdForExecutorAsync(publicId, executorId);

                if (service == null)
                    return Forbid(); // доступ к чужому сервису запрещён

                return Ok(service);
            }

            return Forbid(); // роль не распознана
        }


        // Создание новой услуги
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ServiceCreateDto dto)
        {
            int companyId = GetCompanyIdFromToken();
            var created = await _serviceService.CreateServiceAsync(companyId, dto);
            return CreatedAtAction(nameof(GetAll), new { id = created.PublicId }, created);
        }

        // Обновление услуги
        [HttpPut("{publicId}")]
        public async Task<IActionResult> Update(Guid publicId, [FromBody] ServiceUpdateDto dto)
        {
            int companyId = GetCompanyIdFromToken();
            var updated = await _serviceService.UpdateServiceAsync(publicId, companyId, dto);
            return Ok(updated);
        }

        // Удаление услуги
        [HttpDelete("{publicId}")]
        public async Task<IActionResult> Delete(Guid publicId)
        {
            int companyId = GetCompanyIdFromToken();
            await _serviceService.DeleteServiceAsync(publicId, companyId);
            return NoContent();
        }

        // Извлечение CompanyId из токена
        private int GetCompanyIdFromToken()
        {
            var companyIdClaim = User.FindFirst("CompanyId")?.Value;
            if (string.IsNullOrEmpty(companyIdClaim) || !int.TryParse(companyIdClaim, out int companyId))
                throw new UnauthorizedAccessException("Невозможно получить CompanyId из токена");

            return companyId;
        }
    }
}
