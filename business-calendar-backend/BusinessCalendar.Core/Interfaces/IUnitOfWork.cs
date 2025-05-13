using BusinessCalendar.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Core.Interfaces
{
    public interface IUnitOfWork
    {
        IRepository<Client> Clients { get; }
        IRepository<ClientAddress> ClientAddresses { get; }
        IRepository<Company> Companies { get; }
        IRepository<Executor> Executors { get; }
        IRepository<Service> Services { get; }
        IRepository<Order> Orders { get; }
        IRepository<Review> Reviews { get; }
        IRepository<ExecutorHasService> ExecutorHasServices { get; }
        IRepository<ServiceInOrder> ServiceInOrders { get; }
        IRepository<ExecutorWorkTime> ExecutorWorkTimes { get; }

        //кастомные репозитории
        ICompanyRepository CompanyRepository { get; }
        IClientRepository ClientRepository { get; }
        IExecutorRepository ExecutorRepository { get; }
        IServiceRepository ServiceRepository { get; }
        IOrderRepository OrderRepository { get; }

        IExecutorHasServiceRepository ExecutorHasServiceRepository { get; }
        IExecutorWorkTimeRepository ExecutorWorkTimeRepository { get; }

        Task<int> SaveChangesAsync();
    }
}
