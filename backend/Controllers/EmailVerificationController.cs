using backend.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/email-verification")]
    public class EmailVerificationController : ControllerBase
    {
        private readonly IEmailVerificationService _service;

        public EmailVerificationController(IEmailVerificationService service)
        {
            _service = service;
        }

        [HttpPost("send")]
        public async Task<IActionResult> Send(string email)
        {
            await _service.GenerateAndSendOtpAsync(email);
            return Ok(new { message = "OTP sent" });
        }

        [HttpPost("verify")]
        public async Task<IActionResult> Verify(string email, string otp)
        {
            var result = await _service.VerifyOtpAsync(email, otp);

            if (!result)
                return BadRequest(new { message = "Invalid or expired OTP" });

            return Ok(new { message = "Email verified" });
        }
    }
}