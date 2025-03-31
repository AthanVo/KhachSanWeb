using System;
using System.Collections.Generic;

namespace KhachSan.Data;

public partial class HoaDon
{
    public int MaHoaDon { get; set; }

    public int? MaCaLamViec { get; set; }

    public int? MaNhomDatPhong { get; set; }

    public int? MaDatPhong { get; set; }

    public DateTime? NgayXuat { get; set; }

    public decimal TongTien { get; set; }

    public string PhuongThucThanhToan { get; set; } = null!;

    public string? TrangThaiThanhToan { get; set; }

    public string? GhiChu { get; set; }

    public string LoaiHoaDon { get; set; } = null!;

    public virtual CaLamViec? MaCaLamViecNavigation { get; set; }

    public virtual DatPhong? MaDatPhongNavigation { get; set; }

    public virtual NhomDatPhong? MaNhomDatPhongNavigation { get; set; }
}
