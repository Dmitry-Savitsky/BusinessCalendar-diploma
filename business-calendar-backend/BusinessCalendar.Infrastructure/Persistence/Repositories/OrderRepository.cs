using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Interfaces;
using BusinessCalendar.Infrastructure.Persistence;
using BusinessCalendar.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessCalendar.Infrastructure.Repositories
{
    public class OrderRepository : Repository<Order>, IOrderRepository
    {
        private readonly BusinessCalendarDbContext _context;

        public OrderRepository(BusinessCalendarDbContext context) : base(context)
            => _context = context;

        /// <summary>
        /// Возвращает все заказы указанной компании вместе с
        /// клиентом, адресом, позициями, услугами и исполнителями.
        /// </summary>
        public async Task<List<Order>> GetAllByCompanyIdAsync(int companyId)
        {
            return await _context.Orders
                .AsNoTracking()
                .Where(o => o.CompanyId == companyId)
                // Клиент и его актуальный адрес
                .Include(o => o.Client)
                .Include(o => o.ClientAddress)
                // Позиции заказа
                .Include(o => o.Services)
                    .ThenInclude(sio => sio.Service)
                .Include(o => o.Services)
                    .ThenInclude(sio => sio.Executor)
                .ToListAsync();
        }

        /// <summary>
        /// Возвращает один заказ по его публичному GUID,
        /// вместе с клиентом, адресом, позициями, услугами и исполнителями.
        /// </summary>
        public async Task<Order?> GetByPublicIdAsync(Guid publicId)
        {
            return await _context.Orders
                .AsNoTracking()
                .Where(o => o.PublicId == publicId)
                .Include(o => o.Client)
                .Include(o => o.ClientAddress)
                .Include(o => o.Services)
                    .ThenInclude(sio => sio.Service)
                .Include(o => o.Services)
                    .ThenInclude(sio => sio.Executor)
                .FirstOrDefaultAsync();
        }
    }
}
