namespace BusinessCalendar.Application.DTOs.CompanyDtos
{
    public class CompanyDto
    {
        public int Id { get; set; }
        public string? CompanyName { get; set; }
        public string? CompanyPhone { get; set; }
        public string? CompanyAddress { get; set; }
        public string? Login { get; set; }
        public string? Password { get; set; }
        public string Guid { get; set; } = string.Empty;
    }
}
