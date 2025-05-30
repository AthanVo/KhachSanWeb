﻿using System;
using System.Collections.Generic;

namespace KhachSan.Data;

public partial class ChiTietDichVu
{
    public int MaChiTietDichVu { get; set; }
    public int MaDatPhong { get; set; }
    public int MaDichVu { get; set; }
    public int SoLuong { get; set; }
    public decimal DonGia { get; set; }
    public decimal ThanhTien { get; set; }
    public DateTime NgayTao { get; set; }

    // Navigation properties
    public virtual DatPhong DatPhong { get; set; } = null!;
    public virtual DichVu DichVu { get; set; } = null!;
}