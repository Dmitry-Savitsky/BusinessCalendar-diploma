using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Core.Entities
{
    public class ExecutorNotification
    {
        public int Id { get; set; }

        public int ExecutorId { get; set; }
        public Executor Executor { get; set; } = null!;

        public int IntervalMinutes { get; set; }
    }
}
