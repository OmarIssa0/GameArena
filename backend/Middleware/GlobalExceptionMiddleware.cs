using backend.Utils;
using System.Text.Json;

namespace backend.Middleware
{
    public class GlobalExceptionMiddleware(RequestDelegate _next, ILogger<GlobalExceptionMiddleware> _logger)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                if (ex is AppException)
                    _logger.LogWarning("Request failed with application error {ErrorCode}", ((AppException)ex).ErrorCode);
                else
                    _logger.LogError(ex, "Unhandled exception");
                var error = ErrorHelper.GetErrorResponse(ex);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = error.StatusCode;
                var json = JsonSerializer.Serialize(error.Value, JsonDefaults.Options);
                await context.Response.WriteAsync(json);
            }
        }
    }
}
