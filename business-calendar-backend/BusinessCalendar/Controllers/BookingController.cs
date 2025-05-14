using BusinessCalendar.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusinessCalendar.Presentation.Controllers
{
    [ApiController]
    [Route("api/booking")]
    public class BookingController : ControllerBase
    {
        private readonly BookingService _svc;
        public BookingController(BookingService svc) => _svc = svc;

        /// <summary>
        /// Виджет (public): получает слоты по executorGuid,serviceGuid,date
        /// </summary>
        [HttpGet("slots/widget")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSlotsForWidget(
            [FromQuery] Guid serviceGuid,
            [FromQuery] Guid executorGuid,
            [FromQuery] DateTimeOffset date)
        {
            var slots = await _svc.GetSlotsAsync(null, serviceGuid, executorGuid, date);
            return Ok(slots);
        }

        /// <summary>
        /// CRM‑панель (company): получает слоты по companyGuid+остальным
        /// </summary>
        [HttpGet("slots")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> GetSlotsForCompany(
            [FromQuery] string companyGuid,
            [FromQuery] Guid serviceGuid,
            [FromQuery] Guid executorGuid,
            [FromQuery] DateTimeOffset date)
        {
            // companyGuid проверяется внутри сервиса
            var slots = await _svc.GetSlotsAsync(companyGuid, serviceGuid, executorGuid, date);
            return Ok(slots);
        }
    }

}
