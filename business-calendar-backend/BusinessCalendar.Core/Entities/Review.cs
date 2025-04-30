using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Core.Entities
{
    public class Review
    {
        public int Id { get; set; }
        public string? ReviewText { get; set; }
        public int ReviewRating { get; set; }
        public int ClientId { get; set; }
        public int OrderId { get; set; }

        public Client Client { get; set; } = null!;
        public Order Order { get; set; } = null!;
    }
}
