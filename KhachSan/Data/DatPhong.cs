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

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<ChiTietDichVu> ChiTietDichVus { get; set; } = new List<ChiTietDichVu>();

    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();

    public virtual GiamGium? MaGiamGiaNavigation { get; set; }

    public virtual KhachHangLuuTru? MaKhachHangLuuTruNavigation { get; set; }

    public virtual NguoiDung? MaNguoiDungNavigation { get; set; }

    public virtual NguoiDung MaNhanVienNavigation { get; set; } = null!;

    public virtual NhomDatPhong? MaNhomDatPhongNavigation { get; set; }

    public virtual Phong MaPhongNavigation { get; set; } = null!;
}
