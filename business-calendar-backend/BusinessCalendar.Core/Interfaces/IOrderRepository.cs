﻿using BusinessCalendar.Core.Entities;
using System.Linq.Expressions;

namespace BusinessCalendar.Core.Interfaces
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<List<Order>> GetAllByCompanyIdAsync(int companyId);
        Task<Order?> GetByPublicIdAsync(Guid publicId);

    }
}
