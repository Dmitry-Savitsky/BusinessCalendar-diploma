using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Core.Entities
{
    public class ClientAddress
    {
        public int Id { get; set; }
        public string Address { get; set; } = string.Empty;
        public int ClientId { get; set; }

        public Client Client { get; set; } = null!;
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
