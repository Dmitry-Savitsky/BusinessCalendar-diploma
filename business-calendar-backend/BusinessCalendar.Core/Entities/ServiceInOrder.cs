using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Core.Entities
{
    public class ServiceInOrder
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;
        public int ServiceId { get; set; }
        public Service Service { get; set; } = null!;
        public int ExecutorId { get; set; }
        public Executor Executor { get; set; } = null!;
        public DateTime? ServiceStart { get; set; }
        public DateTime? ServiceEnd { get; set; }
    }
}
