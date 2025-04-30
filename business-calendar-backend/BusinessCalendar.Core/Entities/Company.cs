using System;
using System.Collections.Generic;

namespace BusinessCalendar.Core.Entities
{
    public class Company
    {
        public int Id { get; set; }
        public Guid PublicId { get; set; } = Guid.NewGuid();

        public string? CompanyName { get; set; }
        public string? CompanyPhone { get; set; }
        public string? CompanyAddress { get; set; }
        public string? Login { get; set; }
        public string? Password { get; set; }
        public string ImgPath { get; set; } = string.Empty;

        public ICollection<Executor> Executors { get; set; } = new List<Executor>();
        public ICollection<Service> Services { get; set; } = new List<Service>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
