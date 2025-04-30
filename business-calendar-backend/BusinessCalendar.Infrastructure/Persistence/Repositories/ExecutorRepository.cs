using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Interfaces;
using BusinessCalendar.Infrastructure.Persistence;
using BusinessCalendar.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BusinessCalendar.Infrastructure.Repositories
{
    public class ExecutorRepository : Repository<Executor>, IExecutorRepository
    {
        private readonly BusinessCalendarDbContext _context;

        public ExecutorRepository(BusinessCalendarDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Executor?> GetByGuidAsync(Guid guid)
        {
            return await _context.Executors
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.PublicId == guid);
        }


        public async Task<Executor?> GetByPhoneAsync(string phone)
        {
            return await _context.Executors
                .FirstOrDefaultAsync(e => e.ExecutorPhone == phone);
        }

    }
}
