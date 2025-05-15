using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Application.DTOs.ExecutorWorkTimeDtos
{
    public class ExecutorWorkTimeDto
    {
        /// <summary>День недели: 0 (воскресенье) – 6 (суббота)</summary>
        public int DayNo { get; set; }

        /// <summary>Работает ли в этот день</summary>
        public bool IsWorking { get; set; }

        /// <summary>Время начала работы</summary>
        public TimeOnly FromTime { get; set; }

        /// <summary>Время окончания работы</summary>
        public TimeOnly TillTime { get; set; }

        /// <summary>Время начала перерыва</summary>
        public TimeOnly BreakStart { get; set; }

        /// <summary>Время окончания перерыва</summary>
        public TimeOnly BreakEnd { get; set; }
    }
}
