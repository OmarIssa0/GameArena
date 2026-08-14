using backend.Utils;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace backend.Data
{
    public class GlobalExceptionMiddleware(RequestDelegate _next, ILogger<GlobalExceptionMiddleware> _logger)
    {
        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        };

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                // this only for debugging in production
                _logger.LogError(ex, "Unhandled exception");
                var error = ErrorHelper.GetErrorResponse(ex);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = error.StatusCode;
                var json = JsonSerializer.Serialize(error.Value, _jsonOptions);
                await context.Response.WriteAsync(json);
            }
        }
    }
}
