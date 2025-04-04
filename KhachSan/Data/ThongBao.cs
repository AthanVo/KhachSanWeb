using System;
using System.Collections.Generic;

namespace KhachSan.Data;

public partial class ThongBao
{
    public int MaThongBao { get; set; }
    public int? MaNguoiGui { get; set; }
    public int MaNguoiNhan { get; set; }
    public string TieuDe { get; set; } = null!;
    public string NoiDung { get; set; } = null!;
    public string LoaiThongBao { get; set; } = null!;
    public DateTime ThoiGianGui { get; set; }
    public string? TrangThai { get; set; }

    // Navigation properties
    public virtual NguoiDung? NguoiGui { get; set; }
    public virtual NguoiDung NguoiNhan { get; set; } = null!;
}