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

    public DateTime? NgayTao { get; set; }

    public string? TrangThai { get; set; }

    public virtual ICollection<DatPhong> DatPhongs { get; set; } = new List<DatPhong>();

    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();

    public virtual NguoiDung? MaNguoiDaiDienNavigation { get; set; }

    public virtual NguoiDung MaNhanVienNavigation { get; set; } = null!;
}
