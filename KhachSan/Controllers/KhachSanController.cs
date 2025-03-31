using Microsoft.AspNetCore.Mvc;
using KhachSan.Data;
using KhachSan.Models;
using Microsoft.EntityFrameworkCore;

namespace KhachSan.Controllers
{
    public class KhachSanController : Controller
    {
        private readonly ApplicationDbContext _context;

        public KhachSanController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> KhachSan()
        {
            if (HttpContext.Session.GetString("HoTen") == null)
            {
                // Nếu không có Session đăng nhập, chuyển hướng tới trang đăng nhập
                return RedirectToAction("DangNhap", "TaiKhoan");
            }

            // Load dữ liệu phòng từ CSDL
            var rooms = await _context.Phongs
                .Include(p => p.MaLoaiPhongNavigation) // Kết hợp với bảng LoaiPhong
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
                .ToListAsync();

            // Truyền dữ liệu vào view
            return View(rooms);
        }
    }
}