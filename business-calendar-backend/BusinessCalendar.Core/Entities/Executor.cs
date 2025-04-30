using System;
using System.Collections.Generic;

namespace BusinessCalendar.Core.Entities
{
    public class Executor
    {
        public int Id { get; set; }

        // GUID
        public Guid PublicId { get; set; } = Guid.NewGuid();

        public string ExecutorName { get; set; } = string.Empty;
        public string ExecutorPhone { get; set; } = string.Empty;

        // При регистрации исполнителя сюда записывается его пароль
        // До регистрации — null
        public string? Password { get; set; }

        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;

        public string? WorkTimeBegin { get; set; }
        public string? WorkTimeEnd { get; set; }

        public string ImgPath { get; set; } = string.Empty;

        public ICollection<ExecutorHasService> ExecutorServices { get; set; }
            = new List<ExecutorHasService>();
        public ICollection<ServiceInOrder> ServiceInOrders { get; set; }
            = new List<ServiceInOrder>();
        public ICollection<ExecutorWorkTime> WorkTimes { get; set; }
            = new List<ExecutorWorkTime>();

        public bool IsRegistered => !string.IsNullOrEmpty(Password);
    }
}
