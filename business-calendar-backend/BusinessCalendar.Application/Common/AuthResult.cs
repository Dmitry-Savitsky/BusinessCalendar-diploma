namespace BusinessCalendar.Application.Common
{
    public class AuthResult
    {
        public bool IsSuccess { get; private set; }
        public string Token { get; private set; } = string.Empty;
        public string ErrorMessage { get; private set; } = string.Empty;

        private AuthResult() { }

        public static AuthResult Success(string token) =>
            new AuthResult { IsSuccess = true, Token = token };

        public static AuthResult Failure(string errorMessage) =>
            new AuthResult { IsSuccess = false, ErrorMessage = errorMessage };
    }
}
