using System;
using System.Collections.Generic;

namespace KhachSan.Data;

public partial class LichSuThaoTac
{
    public int MaThaoTac { get; set; }
    public int MaCaLamViec { get; set; }
    public int MaNhanVien { get; set; }
    public string LoaiThaoTac { get; set; } = null!;
    public string? ChiTiet { get; set; }
    public DateTime ThoiGian { get; set; }

    // Navigation properties
    public virtual CaLamViec CaLamViec { get; set; } = null!;
    public virtual NguoiDung NhanVien { get; set; } = null!;
}