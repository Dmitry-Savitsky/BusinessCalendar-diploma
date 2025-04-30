using BusinessCalendar.Core.Entities;
using BusinessCalendar.Infrastructure.Persistence.Repositories;
using BusinessCalendar.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public class ServiceRepository : Repository<Service>, IServiceRepository
{
    private readonly BusinessCalendarDbContext _context;

    public ServiceRepository(BusinessCalendarDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<Service?> GetByGuidAsync(Guid publicId)
    {
        return await _context.Services
            .Include(s => s.Company)
            .FirstOrDefaultAsync(s => s.PublicId == publicId);
    }

    public async Task<List<Service>> GetByCompanyIdAsync(int companyId)
    {
        return await _context.Services
            .Where(s => s.CompanyId == companyId)
            .ToListAsync();
    }
    public async Task<Service?> GetByPublicIdForCompanyAsync(Guid publicId, int companyId)
    {
        return await _context.Services
            .FirstOrDefaultAsync(s => s.PublicId == publicId && s.CompanyId == companyId);
    }

    public async Task<Service?> GetByPublicIdForExecutorAsync(Guid publicId, int executorId)
    {
        return await _context.Services
            .Include(s => s.ExecutorServices) // под вопросом
            .FirstOrDefaultAsync(s =>
                s.PublicId == publicId &&
                s.ExecutorServices.Any(es => es.ExecutorId == executorId));
    }
}
