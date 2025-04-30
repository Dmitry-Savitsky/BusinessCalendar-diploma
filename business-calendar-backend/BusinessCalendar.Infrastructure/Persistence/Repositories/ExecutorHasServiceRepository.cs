using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Interfaces;
using BusinessCalendar.Infrastructure.Persistence;
using BusinessCalendar.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessCalendar.Infrastructure.Repositories
{
    public class ExecutorHasServiceRepository
        : Repository<ExecutorHasService>, IExecutorHasServiceRepository
    {
        private readonly BusinessCalendarDbContext _context;

        public ExecutorHasServiceRepository(BusinessCalendarDbContext context)
            : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ExecutorHasService>> GetByCompanyIdAsync(int companyId)
        {
            return await _context.ExecutorHasServices
                .Include(x => x.Executor)
                .Include(x => x.Service)
                .Where(x =>
                    x.Executor.CompanyId == companyId
                    && x.Service.CompanyId == companyId)
                .ToListAsync();
        }

        public async Task<IEnumerable<ExecutorHasService>> GetByExecutorIdAsync(int executorId)
        {
            return await _context.ExecutorHasServices
                .Include(x => x.Service)
                .Where(x => x.ExecutorId == executorId)
                .ToListAsync();
        }

        public async Task<ExecutorHasService?> GetByExecutorAndServiceAsync(int executorId, int serviceId)
        {
            return await _context.ExecutorHasServices
                .FirstOrDefaultAsync(x =>
                    x.ExecutorId == executorId
                    && x.ServiceId == serviceId);
        }
    }
}
