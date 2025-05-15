using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Application.DTOs.ExecutorHasServiceDtos
{
    public class ExecutorHasServiceCreateDto
    {
        /// <summary>Публичный GUID исполнителя</summary>
        public Guid ExecutorGuid { get; set; }
        /// <summary>Публичный GUID услуги</summary>
        public Guid ServiceGuid { get; set; }
    }
}
