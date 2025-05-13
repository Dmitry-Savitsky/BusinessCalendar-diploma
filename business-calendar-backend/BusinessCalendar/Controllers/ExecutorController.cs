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
using BusinessCalendar.Application.DTOs.ExecutorWorkTimeDtos.BusinessCalendar.Application.DTOs;

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

        [Authorize(Policy = "CompanyPolicy")]
        [HttpPost("{companyGuid}/add")]
        public async Task<IActionResult> AddExecutor(string companyGuid, [FromBody] ExecutorAddDto dto)
        {
            var tokenCompanyGuid = User.GetCompanyGuid();
            if (tokenCompanyGuid != companyGuid)
                return Forbid("Нельзя добавлять исполнителей для другой компании.");

            await _executorService.AddExecutorAsync(companyGuid, dto);
            return Ok();
        }

        [Authorize(Policy = "CompanyPolicy")]
        [HttpDelete("{companyGuid}/delete/{executorGuid}")]
        public async Task<IActionResult> DeleteExecutor(string companyGuid, string executorGuid)
        {
            var tokenCompanyGuid = User.GetCompanyGuid();
            if (tokenCompanyGuid != companyGuid)
                return Forbid("Нельзя удалять исполнителей другой компании.");

            await _executorService.DeleteExecutorAsync(companyGuid, executorGuid);
            return Ok();
        }

        [Authorize(Policy = "CompanyPolicy")]
        [HttpGet("{companyGuid}/all")]
        public async Task<IActionResult> GetExecutors(string companyGuid)
        {
            var tokenCompanyGuid = User.GetCompanyGuid();
            if (tokenCompanyGuid != companyGuid)
                return Forbid("Нельзя получить исполнителей другой компании.");

            var executors = await _executorService.GetExecutorsForCompanyAsync(companyGuid);
            return Ok(executors);
        }

        [Authorize(Policy = "CompanyPolicy")]
        [HttpGet("{companyGuid}/executor/{executorGuid}")]
        public async Task<IActionResult> GetExecutor(string companyGuid, string executorGuid)
        {
            var tokenCompanyGuid = User.GetCompanyGuid();
            if (tokenCompanyGuid != companyGuid)
                return Forbid("Нельзя получить информацию о чужом исполнителе.");

            var executor = await _executorService.GetExecutorByGuidAsync(executorGuid, companyGuid);
            return Ok(executor);
        }

        [Authorize(Policy = "ExecutorPolicy")]
        [HttpGet("me")]
        public async Task<IActionResult> GetSelf()
        {
            var executorGuid = User.GetExecutorGuid();
            var executor = await _executorService.GetExecutorSelfAsync(executorGuid);
            return Ok(executor);
        }

        [HttpGet("{companyGuid}/executor/{executorGuid}/worktime")]
        public async Task<IActionResult> GetWorkTime(string companyGuid, string executorGuid)
        {
            if (User.GetCompanyGuid() != companyGuid)
                return Forbid();

            var list = await _executorService.GetWorkTimeAsync(companyGuid, executorGuid);
            return Ok(list);
        }

        // PUT обновить расписание
        [HttpPut("{companyGuid}/executor/{executorGuid}/worktime")]
        public async Task<IActionResult> UpdateWorkTime(
            string companyGuid,
            string executorGuid,
            [FromBody] List<ExecutorWorkTimeDto> dto)
        {
            if (User.GetCompanyGuid() != companyGuid)
                return Forbid();

            await _executorService.UpdateWorkTimeAsync(companyGuid, executorGuid, dto);
            return NoContent();
        }
    }
}
