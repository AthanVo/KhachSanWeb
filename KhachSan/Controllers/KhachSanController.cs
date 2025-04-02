using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KhachSan.Data;
using KhachSan.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace KhachSan.Controllers
{
    public class KhachSanController : Controller
    {
        private readonly ApplicationDbContext _context;

        public KhachSanController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Nhân viên, Quản trị")]
        public async Task<IActionResult> KhachSan()
        {
            try
            {
                // Kiểm tra xem session có tồn tại không
                // Nếu middleware hoạt động đúng, session sẽ được khôi phục tự động
                if (HttpContext.Session.GetString("UserId") == null)
                {
                    // Session bị mất, nhưng đã có middleware khôi phục
                    // Thêm logging để theo dõi
                    var userId = User.FindFirstValue("UserId");
                    var userName = User.FindFirstValue("UserName");

                    if (!string.IsNullOrEmpty(userId))
                    {
                        // Ghi log cho việc khôi phục session
                        Console.WriteLine($"Session đã được khôi phục tự động cho người dùng: {userName}");
                    }
                }

                // Load dữ liệu phòng từ CSDL
                var rooms = await _context.Phongs
                    .Include(p => p.MaLoaiPhongNavigation)
                    .Select(p => new ModelViewPhong
                    {
                        MaPhong = p.MaPhong,
                        SoPhong = p.SoPhong,
                        LoaiPhong = p.MaLoaiPhongNavigation.TenLoaiPhong,
                        GiaTheoGio = p.MaLoaiPhongNavigation.GiaTheoGio,
                        DangSuDung = p.DangSuDung,
                        MoTa = p.MoTa,
                        TrangThai = p.DangSuDung ? "Đang sử dụng" : "Trống"
                    })
                    .OrderBy(p => p.SoPhong) // Sắp xếp theo số phòng
                    .ToListAsync();

                return View(rooms);
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"Có lỗi xảy ra khi tải danh sách phòng: {ex.Message}";
                return RedirectToAction("Index", "Home"); // Chuyển hướng về trang chủ nếu lỗi
            }
        }
    }
}