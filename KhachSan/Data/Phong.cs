using System;
using System.Collections.Generic;

namespace KhachSan.Data;

public partial class Phong
{
    public int MaPhong { get; set; }
    public string SoPhong { get; set; } = null!;
    public int MaLoaiPhong { get; set; }
    public bool DangSuDung { get; set; }
    public string? MoTa { get; set; }
    public DateTime? ThoiGianTraPhongCuoi { get; set; }

    // Navigation properties
    public virtual LoaiPhong LoaiPhong { get; set; } = null!;
    public virtual ICollection<DatPhong> DatPhong { get; set; } = new List<DatPhong>();
}