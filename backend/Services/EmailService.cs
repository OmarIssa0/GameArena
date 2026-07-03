using backend.Services.Interface;
using MailKit.Net.Smtp;
using MimeKit;

namespace backend.Services
{
    public class EmailService(IConfiguration _config, ILogger<EmailService> _logger) : IEmailService
    {
        public async Task SendAsync(string to, string subject, string body)
        {
            var emailConfig = _config["EmailSettings:Email"];
            var hostConfig = _config["EmailSettings:Host"];
            var passConfig = _config["EmailSettings:Password"];
            var portConfig = _config["EmailSettings:Port"];

            if (string.IsNullOrEmpty(emailConfig) || string.IsNullOrEmpty(hostConfig) ||
                string.IsNullOrEmpty(passConfig) || string.IsNullOrEmpty(portConfig) ||
                !int.TryParse(portConfig, out var port))
            {
                _logger.LogWarning("EmailSettings not fully configured. OTP logged to console for {Email}", to);
                Console.WriteLine($"\n=== OTP for {to} ===\nSubject: {subject}\nBody: {body}\n=======================\n");
                return;
            }

            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(emailConfig));
                email.To.Add(MailboxAddress.Parse(to));
                email.Subject = subject;
                email.Body = new BodyBuilder { HtmlBody = body }.ToMessageBody();

                using var smtp = new SmtpClient();
                smtp.Timeout = 10_000;
                await smtp.ConnectAsync(hostConfig, port, MailKit.Security.SecureSocketOptions.Auto);
                await smtp.AuthenticateAsync(emailConfig, passConfig);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
                _logger.LogInformation("Email sent to {Email}", to);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send email to {Email}. OTP logged to console.", to);
                Console.WriteLine($"\n=== OTP for {to} ===\nSubject: {subject}\nBody: {body}\n=======================\n");
            }
        }
    }
}
