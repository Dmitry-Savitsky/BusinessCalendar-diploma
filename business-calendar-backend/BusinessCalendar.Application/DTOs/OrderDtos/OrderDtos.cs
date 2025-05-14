using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Application.DTOs.OrdersDtos
{
    /// <summary>
    /// DTO для одной позиции заказа: услуга, исполнитель и начало слота
    /// </summary>
    public class OrderItemDto
    {
        /// <summary>GUID услуги</summary>
        public Guid ServiceGuid { get; set; }
        /// <summary>GUID исполнителя</summary>
        public Guid ExecutorGuid { get; set; }
        /// <summary>Дата и время начала услуги (с учётом часового пояса клиента)</summary>
        public DateTimeOffset Start { get; set; }

        /// <summary>
        /// Флаг, показывающий, нужно ли для этой услуги указывать адрес клиента
        /// (копируется из Service.RequiresAddress)
        /// </summary>
        public bool RequiresAddress { get; set; }
    }

    /// <summary>
    /// DTO для создания заказа с несколькими услугами
    /// </summary>
    public class OrderCreateDto
    {
        /// <summary>GUID компании, под которой создаётся заказ</summary>
        public string CompanyGuid { get; set; } = string.Empty;

        /// <summary>Имя клиента</summary>
        public string ClientName { get; set; } = string.Empty;
        /// <summary>Телефон клиента</summary>
        public string ClientPhone { get; set; } = string.Empty;
        /// <summary>
        /// Адрес клиента (обязателен, если хотя бы одна услуга RequiresAddress==true)
        /// </summary>
        public string? ClientAddress { get; set; }

        /// <summary>Комментарий к заказу (необязательно)</summary>
        public string? Comment { get; set; }

        /// <summary>Список позиций (услуга+исполнитель+слот)</summary>
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
    }

    /// <summary>
    /// DTO, возвращаемый после создания заказа
    /// </summary>
    public class OrderDto
    {
        /// <summary>GUID только что созданного заказа</summary>
        public Guid PublicId { get; set; }
        /// <summary>Список позиций, подтверждённых сервером</summary>
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
        /// <summary>Комментарий заказчика</summary>
        public string? Comment { get; set; }
    }
}
