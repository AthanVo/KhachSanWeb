using KhachSan.Data;
using System.ComponentModel.DataAnnotations;

namespace KhachSan.Models
{
    public class ModelViewPhong
    {
        public int MaPhong { get; set; }
        public string SoPhong { get; set; }
        public string LoaiPhong { get; set; }
        public decimal GiaTheoGio { get; set; }
        public decimal GiaTheoNgay { get; set; }
        public bool DangSuDung { get; set; }
        public string TrangThai { get; set; }
        public string KhachHang { get; set; }
        public int? MaHoaDon { get; set; } // Sửa từ string thành int?
        public string NhanVien { get; set; }
        public DateTime? NgayNhanPhong { get; set; }
        public string HienTrang { get; set; } // Sửa từ int thành string
        public string MoTa { get; set; }
        public DateTime? ThoiGianTraPhongCuoi { get; set; }
        public int? MaDatPhong { get; internal set; } // Sửa từ object thành int?
        public int? MaNhanVien { get; set; }
    }

    public class DatPhongViewModel
    {
        [Required]
        public int MaPhong { get; set; }

        [Required]
        public string SoGiayTo { get; set; } // Sửa từ CCCD thành SoGiayTo

        [Required]
        public string HoTen { get; set; }

        public string DiaChi { get; set; }

        [Required]
        public string QuocTich { get; set; }

        [Required]
        [RegularExpression("^(Theo giờ|Theo ngày|Qua đêm)$", ErrorMessage = "Loại đặt phải là 'Theo giờ', 'Theo ngày' hoặc 'Qua đêm'.")]
        public string LoaiDat { get; set; }
    }

    public class ThemDichVuViewModel
    {
        [Required]
        public int MaHoaDon { get; set; }

        [Required]
        public int MaDichVu { get; set; } // Sửa từ string thành int

        [Required]
        [Range(1, 100)]
        public int SoLuong { get; set; }
    }

    public class ThanhToanViewModel
    {
        [Required]
        public int MaHoaDon { get; set; }

        public string GhiChu { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Tiền khuyến mãi không được âm.")]
        public decimal TienKhuyenMai { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Tiền trả trước không được âm.")]
        public decimal TienTraTruoc { get; set; }
    }

    public class TaoNhomViewModel
    {
        [Required]
        public string TenNhom { get; set; }

        [Required]
        public string NguoiDaiDien { get; set; }

        [RegularExpression(@"^\d{10,15}$", ErrorMessage = "Số điện thoại phải có từ 10 đến 15 chữ số.")]
        public string SoDienThoai { get; set; }

        [Required(ErrorMessage = "Danh sách phòng không được để trống.")]
        public List<int> DanhSachPhong { get; set; }
    }

    public class GopHoaDonViewModel
    {
        [Required]
        public int MaNhom { get; set; }

        [Required(ErrorMessage = "Danh sách phòng không được để trống.")]
        public List<int> DanhSachPhong { get; set; }
    }

    public class KetCaViewModel
    {
        [Required]
        public int NhanVienCaSau { get; set; }

        public string GhiChu { get; set; }
    }

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

    public class DongPhongViewModel
    {
        [Required]
        public int MaPhong { get; set; }

        [Required]
        public string LyDo { get; set; }
    }

    public class ChiTietHoaDonViewModel
    {
        public int MaHoaDon { get; set; }
        public string TenKhachHang { get; set; }
        public string SoPhong { get; set; }
        public DateTime? NgayNhanPhong { get; set; } // Sửa từ DateTime thành DateTime?
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
        public int MaDichVu { get; set; } // Sửa từ string thành int
        public string TenDichVu { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
        public decimal ChietKhau { get; set; }
        public decimal ThanhTien { get; set; }
    }
}