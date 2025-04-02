using KhachSan.Data;
using System.ComponentModel.DataAnnotations;

namespace KhachSan.Models
{
    public class ModelViewPhong
    {
        public int MaPhong { get; set; }
        public string SoPhong { get; set; }
        public string LoaiPhong { get; set; } // Tên loại phòng (string)
        public decimal GiaTheoGio { get; set; }
        public decimal GiaTheoNgay { get; set; } // Thêm nếu cần
        public bool DangSuDung { get; set; }
        public string TrangThai { get; set; }
        public string KhachHang { get; set; }
        public string MaHoaDon { get; set; }
        public string NhanVien { get; set; }
        public string NgayNhanPhong { get; set; }
        public string HienTrang { get; set; }
        public string MoTa { get; set; }
        public DateTime? ThoiGianTraPhongCuoi { get; set; }
        // Xóa MaLoaiPhongNavigation vì không cần trong ViewModel
    }

    // ViewModel for booking a room
    public class DatPhongViewModel
    {
        [Required]
        public int MaPhong { get; set; }

        [Required]
        public string CCCD { get; set; }

        [Required]
        public string HoTen { get; set; }

        public string DiaChi { get; set; }

        [Required]
        public string QuocTich { get; set; }

        [Required]
        public string LoaiDat { get; set; } // Theo giờ, Theo ngày, Qua đêm
    }

    // ViewModel for adding service
    public class ThemDichVuViewModel
    {
        [Required]
        public int MaHoaDon { get; set; }

        [Required]
        public string MaDichVu { get; set; }

        [Required]
        [Range(1, 100)]
        public int SoLuong { get; set; }
    }

    // ViewModel for payment
    public class ThanhToanViewModel
    {
        [Required]
        public int MaHoaDon { get; set; }

        public string GhiChu { get; set; }

        public decimal TienKhuyenMai { get; set; }

        public decimal TienTraTruoc { get; set; }
    }

    // ViewModel for creating group
    public class TaoNhomViewModel
    {
        [Required]
        public string TenNhom { get; set; }

        [Required]
        public string NguoiDaiDien { get; set; }

        public string SoDienThoai { get; set; }

        [Required]
        public List<int> DanhSachPhong { get; set; }
    }

    // ViewModel for merge bills
    public class GopHoaDonViewModel
    {
        [Required]
        public int MaNhom { get; set; }

        [Required]
        public List<int> DanhSachPhong { get; set; }
    }

    // ViewModel for end shift
    public class KetCaViewModel
    {
        [Required]
        public int NhanVienCaSau { get; set; }

        public string GhiChu { get; set; }
    }

    // ViewModel for room transfer
    public class ChuyenPhongViewModel
    {
        [Required]
        public int MaHoaDon { get; set; }

        [Required]
        public int MaPhongCu { get; set; }

        [Required]
        public int MaPhongMoi { get; set; }

        public string LyDo { get; set; }
    }

    // ViewModel for closing room
    public class DongPhongViewModel
    {
        [Required]
        public int MaPhong { get; set; }

        [Required]
        public string LyDo { get; set; }
    }

    // ViewModel for bill details
    public class ChiTietHoaDonViewModel
    {
        public int MaHoaDon { get; set; }
        public string TenKhachHang { get; set; }
        public string SoPhong { get; set; }
        public DateTime NgayNhanPhong { get; set; }
        public decimal TienPhong { get; set; }
        public List<ChiTietDichVuViewModel> DanhSachDichVu { get; set; }
        public decimal TongTienDichVu { get; set; }
        public decimal TongTien { get; set; }
        public decimal TienKhuyenMai { get; set; }
        public decimal TienCanTra { get; set; }
        public decimal TienTraTruoc { get; set; }
        public string NhanVienMoPhong { get; set; }
    }

    public class ChiTietDichVuViewModel
    {
        public string MaDichVu { get; set; }
        public string TenDichVu { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
        public decimal ChietKhau { get; set; }
        public decimal ThanhTien { get; set; }
    }

}