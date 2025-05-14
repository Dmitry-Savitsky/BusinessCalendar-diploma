using BusinessCalendar.Core.Exceptions;
using BusinessCalendar.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Application.Services
{
    public class BookingService
    {
        private readonly IUnitOfWork _uow;
        private readonly TimeZoneInfo _tz = TimeZoneInfo.FindSystemTimeZoneById("Europe/Minsk");

        public BookingService(IUnitOfWork uow) => _uow = uow;

        public record SlotDto(DateTimeOffset Time, bool Available);

        /// <summary>
        /// Получить слоты бронирования на заданную дату.
        /// </summary>
        /// <param name="companyGuid">
        ///   Если задан, то проверяем, что это владелец сервиса (CRM‑панель).
        ///   Если null, выполняем только по executorGuid (виджет).
        /// </param>
        public async Task<List<SlotDto>> GetSlotsAsync(
            string? companyGuid,
            Guid serviceGuid,
            Guid executorGuid,
            DateTimeOffset date)
        {
            // 1) Загрузить сервис и исполнителя
            var service = await _uow.ServiceRepository.GetByGuidAsync(serviceGuid)
                ?? throw new NotFoundException("Сервис не найден");
            var executor = await _uow.ExecutorRepository.GetByGuidAsync(executorGuid)
                ?? throw new NotFoundException("Исполнитель не найден");

            // 2) Если companyGuid задан — проверяем владение сервисом
            if (companyGuid != null &&
                service.Company.PublicId.ToString() != companyGuid)
            {
                throw new UnauthorizedAccessException("Нет прав на этот сервис");
            }

            // 3) Длительность услуги
            int duration = service.DurationMinutes
                ?? throw new InvalidOperationException("У услуги не задана длительность");

            // 4) Окно генерации: сейчас+15мин ... +1 месяц
            var nowUtc = DateTime.UtcNow;
            var now = TimeZoneInfo.ConvertTime(nowUtc, _tz);
            var windowStart = now.AddMinutes(15);
            var windowEnd = windowStart.Date.AddMonths(1);

            // 5) Целевая дата в том же часовом поясе
            var targetLocal = TimeZoneInfo.ConvertTime(date.UtcDateTime, _tz).Date;
            if (targetLocal < windowStart.Date || targetLocal > windowEnd)
                return new List<SlotDto>();

            // 6) Расписание исполнителя в этот день
            int dayNo = (int)targetLocal.DayOfWeek;
            var worktimes = await _uow.ExecutorWorkTimeRepository.GetByExecutorIdAsync(executor.Id);
            var wt = worktimes.FirstOrDefault(w => w.DayNo == dayNo && w.IsWorking);
            if (wt == null) return new();

            // 7) Формируем рабочие интервалы (до и после перерыва)
            var intervals = new List<(TimeOnly S, TimeOnly E)>();
            if (wt.FromTime.HasValue && wt.BreakStart.HasValue)
                intervals.Add((wt.FromTime.Value, wt.BreakStart.Value));
            if (wt.BreakEnd.HasValue && wt.TillTime.HasValue)
                intervals.Add((wt.BreakEnd.Value, wt.TillTime.Value));

            // 8) Загружаем подтверждённые слоты исполнителя в этот день
            var fromUtc = TimeZoneInfo.ConvertTimeToUtc(targetLocal, _tz);
            var toUtc = TimeZoneInfo.ConvertTimeToUtc(targetLocal.AddDays(1), _tz);
            var existing = await _uow.ServiceInOrderRepository
                .GetConfirmedForExecutorAsync(executor.Id, fromUtc, toUtc);

            var reserved = existing
                .Select(sio => {
                    var sUtc = sio.ServiceStart!.Value;
                    var sLocal = TimeZoneInfo.ConvertTime(sUtc, _tz);
                    return (Start: sLocal, End: sLocal.AddMinutes(duration));
                })
                .ToList();

            // 9) Генерация слотов с шагом 15 мин
            var slots = new List<SlotDto>();
            foreach (var (start, end) in intervals)
            {
                var cursor = targetLocal + start.ToTimeSpan();
                var limit = targetLocal + end.ToTimeSpan();

                while (cursor.AddMinutes(duration) <= limit)
                {
                    if (cursor >= windowStart)
                    {
                        var slotEnd = cursor.AddMinutes(duration);
                        bool available = !reserved.Any(r => r.Start < slotEnd && cursor < r.End);
                        slots.Add(new SlotDto(new DateTimeOffset(cursor, _tz.GetUtcOffset(cursor)), available));
                    }
                    cursor = cursor.AddMinutes(15);
                }
            }

            return slots;
        }

        /// <summary>
        /// При создании заказа — в транзакции проверить, что слот всё ещё свободен.
        /// </summary>
        //public async Task CreateOrderAsync(/* параметры заказа и выбранный слот */)
        //{
                //using var tx = await _uow.BeginTransactionAsync();
            // повторить проверку пересечения на выбранном слоте
            // если свободен — сохранить Order + ServiceInOrder + tx.Commit()
            // иначе — бросить ошибку
        //}
    }

}
