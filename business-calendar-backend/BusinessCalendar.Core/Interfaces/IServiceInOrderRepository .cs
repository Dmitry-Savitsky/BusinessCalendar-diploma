using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Interfaces;

public interface IServiceRepository : IRepository<Service>
{
    Task<Service?> GetByGuidAsync(Guid publicId);
    Task<List<Service>> GetByCompanyIdAsync(int companyId);


    Task<Service?> GetByPublicIdForCompanyAsync(Guid publicId, int companyId);
    Task<Service?> GetByPublicIdForExecutorAsync(Guid publicId, int executorId);
}
