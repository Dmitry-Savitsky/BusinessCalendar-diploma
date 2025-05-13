using BusinessCalendar.Application.Helpers;
using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Exceptions;
using BusinessCalendar.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using BusinessCalendar.Application.Common;
using System.Threading.Tasks;
using BusinessCalendar.Application.DTOs.ExecutorDtos;
using BusinessCalendar.Application.DTOs.ExecutorWorkTimeDtos.BusinessCalendar.Application.DTOs;

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
            if(!string.IsNullOrEmpty(dto.Description)) 
                executor.Description = dto.Description;

            if (!string.IsNullOrEmpty(imagePath))
                executor.ImgPath = imagePath;

            _unitOfWork.Executors.Update(executor);
            await _unitOfWork.SaveChangesAsync();
        }

        private static readonly ExecutorWorkTimeDto[] _defaultSchedule = Enumerable.Range(0, 7)
        .Select(d => new ExecutorWorkTimeDto
        {
            DayNo = d,
            IsWorking = false,
            FromTime = new TimeOnly(9, 0),
            TillTime = new TimeOnly(18, 0),
            BreakStart = new TimeOnly(14, 0),
            BreakEnd = new TimeOnly(15, 0)
        }).ToArray();

        public async Task AddExecutorAsync(string companyGuid, ExecutorAddDto dto)
        {
            var company = await _unitOfWork.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid));
            if (company == null) throw new NotFoundException("Компания не найдена.");

            var executor = new Executor
            {
                ExecutorName = dto.ExecutorName,
                ExecutorPhone = dto.ExecutorPhone,
                Description = dto.Description,
                CompanyId = company.Id
            };
            await _unitOfWork.Executors.AddAsync(executor);
            await _unitOfWork.SaveChangesAsync();

            // создаём 7 записей расписания
            foreach (var wt in _defaultSchedule)
            {
                await _unitOfWork.ExecutorWorkTimeRepository.AddAsync(new ExecutorWorkTime
                {
                    ExecutorId = executor.Id,
                    DayNo = wt.DayNo,
                    IsWorking = wt.IsWorking,
                    FromTime = wt.FromTime,
                    TillTime = wt.TillTime,
                    BreakStart = wt.BreakStart,
                    BreakEnd = wt.BreakEnd
                });
            }
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteExecutorAsync(string companyGuid, string executorGuid)
        {
            var executor = await _unitOfWork.ExecutorRepository.GetByGuidAsync(Guid.Parse(executorGuid));
            if (executor == null) throw new NotFoundException("Исполнитель не найден.");
            if (executor.Company.PublicId.ToString() != companyGuid)
                throw new Exception("Нельзя удалить чужого исполнителя.");

            // удаляем расписание
            await _unitOfWork.ExecutorWorkTimeRepository.DeleteByExecutorIdAsync(executor.Id);

            _unitOfWork.Executors.Delete(executor);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<List<ExecutorWorkTimeDto>> GetWorkTimeAsync(string companyGuid, string executorGuid)
        {
            var executor = await _unitOfWork.ExecutorRepository.GetByGuidAsync(Guid.Parse(executorGuid));
            if (executor == null) throw new NotFoundException("Исполнитель не найден.");
            if (executor.Company.PublicId.ToString() != companyGuid)
                throw new Exception("Нет доступа к расписанию этого исполнителя.");

            var list = await _unitOfWork.ExecutorWorkTimeRepository.GetByExecutorIdAsync(executor.Id);
            return list.Select(w => new ExecutorWorkTimeDto
            {
                DayNo = w.DayNo!.Value,
                IsWorking = w.IsWorking,
                FromTime = w.FromTime!.Value,
                TillTime = w.TillTime!.Value,
                BreakStart = w.BreakStart!.Value,
                BreakEnd = w.BreakEnd!.Value
            }).ToList();
        }

        public async Task UpdateWorkTimeAsync(string companyGuid, string executorGuid, List<ExecutorWorkTimeDto> dto)
        {
            var executor = await _unitOfWork.ExecutorRepository.GetByGuidAsync(Guid.Parse(executorGuid));
            if (executor == null) throw new NotFoundException("Исполнитель не найден.");
            if (executor.Company.PublicId.ToString() != companyGuid)
                throw new Exception("Нет доступа к расписанию этого исполнителя.");

            var existing = await _unitOfWork.ExecutorWorkTimeRepository.GetByExecutorIdAsync(executor.Id);
            foreach (var wt in dto)
            {
                var w = existing.FirstOrDefault(x => x.DayNo == wt.DayNo);
                if (w == null) continue;
                w.IsWorking = wt.IsWorking;
                w.FromTime = wt.FromTime;
                w.TillTime = wt.TillTime;
                w.BreakStart = wt.BreakStart;
                w.BreakEnd = wt.BreakEnd;
                _unitOfWork.ExecutorWorkTimeRepository.Update(w);
            }
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<List<ExecutorDto>> GetExecutorsForCompanyAsync(string companyGuid)
        {
            var company = await _unitOfWork.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid));
            if (company == null)
                throw new NotFoundException("Компания не найдена.");

            var executors = await _unitOfWork.ExecutorRepository.GetAllByCompanyIdAsync(company.Id);

            return executors.Select(e => new ExecutorDto
            {
                Guid = e.PublicId.ToString(),
                Name = e.ExecutorName,
                Phone = e.ExecutorPhone,
                Description = e.Description,
                ImgPath = e.ImgPath
            }).ToList();
        }

        public async Task<ExecutorDto> GetExecutorByGuidAsync(string executorGuid, string? companyGuid = null)
        {
            var executor = await _unitOfWork.ExecutorRepository.GetByGuidAsync(Guid.Parse(executorGuid));
            if (executor == null)
                throw new NotFoundException("Исполнитель не найден.");

            if (companyGuid != null && executor.Company.PublicId.ToString() != companyGuid)
                throw new Exception("Доступ запрещен.");

            return new ExecutorDto
            {
                Guid = executor.PublicId.ToString(),
                Name = executor.ExecutorName,
                Phone = executor.ExecutorPhone,
                Description = executor.Description,
                ImgPath = executor.ImgPath
            };
        }

        public async Task<ExecutorDto> GetExecutorSelfAsync(string executorGuidFromToken)
        {
            var executor = await _unitOfWork.ExecutorRepository.GetByGuidAsync(Guid.Parse(executorGuidFromToken));
            if (executor == null)
                throw new NotFoundException("Исполнитель не найден.");

            return new ExecutorDto
            {
                Guid = executor.PublicId.ToString(),
                Name = executor.ExecutorName,
                Phone = executor.ExecutorPhone,
                Description = executor.Description,
                ImgPath = executor.ImgPath
            };
        }

    }

}
