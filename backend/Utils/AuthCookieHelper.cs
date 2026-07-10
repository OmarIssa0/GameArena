using backend.DTOs.Responses;

namespace backend.Utils;

public static class AuthCookieHelper
{
    public static void SetAuthCookies(HttpResponse response, AuthResponse auth)
    {
        response.Cookies.Append(
            "access_token",
            auth.AccessToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
                Expires = DateTime.UtcNow.AddMinutes(5)
            });

        response.Cookies.Append(
            "refresh_token",
            auth.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
                Expires = DateTime.UtcNow.AddDays(7)
            });
    }

    public static void ClearAuthCookies(HttpResponse response)
    {
        var options = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/"
        };

        response.Cookies.Delete("access_token", options);
        response.Cookies.Delete("refresh_token", options);
    }
}
