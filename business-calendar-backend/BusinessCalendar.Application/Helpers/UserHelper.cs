using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BusinessCalendar.Application.Helpers
{
    public static class UserHelper
    {
        public static string GetCompanyGuid(this ClaimsPrincipal user) =>
            user.FindFirst("CompanyGuid")?.Value ?? throw new UnauthorizedAccessException("Company GUID not found.");

        public static string GetExecutorGuid(this ClaimsPrincipal user) =>
            user.FindFirst("ExecutorGuid")?.Value ?? throw new UnauthorizedAccessException("Executor GUID not found.");
    }
}
