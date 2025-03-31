using Microsoft.AspNetCore.Mvc;
using KhachSan.Data;
using KhachSan.Models;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace KhachSan.Controllers
{
    public class TaiKhoanController : Controller
    {
        private readonly ApplicationDbContext _context;

        public TaiKhoanController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Đăng ký
        [HttpGet]
        public IActionResult Dangky()
        {
            return View();
        }

        // POST: Đăng ký
        [HttpPost]
        public IActionResult Dangky(DangKyViewModel model)
        {
            bool hasError = false;

            // Giữ lại dữ liệu trong form
            ViewData["HotenKH"] = model.HotenKH;
            ViewData["TenDN"] = model.TenDN;
            ViewData["Email"] = model.Email;
            ViewData["Dienthoai"] = model.Dienthoai;

            // Kiểm tra dữ liệu đầu vào
            if (string.IsNullOrEmpty(model.HotenKH))
            {
                ViewData["Loi1"] = "Họ tên khách hàng không được để trống";
                hasError = true;
            }

            if (string.IsNullOrEmpty(model.TenDN))
            {
                ViewData["Loi2"] = "Phải nhập tên đăng nhập";
                hasError = true;
            }
            else
            {
                // Kiểm tra tên đăng nhập đã tồn tại chưa
                var existingUser = _context.NguoiDungs.SingleOrDefault(u => u.TenDangNhap == model.TenDN);
                if (existingUser != null)
                {
                    ViewData["Loi2"] = "Tên đăng nhập đã tồn tại. Vui lòng chọn tên đăng nhập khác.";
                    hasError = true;
                }
            }

            if (string.IsNullOrEmpty(model.MatKhau))
            {
                ViewData["Loi3"] = "Phải nhập mật khẩu";
                hasError = true;
            }

            if (string.IsNullOrEmpty(model.Matkhaunhaplai))
            {
                ViewData["Loi4"] = "Phải nhập lại mật khẩu";
                hasError = true;
            }
            else if (model.MatKhau != model.Matkhaunhaplai)
            {
                ViewData["Loi4"] = "Mật khẩu nhập lại không khớp";
                hasError = true;
            }

            if (string.IsNullOrEmpty(model.Email))
            {
                ViewData["Loi5"] = "Email không được bỏ trống";
                hasError = true;
            }
            else if (!System.Text.RegularExpressions.Regex.IsMatch(model.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            {
                ViewData["Loi5"] = "Email không đúng định dạng";
                hasError = true;
            }
            else
            {
                // Kiểm tra email đã tồn tại chưa
                var existingEmail = _context.NguoiDungs.SingleOrDefault(u => u.Email == model.Email);
                if (existingEmail != null)
                {
                    ViewData["Loi5"] = "Email đã tồn tại. Vui lòng sử dụng email khác.";
                    hasError = true;
                }
            }

            if (string.IsNullOrEmpty(model.Dienthoai))
            {
                ViewData["Loi6"] = "Phải nhập điện thoại";
                hasError = true;
            }
            else if (!System.Text.RegularExpressions.Regex.IsMatch(model.Dienthoai, @"^\d{10,11}$"))
            {
                ViewData["Loi6"] = "Số điện thoại phải là 10 hoặc 11 chữ số";
                hasError = true;
            }

            // Nếu không có lỗi, tiến hành lưu
            if (!hasError)
            {
                try
                {
                    var nd = new NguoiDung
                    {
                        HoTen = model.HotenKH,
                        TenDangNhap = model.TenDN,
                        MatKhau = HashPassword(model.MatKhau), // Mã hóa mật khẩu
                        Email = model.Email,
                        SoDienThoai = model.Dienthoai,
                        NgayTao = DateTime.Now, // Gán ngày tạo hiện tại
                        VaiTro = "Nhân Viên", // Thiết lập vai trò mặc định là Nhân Viên vì không có đặt online
                        TrangThai = "Hoạt Động" // Thêm trạng thái mặc định
                    };

                    _context.NguoiDungs.Add(nd);
                    _context.SaveChanges();


                    // Chuyển hướng đến trang đăng nhập
                    return RedirectToAction("Dangnhap");
                }
                catch (Exception ex)
                {
                    ViewData["Loi9"] = $"Có lỗi xảy ra khi tạo tài khoản. Chi tiết: {ex.Message}";
                }
            }

            // Nếu có lỗi, quay lại trang đăng ký
            return View("Dangky", model);
        }

        // GET: Đăng nhập
        [HttpGet]
        public IActionResult Dangnhap()
        {
            return View();
        }

        // POST: Đăng nhập
        [HttpPost]
        public IActionResult Dangnhap(DangNhapViewModel model)
        {
            if (!string.IsNullOrEmpty(model.TenDN) && !string.IsNullOrEmpty(model.MatKhau))
            {
                var hashedPassword = HashPassword(model.MatKhau);
                var user = _context.NguoiDungs.SingleOrDefault(u => u.TenDangNhap == model.TenDN && u.MatKhau == hashedPassword);

                if (user != null)
                {
                    // Lấy cookie nếu đã tồn tại
                    string loginCookie = Request.Cookies["LoginToken"];
                    string token;
                    int loginCount;

                    if (!string.IsNullOrEmpty(loginCookie) && loginCookie.Contains("|"))
                    {
                        var parts = loginCookie.Split('|');
                        if (parts.Length == 2)
                        {
                            // Giữ nguyên token cũ và tăng số lần đăng nhập
                            token = parts[0];
                            loginCount = int.Parse(parts[1]) + 1;
                        }
                        else
                        {
                            // Cookie không hợp lệ, tạo mới
                            token = Guid.NewGuid().ToString();
                            loginCount = 1;
                        }
                    }
                    else
                    {
                        // Không có cookie, tạo mới token và thiết lập số lần đăng nhập ban đầu
                        token = Guid.NewGuid().ToString();
                        loginCount = 1;
                    }

                    // Lưu token và số lần đăng nhập vào cookie
                    var authCookie = new CookieOptions
                    {
                        HttpOnly = true, // Chỉ truy cập được từ server, ngăn JavaScript đọc
                        Secure = false,  // Đặt thành false trong môi trường phát triển (localhost)
                        Expires = DateTime.Now.AddDays(30) // Token và số lần đăng nhập tồn tại trong 30 ngày
                    };
                    Response.Cookies.Append("LoginToken", $"{token}|{loginCount}", authCookie);

                    // Lưu thông tin người dùng vào Session
                    HttpContext.Session.SetInt32("NguoiDungId", user.MaNguoiDung);
                    HttpContext.Session.SetString("HoTen", user.HoTen);
                    HttpContext.Session.SetString("Role", user.VaiTro);
                    HttpContext.Session.SetString("TenDangNhap", user.TenDangNhap);
                    HttpContext.Session.SetString("SoDienThoai", user.SoDienThoai);
                    HttpContext.Session.SetString("Email", user.Email);

                    // Điều hướng dựa trên vai trò
                    if (user.VaiTro == "Admin")
                    {
                        return RedirectToAction("Index", "Home", new { area = "Admin" });
                    }
                    return RedirectToAction("KhachSan", "KhachSan");
                }
                else
                {
                    ViewBag.Thongbao = "Tên đăng nhập hoặc mật khẩu không đúng.";
                }
            }
            else
            {
                ViewBag.Thongbao = "Vui lòng nhập đầy đủ thông tin.";
            }
            return View(model);
        }

        // GET: Kiểm tra trạng thái đăng nhập
        [HttpGet]
        public IActionResult CheckLoginStatus()
        {
            bool loggedIn = HttpContext.Session.GetInt32("NguoiDungId") != null;
            string role = loggedIn ? HttpContext.Session.GetString("Role") : null;

            return Json(new { loggedIn, Role = role });
        }

        // GET: Thông tin người dùng
        public IActionResult Thongtinnguoidung()
        {
            if (HttpContext.Session.GetInt32("NguoiDungId") == null)
            {
                return RedirectToAction("Dangnhap");
            }
            return View();
        }

        // GET: Đổi mật khẩu
        [HttpGet]
        public IActionResult DoiMatKhau()
        {
            if (HttpContext.Session.GetInt32("NguoiDungId") == null)
            {
                return RedirectToAction("Dangnhap");
            }
            return View();
        }

        // POST: Đổi mật khẩu
        [HttpPost]
        public IActionResult DoiMatKhau(DoiMatKhauViewModel model)
        {
            if (HttpContext.Session.GetInt32("NguoiDungId") == null)
            {
                return RedirectToAction("Dangnhap");
            }

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            if (model.MatKhauMoi != model.XacNhanMatKhauMoi)
            {
                ViewBag.Thongbao = "Mật khẩu mới và xác nhận mật khẩu không khớp.";
                return View(model);
            }

            var userId = HttpContext.Session.GetInt32("NguoiDungId");
            var user = _context.NguoiDungs.SingleOrDefault(u => u.MaNguoiDung == userId);

            if (user == null)
            {
                ViewBag.Thongbao = "Không tìm thấy người dùng.";
                return View(model);
            }

            var hashedOldPassword = HashPassword(model.MatKhauCu);
            if (user.MatKhau != hashedOldPassword)
            {
                ViewBag.Thongbao = "Mật khẩu cũ không đúng.";
                return View(model);
            }

            user.MatKhau = HashPassword(model.MatKhauMoi);
            _context.SaveChanges();

            ViewBag.Thongbao = "Đổi mật khẩu thành công.";
            return View(model);
        }

        // GET: Đăng xuất
        [HttpGet]
        public IActionResult DangXuat()
        {
            // Xóa session
            HttpContext.Session.Clear();

            // Xóa cookie
            Response.Cookies.Delete("LoginToken");

            // Chuyển hướng về trang đăng nhập
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
    }
}