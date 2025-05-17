using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Application.DTOs.CompanyDtos
{
    /// <summary>
    /// Детальная информация о компании для «личного кабинета»
    /// </summary>
    public class CompanyDetailDto
    {
        public Guid PublicId { get; set; }
        public string? CompanyName { get; set; }
        public string? CompanyPhone { get; set; }
        public string? CompanyAddress { get; set; }
        public string ImgPath { get; set; } = string.Empty;
        public string? Login { get; set; }
        // не отдаём пароль и коллекции навигации
    }
}
