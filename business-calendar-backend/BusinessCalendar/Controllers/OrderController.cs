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

        /// <summary>Получить все заказы компании</summary>
        /// GET /api/orders
        [HttpGet]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> GetAll()
        {
            var companyGuid = User.GetCompanyGuid();
            var list = await _orderService.GetAllForCompanyAsync(companyGuid);
            return Ok(list);
        }

        /// <summary>Получить один заказ по его GUID</summary>
        /// GET /api/orders/{orderGuid}
        [HttpGet("{orderGuid:guid}")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> GetById(Guid orderGuid)
        {
            var companyGuid = User.GetCompanyGuid();
            var dto = await _orderService.GetByPublicIdAsync(companyGuid, orderGuid);
            return Ok(dto);
        }

        /// <summary>Создать заказ (CRM)</summary>
        /// POST /api/orders/company
        [HttpPost("company")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> CreateByCompany([FromBody] OrderCreateDto dto)
        {
            // companyGuid будет проверён внутри сервиса
            dto.CompanyGuid = User.GetCompanyGuid();
            var result = await _orderService.CreateOrderAsync(dto);
            return CreatedAtAction(
                nameof(GetById),
                new { orderGuid = result.PublicId },
                result);
        }

        /// <summary>Обновить только флаги Confirmed/Completed</summary>
        /// PUT /api/orders/{orderGuid}
        [HttpPut("{orderGuid:guid}")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> UpdateStatus(
            Guid orderGuid,
            [FromBody] OrderUpdateDto dto)
        {
            var companyGuid = User.GetCompanyGuid();
            await _orderService.UpdateAsync(companyGuid, orderGuid, dto);
            return NoContent();
        }

        /// <summary>Удалить заказ</summary>
        /// DELETE /api/orders/{orderGuid}
        [HttpDelete("{orderGuid:guid}")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> Delete(Guid orderGuid)
        {
            var companyGuid = User.GetCompanyGuid();
            await _orderService.DeleteAsync(companyGuid, orderGuid);
            return NoContent();
        }

        // -----------------------------------------------------
        // 2) Widget (No policy) — только создание
        // -----------------------------------------------------

        /// <summary>Создать заказ из публичного виджета</summary>
        /// POST /api/orders/widget
        [HttpPost("widget")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateByWidget([FromBody] OrderCreateDto dto)
        {
            // dto.CompanyGuid приходит из data‑attribute виджета
            var result = await _orderService.CreateOrderAsync(dto);
            return Ok(result);
        }
    }
}
