using BusinessCalendar.Core.Entities;
using System.Threading.Tasks;

namespace BusinessCalendar.Core.Interfaces
{
    public interface ICompanyRepository : IRepository<Company>
    {
        Task<Company?> GetByLoginAsync(string login);

        Task<Company?> GetByGuidAsync(Guid guid);


    }
}
