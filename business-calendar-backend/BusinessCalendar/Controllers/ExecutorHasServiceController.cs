using BusinessCalendar.Application.DTOs.ExecutorHasServiceDtos;
using BusinessCalendar.Application.Helpers;
using BusinessCalendar.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        {
            _service = service;
        }

        // ----- GET -----
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Get()
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
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

        // ----- POST -----
        [HttpPost]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> Post([FromBody] ExecutorHasServiceCreateDto dto)
        {
            var companyGuid = User.GetCompanyGuid();
            await _service.AddAsync(companyGuid, dto);
            return Ok(new { Message = "Связь создана" });
        }

        // ----- DELETE -----
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
