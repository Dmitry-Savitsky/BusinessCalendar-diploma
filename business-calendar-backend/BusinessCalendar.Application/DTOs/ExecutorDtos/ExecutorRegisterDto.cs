namespace BusinessCalendar.Application.DTOs.ExecutorDtos
{
    public class ExecutorRegisterDto
    {
        public string Guid { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        public string ExecutorName { get; set; } = string.Empty;
        public string ExecutorPhone { get; set; } = string.Empty;
    }

}
