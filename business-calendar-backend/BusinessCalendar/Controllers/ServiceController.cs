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

        /// <summary>
        /// GET /api/service
        /// Список всех услуг текущей компании
        /// </summary>
        [HttpGet]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> GetAll()
        {
            var companyGuid = User.GetCompanyGuid();
            var dtos = await _serviceService.GetAllForCompanyAsync(companyGuid);
            return Ok(dtos);
        }

        /// <summary>
        /// GET /api/service/{publicId}
        /// Подробнее по одной услуге (для Company или Executor)
        /// </summary>
        [HttpGet("{publicId:guid}")]
        [Authorize] // Company или Executor
        public async Task<IActionResult> GetByGuid(Guid publicId)
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
            ServiceDto? dto = role switch
            {
                "Company" => await _serviceService.GetByPublicIdForCompanyAsync(publicId, User.GetCompanyGuid()),
                "Executor" => await _serviceService.GetByPublicIdForExecutorAsync(publicId, User.GetExecutorGuid()),
                _ => null
            };

            if (dto == null)
                return Forbid();

            return Ok(dto);
        }

        /// <summary>
        /// POST /api/service
        /// Создать новую услугу (Company only)
        /// </summary>
        [HttpPost]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> Create([FromBody] ServiceCreateDto dto)
        {
            var companyGuid = User.GetCompanyGuid();
            // внутри CreateServiceAsync вы устанавливаете RequiresAddress=false по умолчанию
            var created = await _serviceService.CreateServiceAsync(companyGuid, dto);
            // Мапим в DTO для ответа
            var resultDto = new ServiceDto
            {
                PublicId = created.PublicId,
                ServiceName = created.ServiceName,
                ServiceType = created.ServiceType,
                ServicePrice = created.ServicePrice,
                DurationMinutes = created.DurationMinutes,
                RequiresAddress = created.RequiresAddress
            };
            return CreatedAtAction(
                nameof(GetByGuid),
                new { publicId = resultDto.PublicId },
                resultDto
            );
        }

        /// <summary>
        /// PUT /api/service/{publicId}
        /// Обновить свойства услуги (Company only)
        /// </summary>
        [HttpPut("{publicId:guid}")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> Update(Guid publicId, [FromBody] ServiceUpdateDto dto)
        {
            var companyGuid = User.GetCompanyGuid();
            var updated = await _serviceService.UpdateServiceAsync(publicId, companyGuid, dto);
            var resultDto = new ServiceDto
            {
                PublicId = updated.PublicId,
                ServiceName = updated.ServiceName,
                ServiceType = updated.ServiceType,
                ServicePrice = updated.ServicePrice,
                DurationMinutes = updated.DurationMinutes,
                RequiresAddress = updated.RequiresAddress
            };
            return Ok(resultDto);
        }

        /// <summary>
        /// DELETE /api/service/{publicId}
        /// Удалить услугу (Company only)
        /// </summary>
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
