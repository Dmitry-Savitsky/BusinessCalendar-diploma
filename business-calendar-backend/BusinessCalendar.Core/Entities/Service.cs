using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BusinessCalendar.Core.Entities
{
    public class Service
    {
        public int Id { get; set; }
        public Guid PublicId { get; set; } = Guid.NewGuid();
        public string ServiceName { get; set; } = string.Empty;
        public int ServiceType { get; set; }
        public int? ServicePrice { get; set; }
        public int? DurationMinutes { get; set; }
        public bool RequiresAddress { get; set; }
        public int CompanyId { get; set; }

        public Company Company { get; set; } = null!;
        public ICollection<ExecutorHasService> ExecutorServices { get; set; } = new List<ExecutorHasService>(); // под вопросом
        public ICollection<ServiceInOrder> ServiceInOrders { get; set; } = new List<ServiceInOrder>();
    }
}

//function formatDuration(minutes)
//{
//    if (!minutes) return "-";
//    const h = Math.floor(minutes / 60);
//    const m = minutes % 60;
//    return `${ h > 0 ? h + "h " : ""}${ m > 0 ? m + "min" : ""}`;
//}
