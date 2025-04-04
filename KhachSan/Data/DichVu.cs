using System;
using System.Collections.Generic;

namespace KhachSan.Data;

public partial class DichVu
{
    public int MaDichVu { get; set; }
    public string TenDichVu { get; set; } = null!;
    public decimal Gia { get; set; }
    public string? TrangThai { get; set; }

    // Navigation property
    public virtual ICollection<ChiTietDichVu> ChiTietDichVu { get; set; } = new List<ChiTietDichVu>();
}