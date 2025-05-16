using BusinessCalendar.Application.DTOs.ServiceDtos;
using BusinessCalendar.Application.Helpers;
using BusinessCalendar.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BusinessCalendar.Presentation.Controllers
{
    [ApiController]
    [Route("api/service")]
    public class ServiceController : ControllerBase
    {
        private readonly ServiceService _serviceService;

        public ServiceController(ServiceService serviceService)
            => _serviceService = serviceService;

        // GET /api/service
        [HttpGet]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> GetAll()
        {
            var companyGuid = User.GetCompanyGuid();
            List<ServiceDto> dtos = await _serviceService.GetAllForCompanyAsync(companyGuid);
            return Ok(dtos);
        }

        // GET /api/service/{publicId}
        [HttpGet("{publicId:guid}")]
        [Authorize] // обе роли
        public async Task<IActionResult> GetByGuid(Guid publicId)
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
            if (role == "Company")
            {
                var companyGuid = User.GetCompanyGuid();
                var service = await _serviceService.GetByPublicIdForCompanyAsync(publicId, companyGuid);
                if (service == null) return Forbid();
                return Ok(service);
            }
            else if (role == "Executor")
            {
                var executorGuid = User.GetExecutorGuid();
                var service = await _serviceService.GetByPublicIdForExecutorAsync(publicId, executorGuid);
                if (service == null) return Forbid();
                return Ok(service);
            }

            return Forbid();
        }

        // POST /api/service
        [HttpPost]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> Create([FromBody] ServiceCreateDto dto)
        {
            var companyGuid = User.GetCompanyGuid();
            var created = await _serviceService.CreateServiceAsync(companyGuid, dto);
            return CreatedAtAction(nameof(GetAll), new { /* no route‑params */ }, created);
        }

        // PUT /api/service/{publicId}
        [HttpPut("{publicId:guid}")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> Update(Guid publicId, [FromBody] ServiceUpdateDto dto)
        {
            var companyGuid = User.GetCompanyGuid();
            var updated = await _serviceService.UpdateServiceAsync(publicId, companyGuid, dto);
            return Ok(updated);
        }

        // DELETE /api/service/{publicId}
        [HttpDelete("{publicId:guid}")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> Delete(Guid publicId)
        {
            var companyGuid = User.GetCompanyGuid();
            await _serviceService.DeleteServiceAsync(publicId, companyGuid);
            return NoContent();
        }
    }
}
