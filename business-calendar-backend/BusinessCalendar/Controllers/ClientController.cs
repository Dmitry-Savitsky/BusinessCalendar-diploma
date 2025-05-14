using BusinessCalendar.Application.DTOs.ClientsDtos;
using BusinessCalendar.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BusinessCalendar.Application.Helpers;

namespace BusinessCalendar.Presentation.Controllers
{
    [ApiController]
    [Route("api/company/clients")]
    public class CompanyClientController : ControllerBase
    {
        private readonly ClientService _svc;
        public CompanyClientController(ClientService svc) => _svc = svc;

        [HttpGet]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> GetAll()
        {
            var companyGuid = User.GetCompanyGuid();
            var list = await _svc.GetClientsForCompanyAsync(companyGuid);
            return Ok(list);
        }

        [HttpPost]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> Create([FromBody] ClientCreateDto dto)
        {
            var companyGuid = User.GetCompanyGuid();
            var created = await _svc.CreateClientAsync(companyGuid, dto);
            return CreatedAtAction(nameof(GetOne), new { clientGuid = created.PublicId }, created);
        }

        [HttpGet("{clientGuid:guid}")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> GetOne(Guid clientGuid)
        {
            var companyGuid = User.GetCompanyGuid();
            var client = await _svc.GetClientsForCompanyAsync(companyGuid)
                .ContinueWith(t => t.Result.FirstOrDefault(c => c.PublicId == clientGuid));
            if (client == null) return NotFound();
            return Ok(client);
        }

        [HttpPut("{clientGuid:guid}")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> Update(Guid clientGuid, [FromBody] ClientUpdateDto dto)
        {
            var companyGuid = User.GetCompanyGuid();
            var updated = await _svc.UpdateClientAsync(companyGuid, clientGuid, dto);
            return Ok(updated);
        }

        [HttpDelete("{clientGuid:guid}")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> Delete(Guid clientGuid)
        {
            var companyGuid = User.GetCompanyGuid();
            await _svc.DeleteClientAsync(companyGuid, clientGuid);
            return NoContent();
        }

        [HttpPost("{clientGuid:guid}/address")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> AddAddress(Guid clientGuid, [FromBody] ClientAddressCreateDto dto)
        {
            var companyGuid = User.GetCompanyGuid();
            var updated = await _svc.AddAddressAsync(companyGuid, clientGuid, dto);
            return Ok(updated);
        }
    }

    [ApiController]
    [Route("api/clients")]
    public class PublicClientController : ControllerBase
    {
        private readonly ClientService _svc;
        public PublicClientController(ClientService svc) => _svc = svc;

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] ClientCreateDto dto)
        {
            var created = await _svc.SelfRegisterClientAsync(dto);
            return Ok(created);
        }

        [HttpPost("{clientGuid:guid}/address")]
        public async Task<IActionResult> AddAddress(Guid clientGuid, [FromBody] ClientAddressCreateDto dto)
        {
            var updated = await _svc.SelfAddAddressAsync(clientGuid, dto);
            return Ok(updated);
        }
    }

}
