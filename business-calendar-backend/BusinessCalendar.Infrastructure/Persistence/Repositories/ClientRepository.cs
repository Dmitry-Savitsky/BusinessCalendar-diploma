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
        private readonly BusinessCalendarDbContext _context;

        public ClientRepository(BusinessCalendarDbContext context) : base(context)
        {
            _context = context;
        }


    }
}
