using Microsoft.AspNetCore.Http;
using System;
using System.Net;
using System.Text.Json;
using BusinessCalendar.Core.Exceptions;
using System.Threading.Tasks;

namespace BusinessCalendar.Presentation.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            HttpStatusCode statusCode;
            string message;

            switch (exception)
            {
                case AlreadyExistsException:
                    statusCode = HttpStatusCode.Conflict;
                    message = exception.Message;
                    break;
                case BadRequestException:
                    statusCode = HttpStatusCode.BadRequest;
                    message = exception.Message;
                    break;
                case NotFoundException:
                    statusCode = HttpStatusCode.NotFound;
                    message = exception.Message;
                    break;
                case UnauthorizedException:
                    statusCode = HttpStatusCode.Unauthorized;
                    message = exception.Message;
                    break;
                default:
                    statusCode = HttpStatusCode.InternalServerError;
                    message = "An unexpected error occurred.";
                    break;
            }

            var response = new
            {
                StatusCode = (int)statusCode,
                Message = message
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
