namespace BusinessCalendar.Application.DTOs.CompanyDtos
{
    public class CompanyUpdateDto
    {
        public string? CompanyName { get; set; }
        public string? CompanyPhone { get; set; }
        public string? CompanyAddress { get; set; }

        public string ImgPath { get; set; } = string.Empty;
    }
}