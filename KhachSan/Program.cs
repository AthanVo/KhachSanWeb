using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using KhachSan.Data;
using KhachSan.Middleware;
using System;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddControllersWithViews();

// Đăng ký DbContext với chuỗi kết nối từ appsettings.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Trong Program.cs
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/TaiKhoan/Dangnhap";
        options.AccessDeniedPath = "/Home/AccessDenied"; // 👈 Trang từ chối truy cập
        options.ExpireTimeSpan = TimeSpan.FromDays(30); // Thời gian sống của cookie
        options.SlidingExpiration = true; // Gia hạn cookie khi sử dụng
        options.Cookie.HttpOnly = true; // Chống XSS
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Chỉ dùng HTTPS
        options.Cookie.IsEssential = true; // Luôn gửi cookie
    });

// Cấu hình Session - Tăng thời gian timeout
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromHours(24); // Tăng thời gian session để giảm khả năng mất dữ liệu
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Cấu hình HSTS cho Production
builder.Services.AddHsts(options =>
{
    options.MaxAge = TimeSpan.FromDays(365);
    options.IncludeSubDomains = true;
    options.Preload = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}
else
{
    // Khởi tạo DB trong môi trường Development
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        dbContext.Database.EnsureCreated();
    }
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// Đặt Session trước Authentication
app.UseSession();

// Thêm middleware để khôi phục session từ claims
app.UseMiddleware<SessionRecoveryMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "areas",
        pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}"
    );
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}"
    );
    endpoints.MapRazorPages();
});

app.Run();