using backend.Services.Interface;
using MailKit.Net.Smtp;
using MimeKit;

namespace backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendAsync(string to, string subject, string body)
        {
            var email = new MimeMessage();

            var emailConfig = _config["EmailSettings:Email"] ?? throw new Exception("Email user not configured");
            email.From.Add(MailboxAddress.Parse(emailConfig));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;

            email.Body = new TextPart("plain")
            {
                Text = body
            };

            using var smtp = new SmtpClient();
            var hostConfig = _config["EmailSettings:Host"] ?? throw new Exception("Email host not configured");
            var portConfig = _config["EmailSettings:Port"] ?? throw new Exception("Email port not configured");
            var passConfig = _config["EmailSettings:Password"] ?? throw new Exception("Email password not configured");
            await smtp.ConnectAsync(
                hostConfig,
                int.Parse(portConfig),
                MailKit.Security.SecureSocketOptions.StartTls
            );

            await smtp.AuthenticateAsync(emailConfig, passConfig);

            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}