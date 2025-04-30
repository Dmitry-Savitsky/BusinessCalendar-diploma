using BusinessCalendar.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BusinessCalendar.Core.Interfaces
{
    public interface IExecutorHasServiceRepository : IRepository<ExecutorHasService>
    {
        /// <summary>
        /// Все связи для исполнителей и услуг данной компании
        /// </summary>
        Task<IEnumerable<ExecutorHasService>> GetByCompanyIdAsync(int companyId);

        /// <summary>
        /// Все связи для конкретного исполнителя
        /// </summary>
        Task<IEnumerable<ExecutorHasService>> GetByExecutorIdAsync(int executorId);

        /// <summary>
        /// Одна связь по executorId + serviceId
        /// </summary>
        Task<ExecutorHasService?> GetByExecutorAndServiceAsync(int executorId, int serviceId);
    }
}
