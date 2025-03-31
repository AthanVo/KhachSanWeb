using System;
using System.Collections.Generic;

namespace KhachSan.Data;

public partial class GiamGium
{
    public int MaGiamGiaId { get; set; }

    public string? TenMaGiamGia { get; set; }

    public string MaGiamGia { get; set; } = null!;

    public string? MoTa { get; set; }

    public decimal GiaTriGiam { get; set; }

    public DateOnly NgayBatDau { get; set; }

    public DateOnly NgayKetThuc { get; set; }

    public int? SoLuongMa { get; set; }

    public int? SoLuongDaDung { get; set; }

    public decimal? SoTienDatToiThieu { get; set; }

    public string? TrangThai { get; set; }

    public virtual ICollection<DatPhong> DatPhongs { get; set; } = new List<DatPhong>();
}
