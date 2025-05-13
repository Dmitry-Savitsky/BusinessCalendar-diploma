using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Application.DTOs.ExecutorDtos
{
    public class ExecutorAddDto
    {
        public string ExecutorName { get; set; } = string.Empty;
        public string ExecutorPhone { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

}
