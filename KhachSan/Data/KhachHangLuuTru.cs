using System;
using System.Collections.Generic;

namespace KhachSan.Data;

public partial class KhachHangLuuTru
{
    public int MaKhachHangLuuTru { get; set; }

    public string? LoaiGiayTo { get; set; }

    public string? SoGiayTo { get; set; }

    public string HoTen { get; set; } = null!;

    public DateOnly? NgaySinh { get; set; }

    public string? GioiTinh { get; set; }

    public string? DiaChi { get; set; }

    public string? QuocTich { get; set; }

    public DateOnly? NgayCapGiayTo { get; set; }

    public string? NoiCapGiayTo { get; set; }

    public int? MaNguoiDung { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<DatPhong> DatPhongs { get; set; } = new List<DatPhong>();

    public virtual NguoiDung? MaNguoiDungNavigation { get; set; }
}
