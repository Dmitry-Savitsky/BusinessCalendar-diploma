using BusinessCalendar.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Infrastructure.Persistence.Repositories
{
    public class ServiceInOrderRepository : Repository<ServiceInOrder>, IServiceInOrderRepository
    {
        private readonly BusinessCalendarDbContext _ctx;
        public ServiceInOrderRepository(BusinessCalendarDbContext ctx) : base(ctx) => _ctx = ctx;

        public async Task<List<ServiceInOrder>> GetConfirmedForExecutorAsync(
            int executorId, DateTime from, DateTime to)
        {
            return await _ctx.ServiceInOrders
                .Include(sio => sio.Order)
                .Where(sio =>
                    sio.ExecutorId == executorId
                    && sio.Order.Confirmed == true
                    && sio.ServiceStart.HasValue
                    && sio.ServiceStart.Value >= from
                    && sio.ServiceStart.Value < to)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
