using System;
using System.Collections.Generic;

namespace KhachSan.Data;

public partial class LoaiPhong
{
    public int MaLoaiPhong { get; set; }
    public string TenLoaiPhong { get; set; } = null!;
    public decimal GiaTheoGio { get; set; }
    public decimal GiaTheoNgay { get; set; }
    public int SucChua { get; set; }
    public string? MoTa { get; set; }
    public string? TrangThai { get; set; }

    // Navigation property
    public virtual ICollection<Phong> Phong { get; set; } = new List<Phong>();
}