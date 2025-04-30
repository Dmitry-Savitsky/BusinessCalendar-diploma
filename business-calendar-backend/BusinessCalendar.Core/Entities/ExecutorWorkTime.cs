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
        public DateTime? FromTime { get; set; }
        public DateTime? TillTime { get; set; }

        public Executor Executor { get; set; } = null!;
    }
}
