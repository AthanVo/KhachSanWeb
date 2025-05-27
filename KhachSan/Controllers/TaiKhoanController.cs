using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using KhachSan.Data;
using KhachSan.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;


namespace KhachSan.Controllers
{
    public class TaiKhoanController : Controller
    {
        private readonly ApplicationDBContext _context;

        public TaiKhoanController(ApplicationDBContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet]
        public IActionResult Thongtinnguoidung()
        {
            // Lấy thông tin từ claims (được lưu khi đăng nhập)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int maNguoiDung))
            {
                return RedirectToAction("Dangnhap", "TaiKhoan");
            }

            // Lấy thông tin người dùng từ database
            var user = _context.NguoiDung.Find(maNguoiDung);
            if (user == null)
            {
                return RedirectToAction("Dangnhap", "TaiKhoan");
            }

            // Tạo model để hiển thị
            var model = new ThongTinNguoiDungViewModell
            {
                NguoiDungId = user.MaNguoiDung,
                HoTen = user.HoTen,
                Email = user.Email,
                SoDienThoai = user.SoDienThoai,
                DiaChi = user.DiaChi ?? "Chưa cập nhật",
                NgayDangKy = user.NgayTao
            };

            return View(model);
        }

        // GET: Đăng ký
        [HttpGet]
        public IActionResult Dangky()
        {
            // Khởi tạo model từ TempData nếu có
            var model = new DangKyViewModel
            {
                HotenKH = TempData["HotenKH"]?.ToString(),
                TenDN = TempData["TenDN"]?.ToString(),
                Email = TempData["Email"]?.ToString(),
                Dienthoai = TempData["Dienthoai"]?.ToString()
            };

            return View(model);
        }

        // POST: Đăng ký
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Dangky(DangKyViewModel model)
        {
            bool hasError = false;

            // Kiểm tra dữ liệu đầu vào
            if (string.IsNullOrEmpty(model.HotenKH))
            {
                ModelState.AddModelError("HotenKH", "Họ tên khách hàng không được để trống");
                hasError = true;
            }

            if (string.IsNullOrEmpty(model.TenDN))
            {
                ModelState.AddModelError("TenDN", "Phải nhập tên đăng nhập");
                hasError = true;
            }
            else
            {
                var existingUser = _context.NguoiDung.SingleOrDefault(u => u.TenDangNhap == model.TenDN);
                if (existingUser != null)
                {
                    ModelState.AddModelError("TenDN", "Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.");
                    hasError = true;
                }
            }

            if (string.IsNullOrEmpty(model.MatKhau))
            {
                ModelState.AddModelError("MatKhau", "Phải nhập mật khẩu");
                hasError = true;
            }

            if (string.IsNullOrEmpty(model.Matkhaunhaplai))
            {
                ModelState.AddModelError("Matkhaunhaplai", "Phải nhập lại mật khẩu");
                hasError = true;
            }
            else if (model.MatKhau != model.Matkhaunhaplai)
            {
                ModelState.AddModelError("Matkhaunhaplai", "Mật khẩu nhập lại không khớp");
                hasError = true;
            }

            if (string.IsNullOrEmpty(model.Email))
            {
                ModelState.AddModelError("Email", "Email không được bỏ trống");
                hasError = true;
            }
            else if (!System.Text.RegularExpressions.Regex.IsMatch(model.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            {
                ModelState.AddModelError("Email", "Email không đúng định dạng");
                hasError = true;
            }
            else
            {
                var existingEmail = _context.NguoiDung.SingleOrDefault(u => u.Email == model.Email);
                if (existingEmail != null)
                {
                    ModelState.AddModelError("Email", "Email đã tồn tại. Vui lòng sử dụng email khác.");
                    hasError = true;
                }
            }

            if (string.IsNullOrEmpty(model.Dienthoai))
            {
                ModelState.AddModelError("Dienthoai", "Phải nhập điện thoại");
                hasError = true;
            }
            else if (!System.Text.RegularExpressions.Regex.IsMatch(model.Dienthoai, @"^\d{10,11}$"))
            {
                ModelState.AddModelError("Dienthoai", "Số điện thoại phải là 10 hoặc 11 chữ số");
                hasError = true;
            }

            // Nếu có lỗi, hiển thị lại view với ModelState errors
            if (!ModelState.IsValid || hasError)
            {
                return View(model);
            }

            // Lưu người dùng nếu không có lỗi
            try
            {
                var nd = new NguoiDung
                {
                    HoTen = model.HotenKH,
                    TenDangNhap = model.TenDN,
                    MatKhau = HashPassword(model.MatKhau),
                    Email = model.Email,
                    SoDienThoai = model.Dienthoai,
                    NgayTao = DateTime.Now,
                    VaiTro = "Khách hàng", // Mặc định cho đăng ký trực tuyến
                    TrangThai = "Hoạt động"
                };

                _context.NguoiDung.Add(nd);
                _context.SaveChanges();

                TempData["Success"] = "Đăng ký thành công! Vui lòng đăng nhập.";
                return RedirectToAction("Dangnhap");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", $"Có lỗi xảy ra: {ex.Message}");
                return View(model);
            }
        }

        // GET: Đăng nhập
        [HttpGet]
        public IActionResult Dangnhap()
        {
            return View();
        }

        // POST: Đăng nhập
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Dangnhap(DangNhapViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Tìm user theo TenDangNhap
            var user = _context.NguoiDung.SingleOrDefault(u => u.TenDangNhap == model.TenDN);

            // Kiểm tra mật khẩu
            if (user == null || HashPassword(model.MatKhau) != user.MatKhau)
            {
                ModelState.AddModelError("", "Tên đăng nhập hoặc mật khẩu không đúng.");
                return View(model);
            }

            // Tạo claims
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.MaNguoiDung.ToString()),
        new Claim(ClaimTypes.Name, user.HoTen),
        new Claim(ClaimTypes.Role, user.VaiTro),
        new Claim(ClaimTypes.Email, user.Email ?? ""),
        new Claim("PhoneNumber", user.SoDienThoai ?? ""),
        new Claim("TenDangNhap", user.TenDangNhap)
    };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            // Cấu hình cookie
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = model.RememberMe, // Lưu cookie lâu dài
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(30),
                AllowRefresh = true
            };

