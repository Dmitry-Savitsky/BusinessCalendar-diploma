namespace BusinessCalendar.Application.DTOs.ExecutorDtos
{
    public class ExecutorUpdateDto
    {
        public string? ExecutorName { get; set; }
        public string? ExecutorPhone { get; set; }
        public string? WorkTimeBegin { get; set; }
        public string? WorkTimeEnd { get; set; }

        public string ImgPath { get; set; } = string.Empty;
    }
}