using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Interfaces;
using BusinessCalendar.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessCalendar.Infrastructure.Persistence.Repositories
{
    public class ServiceInOrderRepository : Repository<ServiceInOrder>, IServiceInOrderRepository
    {
        private readonly BusinessCalendarDbContext _ctx;

        public ServiceInOrderRepository(BusinessCalendarDbContext ctx) : base(ctx)
            => _ctx = ctx;

        /// <summary>
        /// Возвращает все подтверждённые ServiceInOrder для данного исполнителя
        /// в диапазоне [from, to) по полю ServiceStart.
        /// Загружает навигационные свойства Order, Service и Executor.
        /// </summary>
        public async Task<List<ServiceInOrder>> GetConfirmedForExecutorAsync(
            int executorId, DateTime from, DateTime to)
        {
            return await _ctx.ServiceInOrders
                .AsNoTracking()
                .Include(sio => sio.Order)
                .Include(sio => sio.Service)
                .Include(sio => sio.Executor)
                .Where(sio =>
                    sio.ExecutorId == executorId
                    && sio.Order.Confirmed == true
                    && sio.ServiceStart.HasValue
                    && sio.ServiceStart.Value >= from
                    && sio.ServiceStart.Value < to)
                .ToListAsync();
        }

        /// <summary>
        /// Проверяет, есть ли уже занятой слот, пересекающийся с [startUtc, endUtc).
        /// Учитывает только подтверждённые заказы.
        /// </summary>
        public async Task<bool> ExistsConflictAsync(
            int executorId, DateTime startUtc, DateTime endUtc)
        {
            return await _ctx.ServiceInOrders
                .AsNoTracking()
                .Include(sio => sio.Order)
                .AnyAsync(sio =>
                    sio.ExecutorId == executorId
                    && sio.Order.Confirmed == true
                    && sio.ServiceStart < endUtc
                    && sio.ServiceEnd > startUtc);
        }
    }
}
