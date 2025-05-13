using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Infrastructure.Persistence.Repositories
{
    public class ExecutorWorkTimeRepository : Repository<ExecutorWorkTime>, IExecutorWorkTimeRepository
    {
        private readonly BusinessCalendarDbContext _context;

        public ExecutorWorkTimeRepository(BusinessCalendarDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<ExecutorWorkTime>> GetByExecutorIdAsync(int executorId)
        {
            return await _context.ExecutorWorkTimes
                .Where(w => w.ExecutorId == executorId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task DeleteByExecutorIdAsync(int executorId)
        {
            var list = await _context.ExecutorWorkTimes
                .Where(w => w.ExecutorId == executorId)
                .ToListAsync();
            _context.ExecutorWorkTimes.RemoveRange(list);
            await _context.SaveChangesAsync();
        }
    }
}
