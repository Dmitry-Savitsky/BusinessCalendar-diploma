using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Core.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public Guid PublicId { get; set; } = Guid.NewGuid();
        public string? OrderComment { get; set; }
        public int ClientId { get; set; }
        public DateTime OrderStart { get; set; }
        public DateTime? OrderEnd { get; set; }
        public int ClientAddressId { get; set; }
        public bool? Confirmed { get; set; }
        public bool? Completed { get; set; }
        public int CompanyId { get; set; }

        public Client Client { get; set; } = null!;
        public ClientAddress ClientAddress { get; set; } = null!;
        public Company Company { get; set; } = null!;
        public ICollection<ServiceInOrder> Services { get; set; } = new List<ServiceInOrder>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
