using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Interfaces;
using BusinessCalendar.Infrastructure.Persistence;
using BusinessCalendar.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BusinessCalendar.Infrastructure.Repositories
{
    public class OrderRepository : Repository<Order>, IOrderRepository
    {
        private readonly BusinessCalendarDbContext _context;

        public OrderRepository(BusinessCalendarDbContext context) : base(context)
        {
            _context = context;
        }

        
    }
}
