using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace KhachSan.Data;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CaLamViec> CaLamViecs { get; set; }

    public virtual DbSet<ChiTietDichVu> ChiTietDichVus { get; set; }

    public virtual DbSet<DatPhong> DatPhongs { get; set; }

    public virtual DbSet<DichVu> DichVus { get; set; }

    public virtual DbSet<GiamGium> GiamGia { get; set; }

    public virtual DbSet<HoaDon> HoaDons { get; set; }

    public virtual DbSet<KhachHangLuuTru> KhachHangLuuTrus { get; set; }

    public virtual DbSet<LichSuThaoTac> LichSuThaoTacs { get; set; }

    public virtual DbSet<LoaiPhong> LoaiPhongs { get; set; }

    public virtual DbSet<NguoiDung> NguoiDungs { get; set; }

    public virtual DbSet<NhomDatPhong> NhomDatPhongs { get; set; }

    public virtual DbSet<Phong> Phongs { get; set; }

    public virtual DbSet<ThongBao> ThongBaos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=localhost\\MSSQLSERVER01;Database=QuanLyKhachSan;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CaLamViec>(entity =>
        {
            entity.HasKey(e => e.MaCaLamViec).HasName("PK__CaLamVie__E545F62591AA82E2");

            entity.ToTable("CaLamViec");

            entity.Property(e => e.ThoiGianBatDau).HasColumnType("datetime");
            entity.Property(e => e.ThoiGianKetThuc).HasColumnType("datetime");
            entity.Property(e => e.TongTienChuyenGiao).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.TongTienTrongCa).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("Đang làm việc");

            entity.HasOne(d => d.MaNhanVienNavigation).WithMany(p => p.CaLamViecMaNhanVienNavigations)
                .HasForeignKey(d => d.MaNhanVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CaLamViec__MaNha__628FA481");

            entity.HasOne(d => d.MaNhanVienCaTiepTheoNavigation).WithMany(p => p.CaLamViecMaNhanVienCaTiepTheoNavigations)
                .HasForeignKey(d => d.MaNhanVienCaTiepTheo)
                .HasConstraintName("FK__CaLamViec__MaNha__6383C8BA");
        });

        modelBuilder.Entity<ChiTietDichVu>(entity =>
        {
            entity.HasKey(e => e.MaChiTietDichVu).HasName("PK__ChiTietD__11EFCA675B5F763E");

            entity.ToTable("ChiTietDichVu", tb => tb.HasTrigger("TR_CapNhat_TongTienDichVu"));

            entity.Property(e => e.DonGia).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ThanhTien).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.MaDatPhongNavigation).WithMany(p => p.ChiTietDichVus)
                .HasForeignKey(d => d.MaDatPhong)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ChiTietDi__MaDat__76969D2E");

            entity.HasOne(d => d.MaDichVuNavigation).WithMany(p => p.ChiTietDichVus)
                .HasForeignKey(d => d.MaDichVu)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ChiTietDi__MaDic__778AC167");
        });

        modelBuilder.Entity<DatPhong>(entity =>
        {
            entity.HasKey(e => e.MaDatPhong).HasName("PK__DatPhong__6344ADEAC3325991");

            entity.ToTable("DatPhong", tb =>
                {
                    tb.HasTrigger("UpdateNgayCapNhat_DatPhong");
                    tb.HasTrigger("UpdatePhong_DangSuDung");
                });

            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayNhanPhong).HasColumnType("datetime");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayTraPhong).HasColumnType("datetime");
            entity.Property(e => e.SoTienGiam).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.TongTienDichVu).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.TongTienTheoThoiGian).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("Chờ xác nhận");
            entity.Property(e => e.TrangThaiBaoCaoTamTru)
                .HasMaxLength(20)
                .HasDefaultValue("Chưa báo cáo");
            entity.Property(e => e.TrangThaiThanhToan)
                .HasMaxLength(20)
                .HasDefaultValue("Chưa thanh toán");

            entity.HasOne(d => d.MaGiamGiaNavigation).WithMany(p => p.DatPhongs)
                .HasForeignKey(d => d.MaGiamGia)
                .HasConstraintName("FK__DatPhong__MaGiam__72C60C4A");

            entity.HasOne(d => d.MaKhachHangLuuTruNavigation).WithMany(p => p.DatPhongs)
                .HasForeignKey(d => d.MaKhachHangLuuTru)
                .HasConstraintName("FK__DatPhong__MaKhac__71D1E811");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.DatPhongMaNguoiDungNavigations)
                .HasForeignKey(d => d.MaNguoiDung)
                .HasConstraintName("FK__DatPhong__MaNguo__6EF57B66");

            entity.HasOne(d => d.MaNhanVienNavigation).WithMany(p => p.DatPhongMaNhanVienNavigations)
                .HasForeignKey(d => d.MaNhanVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DatPhong__MaNhan__6FE99F9F");

            entity.HasOne(d => d.MaNhomDatPhongNavigation).WithMany(p => p.DatPhongs)
                .HasForeignKey(d => d.MaNhomDatPhong)
                .HasConstraintName("FK__DatPhong__MaNhom__6E01572D");

            entity.HasOne(d => d.MaPhongNavigation).WithMany(p => p.DatPhongs)
                .HasForeignKey(d => d.MaPhong)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DatPhong__MaPhon__70DDC3D8");
        });

        modelBuilder.Entity<DichVu>(entity =>
        {
            entity.HasKey(e => e.MaDichVu).HasName("PK__DichVu__C0E6DE8FA534368E");

            entity.ToTable("DichVu");

            entity.Property(e => e.Gia).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.TenDichVu).HasMaxLength(100);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("Hoạt động");
        });

        modelBuilder.Entity<GiamGium>(entity =>
        {
            entity.HasKey(e => e.MaGiamGiaId).HasName("PK__GiamGia__C28471F37E29E6EE");

            entity.HasIndex(e => e.MaGiamGia, "UQ__GiamGia__EF9458E539872A42").IsUnique();

            entity.Property(e => e.GiaTriGiam).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.MaGiamGia).HasMaxLength(50);
            entity.Property(e => e.MoTa).HasMaxLength(50);
            entity.Property(e => e.SoLuongDaDung).HasDefaultValue(0);
            entity.Property(e => e.SoTienDatToiThieu).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.TenMaGiamGia).HasMaxLength(50);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("Hoạt động");
        });

        modelBuilder.Entity<HoaDon>(entity =>
        {
            entity.HasKey(e => e.MaHoaDon).HasName("PK__HoaDon__835ED13B9D48AA98");

            entity.ToTable("HoaDon");

            entity.Property(e => e.LoaiHoaDon).HasMaxLength(20);
            entity.Property(e => e.NgayXuat)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PhuongThucThanhToan).HasMaxLength(20);
            entity.Property(e => e.TongTien).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.TrangThaiThanhToan)
                .HasMaxLength(20)
                .HasDefaultValue("Chưa thanh toán");

            entity.HasOne(d => d.MaCaLamViecNavigation).WithMany(p => p.HoaDons)
                .HasForeignKey(d => d.MaCaLamViec)
                .HasConstraintName("FK__HoaDon__MaCaLamV__7F2BE32F");

            entity.HasOne(d => d.MaDatPhongNavigation).WithMany(p => p.HoaDons)
                .HasForeignKey(d => d.MaDatPhong)
                .HasConstraintName("FK__HoaDon__MaDatPho__01142BA1");

            entity.HasOne(d => d.MaNhomDatPhongNavigation).WithMany(p => p.HoaDons)
                .HasForeignKey(d => d.MaNhomDatPhong)
                .HasConstraintName("FK__HoaDon__MaNhomDa__00200768");
        });

        modelBuilder.Entity<KhachHangLuuTru>(entity =>
        {
            entity.HasKey(e => e.MaKhachHangLuuTru).HasName("PK__KhachHan__7FE4FD2A61CC29E5");

            entity.ToTable("KhachHangLuuTru", tb => tb.HasTrigger("UpdateNgayCapNhat_KhachHangLuuTru"));

            entity.HasIndex(e => e.SoGiayTo, "UQ__KhachHan__04338D259D39AD6F").IsUnique();

            entity.Property(e => e.GioiTinh).HasMaxLength(10);
            entity.Property(e => e.HoTen).HasMaxLength(100);
            entity.Property(e => e.LoaiGiayTo).HasMaxLength(20);
            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NoiCapGiayTo).HasMaxLength(100);
            entity.Property(e => e.QuocTich).HasMaxLength(50);
            entity.Property(e => e.SoGiayTo).HasMaxLength(20);

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.KhachHangLuuTrus)
                .HasForeignKey(d => d.MaNguoiDung)
                .HasConstraintName("FK__KhachHang__MaNgu__5441852A");
        });

        modelBuilder.Entity<LichSuThaoTac>(entity =>
        {
            entity.HasKey(e => e.MaThaoTac).HasName("PK__LichSuTh__32ACE29307E9F52E");

            entity.ToTable("LichSuThaoTac");

            entity.Property(e => e.LoaiThaoTac).HasMaxLength(20);
            entity.Property(e => e.ThoiGian)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.MaCaLamViecNavigation).WithMany(p => p.LichSuThaoTacs)
                .HasForeignKey(d => d.MaCaLamViec)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LichSuTha__MaCaL__05D8E0BE");

            entity.HasOne(d => d.MaNhanVienNavigation).WithMany(p => p.LichSuThaoTacs)
                .HasForeignKey(d => d.MaNhanVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LichSuTha__MaNha__06CD04F7");
        });

        modelBuilder.Entity<LoaiPhong>(entity =>
        {
            entity.HasKey(e => e.MaLoaiPhong).HasName("PK__LoaiPhon__230212172062E897");

            entity.ToTable("LoaiPhong");

            entity.Property(e => e.GiaTheoGio).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.GiaTheoNgay).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.TenLoaiPhong).HasMaxLength(20);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("Hoạt động");
        });

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.HasKey(e => e.MaNguoiDung).HasName("PK__NguoiDun__C539D7625B6808D1");

            entity.ToTable("NguoiDung", tb => tb.HasTrigger("UpdateNgayCapNhat_NguoiDung"));

            entity.HasIndex(e => e.TenDangNhap, "UQ__NguoiDun__55F68FC03B6F6DD7").IsUnique();

            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.HoTen).HasMaxLength(100);
            entity.Property(e => e.MaPin)
                .HasMaxLength(10)
                .HasColumnName("MaPIN");
            entity.Property(e => e.MatKhau).HasMaxLength(255);
            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SoDienThoai).HasMaxLength(15);
            entity.Property(e => e.TenDangNhap).HasMaxLength(50);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("Hoạt động");
            entity.Property(e => e.VaiTro).HasMaxLength(20);
        });

        modelBuilder.Entity<NhomDatPhong>(entity =>
        {
            entity.HasKey(e => e.MaNhomDatPhong).HasName("PK__NhomDatP__F91B37A1EAF9428A");

            entity.ToTable("NhomDatPhong");

            entity.Property(e => e.HoTenNguoiDaiDien).HasMaxLength(100);
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SoDienThoaiNguoiDaiDien).HasMaxLength(15);
            entity.Property(e => e.TenNhom).HasMaxLength(100);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("Đang xử lý");

            entity.HasOne(d => d.MaNguoiDaiDienNavigation).WithMany(p => p.NhomDatPhongMaNguoiDaiDienNavigations)
                .HasForeignKey(d => d.MaNguoiDaiDien)
                .HasConstraintName("FK__NhomDatPh__MaNgu__4BAC3F29");

            entity.HasOne(d => d.MaNhanVienNavigation).WithMany(p => p.NhomDatPhongMaNhanVienNavigations)
                .HasForeignKey(d => d.MaNhanVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NhomDatPh__MaNha__4CA06362");
        });

        modelBuilder.Entity<Phong>(entity =>
        {
            entity.HasKey(e => e.MaPhong).HasName("PK__Phong__20BD5E5BEB5F3F4F");

            entity.ToTable("Phong");

            entity.HasIndex(e => e.SoPhong, "UQ__Phong__7C736CA1FB3838F8").IsUnique();

            entity.Property(e => e.DangSuDung).HasDefaultValue(false);
            entity.Property(e => e.SoPhong).HasMaxLength(10);
            entity.Property(e => e.ThoiGianTraPhongCuoi).HasColumnType("datetime");

            entity.HasOne(d => d.MaLoaiPhongNavigation).WithMany(p => p.Phongs)
                .HasForeignKey(d => d.MaLoaiPhong)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Phong__MaLoaiPho__45F365D3");
        });

        modelBuilder.Entity<ThongBao>(entity =>
        {
            entity.HasKey(e => e.MaThongBao).HasName("PK__ThongBao__04DEB54E13533773");

            entity.ToTable("ThongBao");

            entity.Property(e => e.LoaiThongBao).HasMaxLength(20);
            entity.Property(e => e.ThoiGianGui)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TieuDe).HasMaxLength(100);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("Chưa đọc");

            entity.HasOne(d => d.MaNguoiGuiNavigation).WithMany(p => p.ThongBaoMaNguoiGuiNavigations)
                .HasForeignKey(d => d.MaNguoiGui)
                .HasConstraintName("FK__ThongBao__MaNguo__0D7A0286");

            entity.HasOne(d => d.MaNguoiNhanNavigation).WithMany(p => p.ThongBaoMaNguoiNhanNavigations)
                .HasForeignKey(d => d.MaNguoiNhan)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ThongBao__MaNguo__0E6E26BF");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
