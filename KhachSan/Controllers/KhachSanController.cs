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
        private readonly ApplicationDBContext _context;
        private readonly ILogger<KhachSanController> _logger;

        public KhachSanController(ApplicationDBContext context, ILogger<KhachSanController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        [Authorize(Roles = "Nhân viên, Quản trị")]
        public async Task<IActionResult> KhachSan(int page = 1)
        {
            try
            {
                // Kiểm tra và khôi phục session
                if (HttpContext.Session.GetString("UserId") == null)
                {
                    var userId = User.FindFirstValue("UserId");
                    var userName = User.FindFirstValue("UserName");

                    if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int parsedUserId))
                    {
                        _logger.LogWarning("Không thể khôi phục session: UserId không hợp lệ.");
                    }
                    else
                    {
                        HttpContext.Session.SetString("UserId", parsedUserId.ToString());
                        _logger.LogInformation($"Session đã được khôi phục tự động cho người dùng: {userName}");
                    }
                }

                // Số phòng trên mỗi trang
                const int pageSize = 16;

                // Tính tổng số phòng
                var totalRooms = await _context.Phong.CountAsync();

                // Tính tổng số trang
                var totalPages = (int)Math.Ceiling((double)totalRooms / pageSize);

                // Đảm bảo page hợp lệ
                page = page < 1 ? 1 : page;
                page = page > totalPages ? totalPages : page;

                // Load dữ liệu phòng từ CSDL với phân trang
                var rooms = await _context.Phong
                    .Include(p => p.LoaiPhong)
                    .Include(p => p.DatPhong.Where(dp => dp.TrangThai == "Đã nhận phòng" || dp.TrangThai == "Đã trả phòng"))
                        .ThenInclude(dp => dp.KhachHangLuuTru)
                    .Include(p => p.DatPhong)
                        .ThenInclude(dp => dp.NhanVien)
                    .Include(p => p.DatPhong)
                        .ThenInclude(dp => dp.HoaDon)
                    .Select(p => new ModelViewPhong
                    {
                        MaPhong = p.MaPhong,
                        SoPhong = p.SoPhong,
                        LoaiPhong = p.LoaiPhong.TenLoaiPhong,
                        GiaTheoGio = p.LoaiPhong.GiaTheoGio,
                        GiaTheoNgay = p.LoaiPhong.GiaTheoNgay,
                        DangSuDung = p.DangSuDung,
                        MoTa = p.MoTa,
                        TrangThai = p.DangSuDung ? "Đang sử dụng" : "Trống",
                        MaDatPhong = p.DangSuDung ? p.DatPhong
                            .Where(dp => dp.MaPhong == p.MaPhong && dp.TrangThai == "Đã nhận phòng")
                            .Select(dp => (int?)dp.MaDatPhong)
                            .FirstOrDefault() : null,
                        KhachHang = p.DangSuDung ? p.DatPhong
                            .Where(dp => dp.MaPhong == p.MaPhong && dp.TrangThai == "Đã nhận phòng")
                            .Select(dp => dp.MaKhachHangLuuTru != null ? dp.KhachHangLuuTru.HoTen : "")
                            .FirstOrDefault() : "",
                        NhanVien = p.DangSuDung ? p.DatPhong
                            .Where(dp => dp.MaPhong == p.MaPhong && dp.TrangThai == "Đã nhận phòng")
                            .Select(dp => dp.MaNhanVien != null ? dp.NhanVien.HoTen : "")
                            .FirstOrDefault() : "",
                        MaNhanVien = p.DangSuDung ? p.DatPhong
                            .Where(dp => dp.MaPhong == p.MaPhong && dp.TrangThai == "Đã nhận phòng")
                            .Select(dp => (int?)dp.MaNhanVien)
                            .FirstOrDefault() : null,
                        NgayNhanPhong = p.DangSuDung ? p.DatPhong
                            .Where(dp => dp.MaPhong == p.MaPhong && dp.TrangThai == "Đã nhận phòng")
                            .Select(dp => (DateTime?)dp.NgayNhanPhong)
                            .FirstOrDefault() : null,
                        MaHoaDon = p.DangSuDung ? p.DatPhong
                            .Where(dp => dp.MaPhong == p.MaPhong && dp.TrangThai == "Đã nhận phòng")
                            .Select(dp => dp.HoaDon != null && dp.HoaDon.Any() ? (int?)dp.HoaDon.FirstOrDefault().MaHoaDon : null)
                            .FirstOrDefault() : null,
                        HienTrang = p.MoTa,
                        ThoiGianTraPhongCuoi = !p.DangSuDung ? p.DatPhong
                            .Where(dp => dp.MaPhong == p.MaPhong && dp.TrangThai == "Đã trả phòng")
                            .OrderByDescending(dp => dp.NgayTraPhong)
                            .Select(dp => (DateTime?)dp.NgayTraPhong)
                            .FirstOrDefault() : null
                    })
                    .OrderBy(p => p.SoPhong)
                    .Skip((page - 1) * pageSize) // Bỏ qua các phòng của trang trước
                    .Take(pageSize) // Lấy 16 phòng cho trang hiện tại
                    .ToListAsync();

                // Truyền thông tin phân trang vào ViewBag để sử dụng trong view
                ViewBag.CurrentPage = page;
                ViewBag.TotalPages = totalPages;
                ViewBag.PageSize = pageSize;
                ViewBag.TotalRooms = totalRooms;

                return View(rooms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Có lỗi xảy ra khi tải danh sách phòng.");
                TempData["Error"] = "Có lỗi xảy ra khi tải danh sách phòng. Vui lòng thử lại sau.";
                return RedirectToAction("Index", "Home");
            }
        }
    }
}