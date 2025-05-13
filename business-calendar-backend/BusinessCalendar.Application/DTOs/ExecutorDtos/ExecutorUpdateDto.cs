namespace BusinessCalendar.Application.DTOs.ExecutorDtos
{
    public class ExecutorUpdateDto
    {
        public string? ExecutorName { get; set; }
        public string? ExecutorPhone { get; set; }

        public string? Description { get; set; }

        public string ImgPath { get; set; } = string.Empty;
    }
}