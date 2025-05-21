// Presentation/Controllers/ExecutorHasServiceController.cs
using BusinessCalendar.Application.DTOs.ExecutorHasServiceDtos;
using BusinessCalendar.Application.Helpers;
using BusinessCalendar.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BusinessCalendar.Presentation.Controllers
{
    [ApiController]
    [Route("api/executor-services")]
    public class ExecutorHasServiceController : ControllerBase
    {
        private readonly ExecutorHasServiceService _service;

        public ExecutorHasServiceController(ExecutorHasServiceService service)
            => _service = service;

        /// <summary>
        /// 1) GET /api/executor-services
        ///    Список всех связей, зависит от роли:
        ///      - Company: все связи внутри компании
        ///      - Executor: только его собственные
        /// </summary>
        [HttpGet, Authorize]
        public async Task<IActionResult> GetAll()
        {
            var role = User.FindFirstValue(ClaimTypes.Role)!;
            if (role == "Company")
            {
                var companyGuid = User.GetCompanyGuid();
                var list = await _service.GetForCompanyAsync(companyGuid);
                return Ok(list);
            }
            else // Executor
            {
                var executorGuid = User.GetExecutorGuid();
                var list = await _service.GetForExecutorAsync(executorGuid);
                return Ok(list);
            }
        }

        /// <summary>
        /// 2) GET /api/executor-services/service/{serviceGuid}
        ///    Список исполнителей, которые оказывают услугу serviceGuid.
        ///    Только компания и только для своих услуг.
        /// </summary>
        [HttpGet("service/{serviceGuid:guid}")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> GetByService(Guid serviceGuid)
        {
            var companyGuid = User.GetCompanyGuid();
            var list = await _service.GetByServicePublicIdAsync(companyGuid, serviceGuid);
            return Ok(list);
        }

        /// <summary>
        /// 3) GET /api/executor-services/executor/{executorGuid}
        ///    Список услуг, которые оказывает исполнитель executorGuid.
        ///    Компания видит только своих исполнителей; исполнитель видит только себя.                 ////////////// потом переделать ///////////////
        /// </summary>
        [HttpGet("executor/{executorGuid:guid}")]
        [Authorize]  // CompanyPolicy или ExecutorPolicy
        public async Task<IActionResult> GetByExecutor(Guid executorGuid)
        {
            var role = User.FindFirstValue(ClaimTypes.Role)!;
            if (role == "Company")
            {
                var companyGuid = User.GetCompanyGuid();
                var list = await _service.GetByExecutorPublicIdForCompanyAsync(companyGuid, executorGuid);
                return Ok(list);
            }
            else // Executor
            {
                var myGuid = User.GetExecutorGuid();
                if (executorGuid.ToString() != myGuid)
                    return Forbid();
                var list = await _service.GetByExecutorPublicIdForExecutorAsync(myGuid, executorGuid);
                return Ok(list);
            }
        }

        /// <summary>Создать связь исполнитель–услуга (только компания)</summary>
        [HttpPost, Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> Create([FromBody] ExecutorHasServiceCreateDto dto)
        {
            var companyGuid = User.GetCompanyGuid();
            await _service.AddAsync(companyGuid, dto);
            return Ok(new { Message = "Связь создана" });
        }

        /// <summary>Удалить связь исполнитель–услуга (только компания)</summary>
        [HttpDelete("{executorGuid:guid}/{serviceGuid:guid}")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> Delete(Guid executorGuid, Guid serviceGuid)
        {
            var companyGuid = User.GetCompanyGuid();
            await _service.DeleteAsync(companyGuid, executorGuid, serviceGuid);
            return NoContent();
        }
    }
}
