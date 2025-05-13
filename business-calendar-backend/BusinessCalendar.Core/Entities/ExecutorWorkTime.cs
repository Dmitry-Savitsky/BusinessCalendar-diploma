using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Core.Entities
{
    public class ExecutorWorkTime
    {
        public int Id { get; set; }
        public int ExecutorId { get; set; }
        public int? DayNo { get; set; }
        public bool IsWorking { get; set; }

        public TimeOnly? FromTime { get; set; }
        public TimeOnly? TillTime { get; set; }

        public TimeOnly? BreakStart { get; set; }
        public TimeOnly? BreakEnd { get; set; }

        public Executor Executor { get; set; } = null!;
    }
}
