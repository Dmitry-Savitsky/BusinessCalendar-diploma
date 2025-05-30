﻿using BusinessCalendar.Application.Helpers;
using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Exceptions;
using BusinessCalendar.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using BusinessCalendar.Application.Common;
using System.Threading.Tasks;
using BusinessCalendar.Application.DTOs.ExecutorDtos;
using BusinessCalendar.Application.DTOs.ExecutorWorkTimeDtos;

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
            // 1) Проверяем GUID
            var executorGuid = dto.ExecutorGuid;
            // 2) Достаём исполнителя по GUID
            var executor = await _unitOfWork.ExecutorRepository.GetByGuidAsync(executorGuid);
            if (executor == null)
                throw new NotFoundException("Исполнитель с таким GUID не найден.");

            // 3) Проверяем, что номер телефона совпадает
            if (executor.ExecutorPhone != dto.ExecutorPhone)
                throw new UnauthorizedException("Телефон не соответствует зарегистрированному за исполнителем.");

            // 4) Проверяем, что он ещё не зарегистрирован
            if (executor.IsRegistered)
                throw new AlreadyExistsException("Исполнитель уже зарегистрирован.");

            // 5) Устанавливаем пароль и сохраняем
            executor.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            _unitOfWork.Executors.Update(executor);
            await _unitOfWork.SaveChangesAsync();

            // 6) Генерируем JWT
            string token = JwtHelper.GenerateExecutorJwtToken(executor, _configuration);

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


        public async Task UpdateExecutorAsync(
            string executorGuid,
            ExecutorUpdateDto dto,
            string imagePath,
            string role,
            string? companyGuidFromToken,
            string? executorGuidFromToken)
        {
            if (!Guid.TryParse(executorGuid, out var parsedGuid))
                throw new ArgumentException("Некорректный формат GUID исполнителя.");

            var executor = await _unitOfWork.ExecutorRepository.GetByGuidAsync(parsedGuid);
            if (executor == null)
                throw new NotFoundException($"Исполнитель с GUID={executorGuid} не найден.");

            if (role == "Executor")
            {
                if (executor.PublicId.ToString() != executorGuidFromToken)
                    throw new Exception("Вы не можете изменить другого исполнителя.");
            }
            else if (role == "Company")
            {
                if (executor.Company.PublicId.ToString() != companyGuidFromToken)
                    throw new Exception("Вы не можете изменить исполнителя другой компании.");
            }
            else
            {
                throw new Exception("Недопустимая роль.");
            }

            if (!string.IsNullOrEmpty(dto.ExecutorName))
                executor.ExecutorName = dto.ExecutorName;
            if (!string.IsNullOrEmpty(dto.ExecutorPhone))
                executor.ExecutorPhone = dto.ExecutorPhone;
            if (!string.IsNullOrEmpty(dto.Description))
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

        /// <summary>
        /// Обновить расписание исполнителя. Компания может менять только своё.
        /// </summary>
        public async Task UpdateWorkTimeAsync(
            string companyGuid,
            string executorGuid,
            List<ExecutorWorkTimeDto> dto)
        {
            // 1. Найти исполнителя
            var executor = await _unitOfWork.ExecutorRepository
                .GetByGuidAsync(Guid.Parse(executorGuid))
                ?? throw new NotFoundException("Исполнитель не найден.");

            // 2. Проверить, что исполнитель принадлежит компании:
            if (executor.Company.PublicId.ToString() != companyGuid)
                throw new UnauthorizedException("Нет доступа к расписанию этого исполнителя.");

            // 3. Загрузить все существующие записи расписания
            var existing = await _unitOfWork.ExecutorWorkTimeRepository
                .GetByExecutorIdAsync(executor.Id);

            // 4. Пройти по DTO и обновить каждую запись
            foreach (var wtDto in dto)
            {
                // ищем запись по дню недели
                var record = existing.FirstOrDefault(x => x.DayNo == wtDto.DayNo);
                if (record == null)
                    continue; // если нет записи на этот день — пропустить

                // обновляем
                record.IsWorking = wtDto.IsWorking;
                record.FromTime = wtDto.FromTime;
                record.TillTime = wtDto.TillTime;
                record.BreakStart = wtDto.BreakStart;
                record.BreakEnd = wtDto.BreakEnd;

                _unitOfWork.ExecutorWorkTimeRepository.Update(record);
            }

            // 5. Сохраняем изменения
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

        /// <summary>
        /// Исполнитель получает своё расписание (по токену).
        /// </summary>
        public async Task<List<ExecutorWorkTimeDto>> GetMyWorkTimeAsync(string executorGuid)
        {
            // 1) Парсим GUID исполнителя
            if (!Guid.TryParse(executorGuid, out var parsedGuid))
                throw new ArgumentException("Некорректный GUID исполнителя.");

            // 2) Находим исполнителя
            var executor = await _unitOfWork.ExecutorRepository
                                             .GetByGuidAsync(parsedGuid)
                             ?? throw new NotFoundException("Исполнитель не найден.");

            // 3) Загружаем расписание
            var workTimes = await _unitOfWork.ExecutorWorkTimeRepository
                                            .GetByExecutorIdAsync(executor.Id);

            // 4) Маппим в DTO
            return workTimes
                .Select(w => new ExecutorWorkTimeDto
                {
                    DayNo = w.DayNo!.Value,
                    IsWorking = w.IsWorking,
                    FromTime = w.FromTime!.Value,
                    TillTime = w.TillTime!.Value,
                    BreakStart = w.BreakStart!.Value,
                    BreakEnd = w.BreakEnd!.Value
                })
                .ToList();
        }





        ///////////////////// ВИДЖЕТ //////////////////





        public async Task<List<ExecutorDto>> GetAllForWidgetAsync(Guid companyGuid)
        {
            var company = await _unitOfWork.CompanyRepository.GetByGuidAsync(companyGuid)
                          ?? throw new NotFoundException("Компания не найдена.");

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



    }

}
