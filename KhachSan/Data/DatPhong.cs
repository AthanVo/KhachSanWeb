using System;
using System.Collections.Generic;

namespace KhachSan.Data;

public partial class DatPhong
{
    public int MaDatPhong { get; set; }
    public int? MaNhomDatPhong { get; set; }
    public int? MaNguoiDung { get; set; }
    public int MaNhanVien { get; set; }
    public int MaPhong { get; set; }
    public int? MaKhachHangLuuTru { get; set; }
    public string? TrangThaiBaoCaoTamTru { get; set; }
    public DateTime NgayNhanPhong { get; set; }
    public DateTime? NgayTraPhong { get; set; }
    public int? TongThoiGian { get; set; }
    public decimal? TongTienTheoThoiGian { get; set; }
    public decimal? TongTienDichVu { get; set; }
    public string? TrangThai { get; set; }
    public int? MaGiamGia { get; set; }
    public decimal? SoTienGiam { get; set; }
    public string? TrangThaiThanhToan { get; set; }
    public DateTime NgayTao { get; set; }
    public DateTime NgayCapNhat { get; set; }
    public string LoaiDatPhong { get; set; }

    // Navigation properties
    public virtual NhomDatPhong? NhomDatPhong { get; set; }
    public virtual NguoiDung? NguoiDung { get; set; }
    public virtual NguoiDung NhanVien { get; set; } = null!;
    public virtual Phong Phong { get; set; } = null!;
    public virtual KhachHangLuuTru? KhachHangLuuTru { get; set; }
    public virtual GiamGia? GiamGia { get; set; }
    public virtual ICollection<ChiTietDichVu> ChiTietDichVu { get; set; } = new List<ChiTietDichVu>();
    public virtual ICollection<HoaDon> HoaDon { get; set; } = new List<HoaDon>();
}