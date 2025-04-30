using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Application.DTOs.ExecutorHasServiceDtos
{
    public class ExecutorHasServiceDto
    {
        // Исполнитель
        public Guid ExecutorPublicId { get; set; }
        public string ExecutorName { get; set; } = string.Empty;
        public string ExecutorImgPath { get; set; } = string.Empty;

        // Услуга
        public Guid ServicePublicId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public int? ServicePrice { get; set; }
        public int? DurationMinutes { get; set; }
    }
}
