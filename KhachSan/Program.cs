using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using KhachSan.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddControllersWithViews();

// ??ng k� DbContext v?i chu?i k?t n?i t? appsettings.json
builder.Services.AddDbContext<KhachSan.Data.ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// C?u h�nh Session
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Th?i gian timeout c?a Session
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseSession(); // S? d?ng Session

app.UseAuthorization();

// ??nh tuy?n cho Razor Pages
app.MapRazorPages();

// ??nh tuy?n cho MVC v� Areas
app.UseEndpoints(endpoints =>
{
    // ??nh tuy?n c? th? cho /Admin
    endpoints.MapControllerRoute(
        name: "admin",
        pattern: "Admin",
        defaults: new { area = "Admin", controller = "Home", action = "Index" }
    );

    // ??nh tuy?n cho Areas
    endpoints.MapControllerRoute(
        name: "areas",
        pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}"
    );

    // ??nh tuy?n m?c ??nh cho MVC (kh�ng thu?c Area)
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}"
    );

    // ??nh tuy?n cho API (n?u c�)
    endpoints.MapControllers();
});

app.Run();