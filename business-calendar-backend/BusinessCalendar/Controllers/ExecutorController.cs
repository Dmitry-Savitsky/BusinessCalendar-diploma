using BusinessCalendar.Application.DTOs.ExecutorDtos;
using BusinessCalendar.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Security.Claims;
using BusinessCalendar.Application.Helpers;
using BusinessCalendar.Application.DTOs.ExecutorWorkTimeDtos;

namespace BusinessCalendar.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExecutorController : ControllerBase
    {
        private readonly ExecutorService _executorService;
        private readonly IWebHostEnvironment _env;

        public ExecutorController(ExecutorService executorService, IWebHostEnvironment env)
        {
            _executorService = executorService;
            _env = env;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] ExecutorRegisterDto dto)
        {
            var result = await _executorService.RegisterExecutorAsync(dto);
            if (!result.IsSuccess)
                return BadRequest(result.ErrorMessage);

            return Ok(new { Token = result.Token });
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] ExecutorLoginDto dto)
        {
            var result = await _executorService.AuthenticateExecutorAsync(dto);
            if (!result.IsSuccess)
                return Unauthorized(result.ErrorMessage);

            return Ok(new { Token = result.Token });
        }

        [Authorize(Policy = "ExecutorPolicy")]
        [HttpPut("update/{executorGuid}")]
        public async Task<IActionResult> Update(
            string executorGuid,
            [FromForm] ExecutorUpdateDto dto,
            IFormFile? image)
        {
            // 🔐 Проверка, что executorGuid из токена совпадает с тем, что в URL
            var executorGuidFromToken = User.GetExecutorGuid();
            if (executorGuidFromToken != executorGuid)
            {
                return Forbid("You are not allowed to update another executor.");
            }

            var imagePath = image != null
                ? await SaveImageAsync(image)
                : string.Empty;

            await _executorService.UpdateExecutorAsync(executorGuid, dto, imagePath);
            return NoContent();
        }


        private async Task<string> SaveImageAsync(IFormFile image)
        {
            if (image == null || image.Length == 0)
                return string.Empty;

            var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(image.FileName)}";
            var imagesFolder = Path.Combine(_env.WebRootPath, "images");
            Directory.CreateDirectory(imagesFolder);

            var filePath = Path.Combine(imagesFolder, uniqueFileName);
            await using var stream = new FileStream(filePath, FileMode.Create);
            await image.CopyToAsync(stream);

            return "/images/" + uniqueFileName;
        }

        // POST /api/executor              (CompanyPolicy)
        [Authorize(Policy = "CompanyPolicy")]
        [HttpPost("add")]
        public async Task<IActionResult> AddExecutor([FromBody] ExecutorAddDto dto)
        {
            // companyGuid теперь достаём из токена
            var companyGuid = User.GetCompanyGuid();
            await _executorService.AddExecutorAsync(companyGuid, dto);
            return Ok();
        }

        // DELETE /api/executor/{executorGuid}    (CompanyPolicy)
        [Authorize(Policy = "CompanyPolicy")]
        [HttpDelete("{executorGuid:guid}")]
        public async Task<IActionResult> DeleteExecutor(Guid executorGuid)
        {
            var companyGuid = User.GetCompanyGuid();
            await _executorService.DeleteExecutorAsync(companyGuid, executorGuid.ToString());
            return NoContent();
        }

        // GET /api/executor                 (CompanyPolicy) — список всех
        [Authorize(Policy = "CompanyPolicy")]
        [HttpGet]
        public async Task<IActionResult> GetExecutors()
        {
            var companyGuid = User.GetCompanyGuid();
            var list = await _executorService.GetExecutorsForCompanyAsync(companyGuid);
            return Ok(list);
        }

        // GET /api/executor/{executorGuid}    (CompanyPolicy) — один
        [Authorize(Policy = "CompanyPolicy")]
        [HttpGet("{executorGuid:guid}")]
        public async Task<IActionResult> GetExecutor(Guid executorGuid)
        {
            var companyGuid = User.GetCompanyGuid();
            var dto = await _executorService.GetExecutorByGuidAsync(executorGuid.ToString(), companyGuid);
            return Ok(dto);
        }

        [Authorize(Policy = "ExecutorPolicy")]
        [HttpGet("me")]
        public async Task<IActionResult> GetSelf()
        {
            var executorGuid = User.GetExecutorGuid();
            var executor = await _executorService.GetExecutorSelfAsync(executorGuid);
            return Ok(executor);
        }

        // GET /api/executor/{executorGuid}/worktime    (CompanyPolicy)
        [Authorize(Policy = "CompanyPolicy")]
        [HttpGet("{executorGuid:guid}/worktime")]
        public async Task<IActionResult> GetWorkTime(Guid executorGuid)
        {
            var companyGuid = User.GetCompanyGuid();
            var list = await _executorService.GetWorkTimeAsync(companyGuid, executorGuid.ToString());
            return Ok(list);
        }

        // PUT /api/executor/{executorGuid}/worktime    (CompanyPolicy)
        [Authorize(Policy = "CompanyPolicy")]
        [HttpPut("{executorGuid:guid}/worktime")]
        public async Task<IActionResult> UpdateWorkTime(
            Guid executorGuid,
            [FromBody] List<ExecutorWorkTimeDto> dto)
        {
            var companyGuid = User.GetCompanyGuid();
            await _executorService.UpdateWorkTimeAsync(companyGuid, executorGuid.ToString(), dto);
            return NoContent();
        }
    }
}
