using BusinessCalendar.Core.Entities;
using System.Linq.Expressions;

namespace BusinessCalendar.Core.Interfaces
{
    public interface IExecutorRepository : IRepository<Executor>
    {
        Task<Executor?> GetByGuidAsync(Guid guid);

        Task<Executor?> GetByPhoneAsync(string phone);

    }
}
