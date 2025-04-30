using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Interfaces;
using BusinessCalendar.Infrastructure.Persistence;
using BusinessCalendar.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BusinessCalendar.Infrastructure.Repositories
{
    public class CompanyRepository : Repository<Company>, ICompanyRepository
    {
        private readonly BusinessCalendarDbContext _context;

        public CompanyRepository(BusinessCalendarDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Company?> GetByLoginAsync(string login)
        {
            return await _context.Companies
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Login == login);
        }

        public async Task<Company?> GetByGuidAsync(Guid guid)
        {
            return await _context.Companies
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.PublicId == guid);
        }

    }
}
