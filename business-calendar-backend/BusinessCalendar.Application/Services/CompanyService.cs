using BusinessCalendar.Application.Helpers;
using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Exceptions;
using BusinessCalendar.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using BusinessCalendar.Application.Common;
using System;
using System.Threading.Tasks;
using BusinessCalendar.Application.DTOs.CompanyDtos;

namespace BusinessCalendar.Application.Services
{
    public class CompanyService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public CompanyService(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        public async Task<AuthResult> RegisterCompanyAsync(CompanyRegisterDto registerDto)
        {
            var existingCompany = await _unitOfWork.CompanyRepository.GetByLoginAsync(registerDto.Login);
            if (existingCompany != null)
                throw new AlreadyExistsException("Компания с таким логином уже существует.");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
            var newCompany = new Company
            {
                CompanyName = registerDto.CompanyName,
                CompanyPhone = registerDto.CompanyPhone,
                CompanyAddress = registerDto.CompanyAddress,
                Login = registerDto.Login,
                Password = hashedPassword,
                PublicId = Guid.NewGuid()
            };

            await _unitOfWork.Companies.AddAsync(newCompany);
            await _unitOfWork.SaveChangesAsync();

            var token = JwtHelper.GenerateCompanyJwtToken(newCompany, _configuration);

            return AuthResult.Success(token);
        }

        public async Task<AuthResult> AuthenticateCompanyAsync(CompanyLoginDto loginDto)
        {
            var company = await _unitOfWork.CompanyRepository.GetByLoginAsync(loginDto.Login);
            if (company == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, company.Password))
                throw new UnauthorizedException("Неверный логин или пароль.");

            var token = JwtHelper.GenerateCompanyJwtToken(company, _configuration);

            return AuthResult.Success(token);
        }

        public async Task UpdateCompanyAsync(string companyGuid, CompanyUpdateDto dto, string imagePath)
        {
            if (!Guid.TryParse(companyGuid, out var parsedGuid))
                throw new ArgumentException("Некорректный формат GUID компании.");

            var company = await _unitOfWork.CompanyRepository.GetByGuidAsync(parsedGuid);
            if (company == null)
                throw new NotFoundException($"Компания с GUID={companyGuid} не найдена.");

            if (!string.IsNullOrEmpty(dto.CompanyName))
                company.CompanyName = dto.CompanyName;
            if (!string.IsNullOrEmpty(dto.CompanyPhone))
                company.CompanyPhone = dto.CompanyPhone;
            if (!string.IsNullOrEmpty(dto.CompanyAddress))
                company.CompanyAddress = dto.CompanyAddress;

            if (!string.IsNullOrEmpty(imagePath))
                company.ImgPath = imagePath;

            _unitOfWork.Companies.Update(company);
            await _unitOfWork.SaveChangesAsync();
        }

    }
}
