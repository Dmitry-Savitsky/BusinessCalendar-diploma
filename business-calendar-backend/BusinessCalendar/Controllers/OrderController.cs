using BusinessCalendar.Application.DTOs.OrdersDtos;
using BusinessCalendar.Application.Services;
using BusinessCalendar.Application.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace BusinessCalendar.Presentation.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrderController(OrderService orderService)
            => _orderService = orderService;

        // -----------------------------------------------------
        // 1) Company — CRUD & статус
        // -----------------------------------------------------

        /// <summary>
        /// Получить все заказы компании
        /// GET /api/orders?companyGuid=...
        /// </summary>
        [HttpGet]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> GetAll([FromQuery] string companyGuid)
        {
            // Проверяем, что токен содержит тот же companyGuid
            if (User.GetCompanyGuid() != companyGuid)
                return Forbid();

            var list = await _orderService.GetAllForCompanyAsync(companyGuid);
            return Ok(list);
        }

        /// <summary>
        /// Получить один заказ по его GUID
        /// GET /api/orders/{orderGuid}?companyGuid=...
        /// </summary>
        [HttpGet("{orderGuid:guid}")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> GetById(
            [FromRoute] Guid orderGuid,
            [FromQuery] string companyGuid)
        {
            if (User.GetCompanyGuid() != companyGuid)
                return Forbid();

            var dto = await _orderService.GetByPublicIdAsync(companyGuid, orderGuid);
            return Ok(dto);
        }

        /// <summary>
        /// Создать заказ (CRM)
        /// POST /api/orders/company
        /// </summary>
        [HttpPost("company")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> CreateByCompany(
            [FromBody] OrderCreateDto dto)
        {
            // dto.CompanyGuid тоже проверится внутри сервиса
            var result = await _orderService.CreateOrderAsync(dto);
            return CreatedAtAction(
                nameof(GetById),
                new { orderGuid = result.PublicId, companyGuid = dto.CompanyGuid },
                result);
        }

        /// <summary>
        /// Обновить только флаги Confirmed/Completed
        /// PUT /api/orders/{orderGuid}?companyGuid=...
        /// </summary>
        [HttpPut("{orderGuid:guid}")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> UpdateStatus(
            [FromRoute] Guid orderGuid,
            [FromQuery] string companyGuid,
            [FromBody] OrderUpdateDto dto)
        {
            if (User.GetCompanyGuid() != companyGuid)
                return Forbid();

            await _orderService.UpdateAsync(companyGuid, orderGuid, dto);
            return NoContent();
        }

        /// <summary>
        /// Удалить заказ
        /// DELETE /api/orders/{orderGuid}?companyGuid=...
        /// </summary>
        [HttpDelete("{orderGuid:guid}")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> Delete(
            [FromRoute] Guid orderGuid,
            [FromQuery] string companyGuid)
        {
            if (User.GetCompanyGuid() != companyGuid)
                return Forbid();

            await _orderService.DeleteAsync(companyGuid, orderGuid);
            return NoContent();
        }

        // -----------------------------------------------------
        // 2) Widget (No policy) — только создание
        // -----------------------------------------------------

        /// <summary>
        /// Создать заказ из публичного виджета
        /// POST /api/orders/widget
        /// </summary>
        [HttpPost("widget")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateByWidget(
            [FromBody] OrderCreateDto dto)
        {
            // В dto.CompanyGuid приходит из data‑attribute виджета
            var result = await _orderService.CreateOrderAsync(dto);
            return Ok(result);
        }
    }
}
