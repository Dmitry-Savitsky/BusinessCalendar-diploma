using BusinessCalendar.Application.Helpers;
using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Exceptions;
using BusinessCalendar.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using BusinessCalendar.Application.Common;
using System.Threading.Tasks;
using BusinessCalendar.Application.DTOs.ExecutorDtos;

namespace BusinessCalendar.Application.Services
{
    public class ExecutorService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public ExecutorService(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        public async Task<AuthResult> RegisterExecutorAsync(ExecutorRegisterDto dto)
        {
            if (!Guid.TryParse(dto.Guid, out var parsedGuid))
                throw new ArgumentException("Некорректный GUID");

            var executor = await _unitOfWork.ExecutorRepository.GetByGuidAsync(parsedGuid);
            if (executor == null)
                throw new NotFoundException("Executor с этим GUID не найден.");

            if (executor.IsRegistered)
                throw new AlreadyExistsException("Executor уже зарегистрирован.");

            executor.ExecutorName = dto.ExecutorName;
            executor.ExecutorPhone = dto.ExecutorPhone;
            executor.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            _unitOfWork.Executors.Update(executor);
            await _unitOfWork.SaveChangesAsync();

            var token = JwtHelper.GenerateExecutorJwtToken(executor, _configuration);
            return AuthResult.Success(token);
        }


        public async Task<AuthResult> AuthenticateExecutorAsync(ExecutorLoginDto dto)
        {
            var executor = await _unitOfWork.ExecutorRepository.GetByPhoneAsync(dto.ExecutorPhone);
            if (executor == null || string.IsNullOrEmpty(executor.Password))
                throw new UnauthorizedException("Неверный номер телефона или исполнитель не зарегистрирован.");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, executor.Password))
                throw new UnauthorizedException("Неверный пароль.");

            var token = JwtHelper.GenerateExecutorJwtToken(executor, _configuration);
            return AuthResult.Success(token);
        }


        public async Task UpdateExecutorAsync(string executorGuid, ExecutorUpdateDto dto, string imagePath)
        {
            if (!Guid.TryParse(executorGuid, out var parsedGuid))
                throw new ArgumentException("Некорректный формат GUID исполнителя.");

            var executor = await _unitOfWork.ExecutorRepository.GetByGuidAsync(parsedGuid);
            if (executor == null)
                throw new NotFoundException($"Executor с GUID={executorGuid} не найден.");

            if (!string.IsNullOrEmpty(dto.ExecutorName))
                executor.ExecutorName = dto.ExecutorName;
            if (!string.IsNullOrEmpty(dto.ExecutorPhone))
                executor.ExecutorPhone = dto.ExecutorPhone;
            if (!string.IsNullOrEmpty(dto.WorkTimeBegin))
                executor.WorkTimeBegin = dto.WorkTimeBegin;
            if (!string.IsNullOrEmpty(dto.WorkTimeEnd))
                executor.WorkTimeEnd = dto.WorkTimeEnd;

            if (!string.IsNullOrEmpty(imagePath))
                executor.ImgPath = imagePath;

            _unitOfWork.Executors.Update(executor);
            await _unitOfWork.SaveChangesAsync();
        }


    }


}
