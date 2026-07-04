using System.Text;
using System.Text.Json;
using backend.Services.Interface;
using System.Text.Json.Serialization;

namespace backend.Services
{
    public class EmailService(IConfiguration _config, IHttpClientFactory _httpClientFactory, ILogger<EmailService> _logger) : IEmailService
    {
        public async Task SendAsync(string to, string subject, string body)
        {
            var apiKey = _config["EmailSettings:Password"];
            var fromEmail = _config["EmailSettings:Email"] ?? "noreply@gamearena.com";
            var payload = new
            {
                sender = new { email = fromEmail, name = "GameArena" },
                to = new[] { new { email = to } },
                subject,
                htmlContent = body
            };

            var json = JsonSerializer.Serialize(payload, new JsonSerializerOptions
            {
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            using var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Add("api-key", apiKey);

            var response = await client.PostAsync(
                "https://api.brevo.com/v3/smtp/email",
                new StringContent(json, Encoding.UTF8, "application/json")
            );

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Email sent via Brevo to {Email}", to);
            }
            else
            {
                var errBody = await response.Content.ReadAsStringAsync();
                _logger.LogWarning("Fallback: email delivery failed for {Email}", to);
            }
        }
    }
}
