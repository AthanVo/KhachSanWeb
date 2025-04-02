using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.Extensions.Logging;
using System;
using Newtonsoft.Json;

namespace KhachSan.Middleware
{
    public class SessionRecoveryMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<SessionRecoveryMiddleware> _logger;

        public SessionRecoveryMiddleware(RequestDelegate next, ILogger<SessionRecoveryMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.User.Identity.IsAuthenticated)
            {
                // Danh sách các session keys cần khôi phục từ claims
                string[] sessionKeysToRecover = new[] { "UserId", "UserName", "FullName", "Role" };

                foreach (var key in sessionKeysToRecover)
                {
                    // Kiểm tra nếu session không tồn tại nhưng có thông tin trong claims
                    if (context.Session.GetString(key) == null)
                    {
                        var claimValue = context.User.FindFirstValue(key);
                        if (!string.IsNullOrEmpty(claimValue))
                        {
                            context.Session.SetString(key, claimValue);
                            _logger.LogInformation($"Đã khôi phục session {key} từ claim cho người dùng {context.User.Identity.Name}");
                        }
                    }
                }

                // Khôi phục các đối tượng phức tạp (nếu có)
                if (context.Session.GetString("UserObject") == null)
                {
                    var userDataClaim = context.User.FindFirstValue("UserData");
                    if (!string.IsNullOrEmpty(userDataClaim))
                    {
                        context.Session.SetString("UserObject", userDataClaim);
                        _logger.LogInformation($"Đã khôi phục UserObject từ claim cho người dùng {context.User.Identity.Name}");
                    }
                }
            }

            await _next(context);
        }
    }
}