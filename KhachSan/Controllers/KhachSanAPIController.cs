using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KhachSan.Data;
using KhachSan.Models;
using System.Security.Claims;

namespace KhachSan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Nhân viên, Quản trị")]
    public class KhachSanAPIController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public KhachSanAPIController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("staff/available")]
        public async Task<IActionResult> GetAvailableStaff()
        {
            var maNhanVien = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var staffList = await _context.NguoiDungs
                .Where(n => n.MaNguoiDung != maNhanVien
                         && (n.VaiTro == "Nhân viên" || n.VaiTro == "Quản trị")
                         && n.TrangThai == "Hoạt động")
                .Select(n => new
                {
                    MaNguoiDung = n.MaNguoiDung,
                    HoTen = n.HoTen,
                    SoDienThoai = n.SoDienThoai
                })
                .ToListAsync();

            return Ok(new { success = true, nhanViens = staffList });
        }

        [HttpGet("current-shift")]
        public async Task<IActionResult> GetCurrentShift()
        {
            var maNhanVien = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var caHienTai = await _context.CaLamViecs
                .Where(c => c.MaNhanVien == maNhanVien && c.TrangThai == "Đang làm việc")
                .OrderByDescending(c => c.ThoiGianBatDau)
                .Select(c => new
                {
                    MaCa = c.MaCaLamViec,
                    ThoiGianBatDau = c.ThoiGianBatDau.ToString("dd/MM/yyyy HH:mm:ss"),
                    ThoiGianLamViec = DateTime.Now.Subtract(c.ThoiGianBatDau).TotalHours.ToString("0.00"),
                    TongTienTrongCa = c.TongTienTrongCa ?? 0,
                    TongTienChuyenGiao = c.TongTienChuyenGiao ?? 0
                })
                .FirstOrDefaultAsync();

            if (caHienTai == null)
            {
                return Ok(new { success = false, message = "Bạn chưa bắt đầu ca làm việc!" });
            }

            var nhanViens = await _context.NguoiDungs
                .Where(nv => (nv.VaiTro == "Nhân viên" || nv.VaiTro == "Quản trị")
                          && nv.MaNguoiDung != maNhanVien
                          && nv.TrangThai == "Hoạt động")
                .Select(nv => new
                {
                    MaNguoiDung = nv.MaNguoiDung,
                    HoTen = nv.HoTen,
                    SoDienThoai = nv.SoDienThoai
                })
                .ToListAsync();

            var tongTienHoaDon = await _context.HoaDons
                .Where(hd => hd.MaCaLamViec == caHienTai.MaCa && hd.TrangThaiThanhToan == "Đã thanh toán")
                .SumAsync(hd => hd.TongTien);

            return Ok(new
            {
                success = true,
                shift = caHienTai,
                nhanViens = nhanViens,
                tongTienHoaDon = tongTienHoaDon,
                thoiGianHienTai = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss")
            });
        }

        [HttpPost("end-shift")]
        public async Task<IActionResult> EndShift([FromBody] EndShiftModel model)
        {
            var maNhanVien = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = await _context.NguoiDungs.FindAsync(maNhanVien);
            if (user == null)
            {
                return Ok(new { success = false, message = "Không tìm thấy thông tin nhân viên!" });
            }

            // Kiểm tra ca làm việc
            CaLamViec caHienTai = null;
            if (user.VaiTro == "Quản trị" && model.MaNhanVien.HasValue)
            {
                // Quản trị viên kết ca hộ nhân viên khác
                caHienTai = await _context.CaLamViecs
                    .Where(c => c.MaNhanVien == model.MaNhanVien.Value && c.TrangThai == "Đang làm việc")
                    .OrderByDescending(c => c.ThoiGianBatDau)
                    .FirstOrDefaultAsync();

                if (caHienTai == null)
                {
                    return Ok(new { success = false, message = "Không tìm thấy ca làm việc đang hoạt động cho nhân viên được chọn!" });
                }
            }
            else
            {
                // Nhân viên kết ca cho chính mình
                caHienTai = await _context.CaLamViecs
                    .Where(c => c.MaNhanVien == maNhanVien && c.TrangThai == "Đang làm việc")
                    .OrderByDescending(c => c.ThoiGianBatDau)
                    .FirstOrDefaultAsync();

                if (caHienTai == null)
                {
                    return Ok(new { success = false, message = "Không tìm thấy ca làm việc đang hoạt động!" });
                }
            }

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    caHienTai.ThoiGianKetThuc = DateTime.Now;
                    caHienTai.TongTienTrongCa = model.TongTienTrongCa;
                    caHienTai.GhiChu = model.GhiChu;
                    caHienTai.TrangThai = "Đã kết thúc";

                    if (model.MaNhanVienCaTiepTheo.HasValue)
                    {
                        var nhanVienTiepTheo = await _context.NguoiDungs
                            .FirstOrDefaultAsync(nv => nv.MaNguoiDung == model.MaNhanVienCaTiepTheo.Value
                                                    && (nv.VaiTro == "Nhân viên" || nv.VaiTro == "Quản trị")
                                                    && nv.TrangThai == "Hoạt động");
                        if (nhanVienTiepTheo == null)
                        {
                            return Ok(new { success = false, message = "Nhân viên ca tiếp theo không hợp lệ!" });
                        }

                        caHienTai.MaNhanVienCaTiepTheo = model.MaNhanVienCaTiepTheo;
                        caHienTai.TongTienChuyenGiao = model.TongTienChuyenGiao;

                        var caMoi = new CaLamViec
                        {
                            MaNhanVien = model.MaNhanVienCaTiepTheo.Value,
                            ThoiGianBatDau = DateTime.Now,
                            TrangThai = "Đang làm việc",
                            TongTienChuyenGiao = model.TongTienChuyenGiao
                        };
                        await _context.CaLamViecs.AddAsync(caMoi);

                        var nhanVienHienTai = await _context.NguoiDungs.FindAsync(maNhanVien);
                        var thongBao = new ThongBao
                        {
                            MaNguoiGui = maNhanVien,
                            MaNguoiNhan = model.MaNhanVienCaTiepTheo.Value,
                            TieuDe = "Giao ca làm việc",
                            NoiDung = $"Nhân viên {nhanVienHienTai.HoTen} đã giao ca cho bạn với số tiền chuyển giao: {model.TongTienChuyenGiao:#,##0} VNĐ",
                            LoaiThongBao = "Giao ca",
                            ThoiGianGui = DateTime.Now,
                            TrangThai = "Chưa đọc"
                        };
                        await _context.ThongBaos.AddAsync(thongBao);
                    }

                    var lichSuThaoTac = new LichSuThaoTac
                    {
                        MaCaLamViec = caHienTai.MaCaLamViec,
                        MaNhanVien = maNhanVien,
                        LoaiThaoTac = model.MaNhanVienCaTiepTheo.HasValue ? "Giao ca" : "Kết ca",
                        ChiTiet = model.GhiChu,
                        ThoiGian = DateTime.Now
                    };
                    await _context.LichSuThaoTacs.AddAsync(lichSuThaoTac);

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return Ok(new
                    {
                        success = true,
                        message = model.MaNhanVienCaTiepTheo.HasValue ? "Giao ca thành công!" : "Kết thúc ca làm việc thành công!"
                    });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return Ok(new { success = false, message = $"Lỗi khi kết thúc ca: {ex.Message}, Inner: {ex.InnerException?.Message}" });
                }
            }
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalRevenue = await _context.HoaDons
                .Where(hd => hd.TrangThaiThanhToan == "Đã thanh toán")
                .SumAsync(hd => hd.TongTien);

            var totalCustomers = await _context.KhachHangLuuTrus
                .CountAsync();

            var totalRooms = await _context.Phongs
                .CountAsync();

            var occupiedRooms = await _context.Phongs
                .CountAsync(p => p.DangSuDung == true);

            var availableRooms = totalRooms - occupiedRooms;

            var pendingPayment = await _context.DatPhongs
                .CountAsync(dp => dp.TrangThaiThanhToan == "Chưa thanh toán");

            var pendingCheckin = await _context.DatPhongs
                .CountAsync(dp => dp.TrangThai == "Chờ xác nhận");

            var pendingCheckout = await _context.DatPhongs
                .CountAsync(dp => dp.TrangThai == "Đã nhận phòng");

            var pendingBooking = await _context.DatPhongs
                .CountAsync(dp => dp.TrangThai == "Chờ xác nhận");

            var stats = new
            {
                TotalRevenue = totalRevenue,
                TotalCustomers = totalCustomers,
                TotalRooms = totalRooms,
                OccupiedRooms = occupiedRooms,
                AvailableRooms = availableRooms,
                PendingPayment = pendingPayment,
                PendingCheckin = pendingCheckin,
                PendingCheckout = pendingCheckout,
                PendingBooking = pendingBooking
            };

            return Ok(stats);
        }
        [HttpGet("current-user")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var maNhanVien = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = await _context.NguoiDungs
                .Where(n => n.MaNguoiDung == maNhanVien)
                .Select(n => new
                {
                    MaNguoiDung = n.MaNguoiDung,
                    HoTen = n.HoTen,
                    VaiTro = n.VaiTro
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return Ok(new { success = false, message = "Không tìm thấy thông tin người dùng!" });
            }

            return Ok(new { success = true, user });
        }

        [HttpGet("check-stuck-shifts")]
public async Task<IActionResult> CheckStuckShifts()
{
    var stuckShifts = await _context.CaLamViecs
        .Where(c => c.TrangThai == "Đang làm việc"
                 && c.ThoiGianBatDau < DateTime.Now.AddHours(-24))
        .ToListAsync();

    foreach (var shift in stuckShifts)
    {
        var nhanVien = await _context.NguoiDungs.FindAsync(shift.MaNhanVien);
        var quanTris = await _context.NguoiDungs
            .Where(nv => nv.VaiTro == "Quản trị")
            .ToListAsync();

        // Gửi thông báo cho tất cả quản trị viên
        foreach (var quanTri in quanTris)
        {
            var thongBaoQuanTri = new ThongBao
            {
                MaNguoiGui = shift.MaNhanVien,
                MaNguoiNhan = quanTri.MaNguoiDung,
                TieuDe = "Ca làm việc bị kẹt",
                NoiDung = $"Ca làm việc của nhân viên {nhanVien.HoTen} (Mã ca: {shift.MaCaLamViec}) đã ở trạng thái 'Đang làm việc' quá 24 giờ. Vui lòng kiểm tra!",
                LoaiThongBao = "Cảnh báo",
                ThoiGianGui = DateTime.Now,
                TrangThai = "Chưa đọc"
            };
            await _context.ThongBaos.AddAsync(thongBaoQuanTri);
        }

        // Gửi thông báo cho nhân viên bị kẹt ca
        var thongBaoNhanVien = new ThongBao
        {
            MaNguoiGui = null, // Hệ thống gửi
            MaNguoiNhan = shift.MaNhanVien,
            TieuDe = "Ca làm việc của bạn bị kẹt",
            NoiDung = $"Ca làm việc của bạn (Mã ca: {shift.MaCaLamViec}) đã ở trạng thái 'Đang làm việc' quá 24 giờ. Vui lòng kết thúc ca!",
            LoaiThongBao = "Cảnh báo",
            ThoiGianGui = DateTime.Now,
            TrangThai = "Chưa đọc"
        };
        await _context.ThongBaos.AddAsync(thongBaoNhanVien);
    }

    await _context.SaveChangesAsync();
    return Ok(new { success = true, message = "Đã kiểm tra các ca bị kẹt!" });
}

        [HttpGet("notifications")]
        public async Task<IActionResult> GetNotifications()
        {
            var maNhanVien = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var notifications = await _context.ThongBaos
                .Where(tb => tb.MaNguoiNhan == maNhanVien)
                .OrderByDescending(tb => tb.ThoiGianGui)
                .Select(tb => new
                {
                    Id = tb.MaThongBao,
                    Sender = tb.MaNguoiGuiNavigation != null ? tb.MaNguoiGuiNavigation.HoTen : "Hệ thống",
                    Title = tb.TieuDe,
                    Content = tb.NoiDung,
                    Type = tb.LoaiThongBao,
                    Time = tb.ThoiGianGui.ToString("dd/MM/yyyy HH:mm:ss"),
                    Status = tb.TrangThai
                })
                .ToListAsync();

            var unreadCount = notifications.Count(n => n.Status == "Chưa đọc");

            return Ok(new
            {
                success = true,
                notifications = notifications,
                unreadCount = unreadCount
            });
        }
        [HttpGet("notifications/unread")]
        public async Task<IActionResult> GetUnreadNotifications()
        {
            var maNhanVien = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var notifications = await _context.ThongBaos
                .Where(t => t.MaNguoiNhan == maNhanVien && t.TrangThai == "Chưa đọc")
                .OrderByDescending(t => t.ThoiGianGui)
                .Select(t => new
                {
                    MaThongBao = t.MaThongBao,
                    TieuDe = t.TieuDe,
                    NoiDung = t.NoiDung,
                    LoaiThongBao = t.LoaiThongBao,
                    ThoiGianGui = t.ThoiGianGui.ToString("dd/MM/yyyy HH:mm:ss"),
                    TrangThai = t.TrangThai
                })
                .ToListAsync();

            var unreadCount = notifications.Count;

            return Ok(new { success = true, notifications, unreadCount });
        }

        [HttpPost("notifications/mark-read/{maThongBao}")]
        public async Task<IActionResult> MarkNotificationAsRead(int maThongBao)
        {
            Console.WriteLine($"Received request to mark as read: {maThongBao}");
            try
            {
                var maNhanVien = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                Console.WriteLine($"Đánh dấu đã đọc: maThongBao={maThongBao}, maNhanVien={maNhanVien}");

                var thongBao = await _context.ThongBaos
                    .FirstOrDefaultAsync(t => t.MaThongBao == maThongBao && t.MaNguoiNhan == maNhanVien);

                if (thongBao == null)
                {
                    Console.WriteLine("Không tìm thấy thông báo");
                    return Ok(new { success = false, message = "Không tìm thấy thông báo!" });
                }

                // Chỉ cập nhật nếu thực sự là "Chưa đọc"
                if (thongBao.TrangThai == "Chưa đọc")
                {
                    Console.WriteLine($"Tìm thấy thông báo: {thongBao.TieuDe}, trạng thái hiện tại: {thongBao.TrangThai}");
                    thongBao.TrangThai = "Đã đọc";
                    _context.Entry(thongBao).State = EntityState.Modified;
                    var result = await _context.SaveChangesAsync();
                    Console.WriteLine($"Số bản ghi được cập nhật: {result}");

                    // Kiểm tra lại sau khi lưu
                    var updatedNotification = await _context.ThongBaos
                        .FirstOrDefaultAsync(t => t.MaThongBao == maThongBao);
                    Console.WriteLine($"Trạng thái sau khi lưu: {updatedNotification?.TrangThai}");

                    var unreadCount = await _context.ThongBaos
                        .CountAsync(t => t.MaNguoiNhan == maNhanVien && t.TrangThai == "Chưa đọc");

                    return Ok(new
                    {
                        success = true,
                        message = "Đã đánh dấu thông báo là đã đọc!",
                        unreadCount,
                        status = updatedNotification?.TrangThai
                    });
                }
                else
                {
                    Console.WriteLine($"Thông báo đã được đánh dấu đọc từ trước");

                    var unreadCount = await _context.ThongBaos
                        .CountAsync(t => t.MaNguoiNhan == maNhanVien && t.TrangThai == "Chưa đọc");

                    return Ok(new
                    {
                        success = true,
                        message = "Thông báo đã được đánh dấu đọc từ trước!",
                        unreadCount,
                        status = thongBao.TrangThai
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi: {ex.Message}");
                return Ok(new { success = false, message = $"Lỗi: {ex.Message}" });
            }
        }
    }

}
