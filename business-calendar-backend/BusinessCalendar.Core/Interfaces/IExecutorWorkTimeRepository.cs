using BusinessCalendar.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Core.Interfaces
{
    public interface IExecutorWorkTimeRepository : IRepository<ExecutorWorkTime>
    {
        Task<List<ExecutorWorkTime>> GetByExecutorIdAsync(int executorId);
        Task DeleteByExecutorIdAsync(int executorId);
    }
}
