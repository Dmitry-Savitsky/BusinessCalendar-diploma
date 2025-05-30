﻿using BusinessCalendar.Application.DTOs.CompanyDtos;
using BusinessCalendar.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;
using BusinessCalendar.Application.Helpers;

namespace BusinessCalendar.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompanyController : ControllerBase
    {
        private readonly CompanyService _companyService;
        private readonly IWebHostEnvironment _env;

        public CompanyController(CompanyService companyService, IWebHostEnvironment env)
        {
            _companyService = companyService;
            _env = env;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] CompanyRegisterDto registerDto)
        {
            var result = await _companyService.RegisterCompanyAsync(registerDto);
            if (!result.IsSuccess)
                return BadRequest(result.ErrorMessage);

            return Ok(new { Token = result.Token });
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] CompanyLoginDto loginDto)
        {
            var result = await _companyService.AuthenticateCompanyAsync(loginDto);
            if (!result.IsSuccess)
                return Unauthorized(result.ErrorMessage);

            return Ok(new { Token = result.Token });
        }

        [Authorize(Policy = "CompanyPolicy")]
        [HttpPut("update")]
        public async Task<IActionResult> Update(
            [FromForm] CompanyUpdateDto dto,
            IFormFile? image)
        {
            var companyGuid = User.GetCompanyGuid();

            var imagePath = image != null
                ? await SaveImageAsync(image)
                : string.Empty;

            await _companyService.UpdateCompanyAsync(companyGuid, dto, imagePath);
            return NoContent();
        }

        // <summary>
        /// GET /api/company/me
        /// Получить свой профиль компании
        /// </summary>
        [HttpGet("me")]
        [Authorize(Policy = "CompanyPolicy")]
        public async Task<IActionResult> GetSelf()
        {
            // извлекаем companyGuid из токена (уже гарантированно есть и валиден, т.к. Policy пропустил)
            var companyGuid = User.GetCompanyGuid();
            var dto = await _companyService.GetSelfAsync(companyGuid);
            return Ok(dto);
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
