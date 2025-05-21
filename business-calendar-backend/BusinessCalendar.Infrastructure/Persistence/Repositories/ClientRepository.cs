using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Interfaces;
using BusinessCalendar.Infrastructure.Persistence;
using BusinessCalendar.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BusinessCalendar.Infrastructure.Repositories
{
    public class ClientRepository : Repository<Client>, IClientRepository
    {
        private readonly BusinessCalendarDbContext _ctx;
        public ClientRepository(BusinessCalendarDbContext ctx) : base(ctx) => _ctx = ctx;

        public async Task<List<Client>> GetByCompanyIdAsync(int companyId) =>
            await _ctx.Clients.Where(c => c.CompanyId == companyId).AsNoTracking().Include(o => o.Addresses).ToListAsync();

        public async Task<Client?> GetByPublicIdAndCompanyIdAsync(Guid clientGuid, int companyId) =>
            await _ctx.Clients
                .FirstOrDefaultAsync(c => c.PublicId == clientGuid && c.CompanyId == companyId);

        public async Task<Client?> GetByPublicIdAsync(Guid clientGuid) =>
            await _ctx.Clients.FirstOrDefaultAsync(c => c.PublicId == clientGuid);

        public async Task<Client?> GetByPhoneAndCompanyAsync(string phone, int companyId)
        {
            return await _ctx.Clients
                .AsNoTracking()
                .FirstOrDefaultAsync(c =>
                    c.ClientPhone == phone
                    && c.CompanyId == companyId);
        }
    }
}
