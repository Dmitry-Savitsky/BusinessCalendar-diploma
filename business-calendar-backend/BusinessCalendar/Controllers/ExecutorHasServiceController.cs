using BusinessCalendar.Application.DTOs;
using BusinessCalendar.Application.DTOs.ExecutorHasServiceDtos;
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
        [Authorize(Policy = "ExecutorPolicy")]
        public async Task<IActionResult> Get()
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
            if (role == "Company")
            {
                var cid = int.Parse(User.FindFirstValue("CompanyId"));
                var list = await _service.GetForCompanyAsync(cid);
                return Ok(list);
            }
            else // Executor
            {
                var eid = int.Parse(User.FindFirstValue("ExecutorId"));
                var list = await _service.GetForExecutorAsync(eid);
                return Ok(list);
            }
        }

        // ----- POST -----
        [HttpPost]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> Post([FromBody] ExecutorHasServiceCreateDto dto)
        {
            var companyId = int.Parse(User.FindFirstValue("CompanyId"));
            await _service.AddAsync(companyId, dto);
            return Ok(new { Message = "Связь создана" });
        }

        // ----- DELETE -----
        [HttpDelete("{executorId:int}/{serviceId:int}")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> Delete(int executorId, int serviceId)
        {
            var companyId = int.Parse(User.FindFirstValue("CompanyId"));
            await _service.DeleteAsync(companyId, executorId, serviceId);
            return NoContent();
        }
    }
}
