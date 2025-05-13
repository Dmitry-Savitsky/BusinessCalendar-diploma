using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Application.DTOs.ExecutorWorkTimeDtos
{
    namespace BusinessCalendar.Application.DTOs
    {
        public class ExecutorWorkTimeDto
        {
            public int DayNo { get; set; }            // 0–6
            public bool IsWorking { get; set; }
            public TimeOnly FromTime { get; set; }
            public TimeOnly TillTime { get; set; }
            public TimeOnly BreakStart { get; set; }
            public TimeOnly BreakEnd { get; set; }
        }
    }
}
