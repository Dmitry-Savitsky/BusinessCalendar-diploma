using BusinessCalendar.Core.Entities;
using System.Linq.Expressions;

namespace BusinessCalendar.Core.Interfaces
{
    public interface IClientRepository : IRepository<Client>
    {
        Task<List<Client>> GetByCompanyIdAsync(int companyId);
        Task<Client?> GetByPublicIdAndCompanyIdAsync(Guid clientGuid, int companyId);
        Task<Client?> GetByPublicIdAsync(Guid clientGuid);

        /// <summary>
        /// Находит клиента по телефону и компании (если есть).
        /// </summary>
        Task<Client?> GetByPhoneAndCompanyAsync(string phone, int companyId);
    }
}
