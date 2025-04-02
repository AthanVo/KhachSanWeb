using System;
using System.Collections.Generic;

namespace KhachSan.Data;

public partial class LoaiPhong
{
    public int MaLoaiPhong { get; set; }

    public string TenLoaiPhong { get; set; } 

    public decimal GiaTheoGio { get; set; }

    public decimal GiaTheoNgay { get; set; }

    public int SucChua { get; set; }

    public string? MoTa { get; set; }

    public string? TrangThai { get; set; }

    public virtual ICollection<Phong> Phongs { get; set; } = new List<Phong>();
}
