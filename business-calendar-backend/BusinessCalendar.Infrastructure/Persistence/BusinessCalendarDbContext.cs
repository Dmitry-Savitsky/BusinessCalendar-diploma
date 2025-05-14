using Microsoft.EntityFrameworkCore;
using BusinessCalendar.Core.Entities;

namespace BusinessCalendar.Infrastructure.Persistence
{
    public class BusinessCalendarDbContext : DbContext
    {
        public BusinessCalendarDbContext(DbContextOptions<BusinessCalendarDbContext> options)
            : base(options)
        {
        }

        public DbSet<Client> Clients { get; set; }
        public DbSet<ClientAddress> ClientAddresses { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Executor> Executors { get; set; }
        public DbSet<ExecutorHasService> ExecutorHasServices { get; set; }
        public DbSet<ExecutorWorkTime> ExecutorWorkTimes { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<ServiceInOrder> ServiceInOrders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            ConfigureExecutorHasService(modelBuilder);
            ConfigureServiceInOrder(modelBuilder);

            // Optional: ограничение длины строк, уникальности, каскадные удаления и т.д.
        }

        private void ConfigureExecutorHasService(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ExecutorHasService>()
                .HasKey(ehs => new { ehs.ExecutorId, ehs.ServiceId });

            modelBuilder.Entity<ExecutorHasService>()
                .HasOne(ehs => ehs.Executor)
                .WithMany(e => e.ExecutorServices)
                .HasForeignKey(ehs => ehs.ExecutorId);

            modelBuilder.Entity<ExecutorHasService>()
                .HasOne(ehs => ehs.Service)
                .WithMany(s => s.ExecutorServices)
                .HasForeignKey(ehs => ehs.ServiceId);
        }

        private void ConfigureServiceInOrder(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ServiceInOrder>()
                .HasKey(sio => sio.Id);

            modelBuilder.Entity<ServiceInOrder>()
                .HasOne(sio => sio.Order)
                .WithMany(o => o.Services)
                .HasForeignKey(sio => sio.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ServiceInOrder>()
                .HasOne(sio => sio.Service)
                .WithMany(s => s.ServiceInOrders)
                .HasForeignKey(sio => sio.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ServiceInOrder>()
                .HasOne(sio => sio.Executor)
                .WithMany(e => e.ServiceInOrders)
                .HasForeignKey(sio => sio.ExecutorId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
