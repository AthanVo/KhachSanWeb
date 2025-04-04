using System;
using System.Collections.Generic;

namespace KhachSan.Data;

public partial class NhomDatPhong
{
    public int MaNhomDatPhong { get; set; }
    public string? TenNhom { get; set; }
    public int? MaNguoiDaiDien { get; set; }
    public string? HoTenNguoiDaiDien { get; set; }
    public string? SoDienThoaiNguoiDaiDien { get; set; }
    public int MaNhanVien { get; set; }
    public DateTime NgayTao { get; set; }
    public string? TrangThai { get; set; }

    // Navigation properties
    public virtual NguoiDung? NguoiDaiDien { get; set; }
    public virtual NguoiDung NhanVien { get; set; } = null!;
    public virtual ICollection<DatPhong> DatPhong { get; set; } = new List<DatPhong>();
    public virtual ICollection<HoaDon> HoaDon { get; set; } = new List<HoaDon>();
}