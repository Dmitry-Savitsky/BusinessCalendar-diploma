using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Interfaces;

public interface IServiceInOrderRepository : IRepository<ServiceInOrder>
{
    // подтв. брони для исполнителя в период
    Task<List<ServiceInOrder>> GetConfirmedForExecutorAsync(int executorId, DateTime from, DateTime to);

    /// <summary>
    /// Проверяет, существует ли у данного исполнителя хотя бы один подтверждённый заказ,
    /// пересекающийся с интервалом [startUtc, endUtc).
    /// </summary>
    Task<bool> ExistsConflictAsync(int executorId, DateTime startUtc, DateTime endUtc);
}
