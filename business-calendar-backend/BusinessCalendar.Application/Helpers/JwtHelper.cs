using BusinessCalendar.Core.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BusinessCalendar.Application.Helpers
{
    public static class JwtHelper
    {
        public static string GenerateCompanyJwtToken(Company company, IConfiguration configuration)
        {
            var claims = new[]
            {
                new Claim("CompanyId", company.Id.ToString()),
                new Claim("CompanyGuid", company.PublicId.ToString()),
                new Claim(ClaimTypes.Role, "Company")
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["Jwt:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static string GenerateExecutorJwtToken(Executor executor, IConfiguration configuration)
        {
            var claims = new[]
            {
                new Claim("ExecutorId", executor.Id.ToString()),
                new Claim("ExecutorGuid", executor.PublicId.ToString()),
                new Claim(ClaimTypes.Role, "Executor")
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["Jwt:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
