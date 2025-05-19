namespace BusinessCalendar.Application.DTOs.ExecutorDtos
{
    public class ExecutorRegisterDto
    {
        /// <summary>
        /// Публичный GUID исполнителя, выданный компанией
        /// </summary>
        public Guid ExecutorGuid { get; set; }

        /// <summary>
        /// Номер телефона, по которому компания зарегистрировала исполнителя
        /// </summary>
        public string ExecutorPhone { get; set; } = string.Empty;

        /// <summary>
        /// Пароль, который исполнитель хочет установить
        /// </summary>
        public string Password { get; set; } = string.Empty;
    }
}
