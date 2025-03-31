using System;
using System.Collections.Generic;

namespace KhachSan.Data;

public partial class CaLamViec
{
    public int MaCaLamViec { get; set; }

    public int MaNhanVien { get; set; }

    public DateTime ThoiGianBatDau { get; set; }

    public DateTime? ThoiGianKetThuc { get; set; }

    public string? TrangThai { get; set; }

    public decimal? TongTienTrongCa { get; set; }

    public decimal? TongTienChuyenGiao { get; set; }

    public int? MaNhanVienCaTiepTheo { get; set; }

    public string? GhiChu { get; set; }

    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();

    public virtual ICollection<LichSuThaoTac> LichSuThaoTacs { get; set; } = new List<LichSuThaoTac>();

    public virtual NguoiDung? MaNhanVienCaTiepTheoNavigation { get; set; }

    public virtual NguoiDung MaNhanVienNavigation { get; set; } = null!;
}
