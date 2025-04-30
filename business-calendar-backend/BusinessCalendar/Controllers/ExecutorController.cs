using BusinessCalendar.Application.DTOs.ExecutorDtos;
using BusinessCalendar.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

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
    }
}
