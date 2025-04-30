using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Application.DTOs.ServiceDtos
{
    public class ServiceUpdateDto
    {
        public string? ServiceName { get; set; }
        public int? ServiceType { get; set; }
        public int? ServicePrice { get; set; }
        public int? DurationMinutes { get; set; }
    }
}