            // Đăng nhập và lưu cookie
            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                principal,
                authProperties);

            // Lưu session
            HttpContext.Session.SetInt32("NguoiDungId", user.MaNguoiDung);
            HttpContext.Session.SetString("HoTen", user.HoTen);
            // ... các session khác ...

            return RedirectToAction("Index", "Home");
        }

        // GET: Đăng xuất
        [HttpGet]
        public async Task<IActionResult> DangXuat()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            HttpContext.Session.Clear();
            Response.Cookies.Delete("LoginToken");
            return RedirectToAction("Dangnhap");
        }

        // Hàm mã hóa mật khẩu
        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        [Authorize]
        [HttpGet]
        public IActionResult DoiMatKhau()
        {
            return View();
        }

        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DoiMatKhau(DoiMatKhauViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Lấy ID người dùng từ cookie
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int maNguoiDung))
            {
                ModelState.AddModelError("", "Phiên đăng nhập không hợp lệ");
                return View(model);
            }

            // Tìm người dùng trong DB
            var user = await _context.NguoiDung.FindAsync(maNguoiDung);
            if (user == null)
            {
                ModelState.AddModelError("", "Người dùng không tồn tại");
                return View(model);
            }

            // Kiểm tra mật khẩu hiện tại
            var hashedCurrentPassword = HashPassword(model.MatKhauHienTai);
            if (user.MatKhau != hashedCurrentPassword)
            {
                ModelState.AddModelError("MatKhauHienTai", "Mật khẩu hiện tại không đúng");
                return View(model);
            }

            // Cập nhật mật khẩu mới
            user.MatKhau = HashPassword(model.MatKhauMoi);
            _context.Update(user);
            await _context.SaveChangesAsync();

            // Đăng xuất và yêu cầu đăng nhập lại
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            HttpContext.Session.Clear();

            TempData["Success"] = "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.";
            return RedirectToAction("Dangnhap");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            // Xóa session
            HttpContext.Session.Clear();

            // Hủy xác thực (sign out) của cookie
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            // Chuyển hướng về trang chủ hoặc trang đăng nhập
            return RedirectToAction("Index", "Home");
        }

    }
}