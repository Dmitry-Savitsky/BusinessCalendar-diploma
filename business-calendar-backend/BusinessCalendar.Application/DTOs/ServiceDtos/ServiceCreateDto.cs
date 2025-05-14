using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Application.DTOs.ServiceDtos
{
    public class ServiceCreateDto
    {
        public string ServiceName { get; set; } = string.Empty;
        public int ServiceType { get; set; }
        public int? ServicePrice { get; set; }
        public int? DurationMinutes { get; set; }

        // всегда false при создании
        public bool RequiresAddress { get; set; } = false;
    }
}
