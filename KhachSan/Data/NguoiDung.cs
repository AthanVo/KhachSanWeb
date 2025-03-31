using System;
using System.Collections.Generic;

namespace KhachSan.Data;

public partial class NguoiDung
{
    public int MaNguoiDung { get; set; }

    public string TenDangNhap { get; set; } = null!;

    public string MatKhau { get; set; } = null!;

    public string? MaPin { get; set; }

    public string VaiTro { get; set; } = null!;

    public string HoTen { get; set; } = null!;

    public string? Email { get; set; }

    public string? SoDienThoai { get; set; }

    public string? DiaChi { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public string? TrangThai { get; set; }

    public virtual ICollection<CaLamViec> CaLamViecMaNhanVienCaTiepTheoNavigations { get; set; } = new List<CaLamViec>();

    public virtual ICollection<CaLamViec> CaLamViecMaNhanVienNavigations { get; set; } = new List<CaLamViec>();

    public virtual ICollection<DatPhong> DatPhongMaNguoiDungNavigations { get; set; } = new List<DatPhong>();

    public virtual ICollection<DatPhong> DatPhongMaNhanVienNavigations { get; set; } = new List<DatPhong>();

    public virtual ICollection<KhachHangLuuTru> KhachHangLuuTrus { get; set; } = new List<KhachHangLuuTru>();

    public virtual ICollection<LichSuThaoTac> LichSuThaoTacs { get; set; } = new List<LichSuThaoTac>();

    public virtual ICollection<NhomDatPhong> NhomDatPhongMaNguoiDaiDienNavigations { get; set; } = new List<NhomDatPhong>();

    public virtual ICollection<NhomDatPhong> NhomDatPhongMaNhanVienNavigations { get; set; } = new List<NhomDatPhong>();

    public virtual ICollection<ThongBao> ThongBaoMaNguoiGuiNavigations { get; set; } = new List<ThongBao>();

    public virtual ICollection<ThongBao> ThongBaoMaNguoiNhanNavigations { get; set; } = new List<ThongBao>();
}
