using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Application.DTOs.ClientsDtos
{
    public class ClientCreateDto
    {
        public string ClientName { get; set; } = string.Empty;
        public string ClientPhone { get; set; } = string.Empty;
        public List<ClientAddressCreateDto>? Addresses { get; set; }
    }

    public class ClientUpdateDto
    {
        public string? ClientName { get; set; }
        public string? ClientPhone { get; set; }
    }

    public class ClientDto
    {
        public Guid PublicId { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public string ClientPhone { get; set; } = string.Empty;
        public List<ClientAddressDto> Addresses { get; set; } = new();
    }

    public class ClientAddressCreateDto
    {
        public string Address { get; set; } = string.Empty;
    }

    public class ClientAddressDto
    {
        public int Id { get; set; }
        public string Address { get; set; } = string.Empty;
    }

}
