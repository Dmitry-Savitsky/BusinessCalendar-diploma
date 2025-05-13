using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Interfaces;
using BusinessCalendar.Infrastructure.Persistence.Repositories;
using BusinessCalendar.Infrastructure.Repositories;

namespace BusinessCalendar.Infrastructure.Persistence
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly BusinessCalendarDbContext _context;

        public IRepository<Client> Clients { get; }
        public IRepository<ClientAddress> ClientAddresses { get; }
        public IRepository<Company> Companies { get; }
        public IRepository<Executor> Executors { get; }
        public IRepository<Service> Services { get; }
        public IRepository<Order> Orders { get; }
        public IRepository<Review> Reviews { get; }
        public IRepository<ExecutorHasService> ExecutorHasServices { get; }
        public IRepository<ServiceInOrder> ServiceInOrders { get; }
        public IRepository<ExecutorWorkTime> ExecutorWorkTimes { get; }

        public ICompanyRepository CompanyRepository { get; }
        public IClientRepository ClientRepository { get; }
        public IExecutorRepository ExecutorRepository { get; }
        public IServiceRepository ServiceRepository { get; }
        public IOrderRepository OrderRepository { get; }
        public IExecutorHasServiceRepository ExecutorHasServiceRepository { get; }
        public IExecutorWorkTimeRepository ExecutorWorkTimeRepository { get; }

        public UnitOfWork(
            BusinessCalendarDbContext context,
            IRepository<Client> clients,
            IRepository<ClientAddress> clientAddresses,
            IRepository<Company> companies,
            IRepository<Executor> executors,
            IRepository<Service> services,
            IRepository<Order> orders,
            IRepository<Review> reviews,
            IRepository<ExecutorHasService> executorHasServices,
            IRepository<ServiceInOrder> serviceInOrders,
            IRepository<ExecutorWorkTime> executorWorkTimes,

            ICompanyRepository companyRepository,
            IClientRepository clientRepository,
            IExecutorRepository executorRepository,
            IServiceRepository serviceRepository,
            IOrderRepository orderRepository,
            IExecutorHasServiceRepository executorHasServiceRepository,
            IExecutorWorkTimeRepository executorWorkTimeRepository
        )
        {
            _context = context;
            Clients = clients;
            ClientAddresses = clientAddresses;
            Companies = companies;
            Executors = executors;
            Services = services;
            Orders = orders;
            Reviews = reviews;
            ExecutorHasServices = executorHasServices;
            ServiceInOrders = serviceInOrders;
            ExecutorWorkTimes = executorWorkTimes;

            CompanyRepository = companyRepository;
            ClientRepository = clientRepository;
            ExecutorRepository = executorRepository;
            ServiceRepository = serviceRepository;
            OrderRepository = orderRepository;
            ExecutorHasServiceRepository = executorHasServiceRepository;
            ExecutorWorkTimeRepository = executorWorkTimeRepository;
        }

        public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();

        public void Dispose() => _context.Dispose();
    }
}
