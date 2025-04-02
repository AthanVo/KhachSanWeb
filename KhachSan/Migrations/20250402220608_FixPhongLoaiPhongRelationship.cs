using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KhachSan.Migrations
{
    /// <inheritdoc />
    public partial class FixPhongLoaiPhongRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DichVu",
                columns: table => new
                {
                    MaDichVu = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenDichVu = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Gia = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    TrangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Hoạt động")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__DichVu__C0E6DE8FA534368E", x => x.MaDichVu);
                });

            migrationBuilder.CreateTable(
                name: "GiamGia",
                columns: table => new
                {
                    MaGiamGiaId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenMaGiamGia = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    MaGiamGia = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    GiaTriGiam = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    NgayBatDau = table.Column<DateOnly>(type: "date", nullable: false),
                    NgayKetThuc = table.Column<DateOnly>(type: "date", nullable: false),
                    SoLuongMa = table.Column<int>(type: "int", nullable: true),
                    SoLuongDaDung = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    SoTienDatToiThieu = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    TrangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Hoạt động")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__GiamGia__C28471F37E29E6EE", x => x.MaGiamGiaId);
                });

            migrationBuilder.CreateTable(
                name: "LoaiPhong",
                columns: table => new
                {
                    MaLoaiPhong = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenLoaiPhong = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    GiaTheoGio = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    GiaTheoNgay = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    SucChua = table.Column<int>(type: "int", nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TrangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Hoạt động")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__LoaiPhon__230212172062E897", x => x.MaLoaiPhong);
                });

            migrationBuilder.CreateTable(
                name: "NguoiDung",
                columns: table => new
                {
                    MaNguoiDung = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenDangNhap = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MatKhau = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    MaPIN = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    VaiTro = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    HoTen = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    SoDienThoai = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    TrangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Hoạt động")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NguoiDun__C539D7625B6808D1", x => x.MaNguoiDung);
                });

            migrationBuilder.CreateTable(
                name: "Phong",
                columns: table => new
                {
                    MaPhong = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SoPhong = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    MaLoaiPhong = table.Column<int>(type: "int", nullable: false),
                    DangSuDung = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    MoTa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThoiGianTraPhongCuoi = table.Column<DateTime>(type: "datetime", nullable: true),
                    LoaiPhongMaLoaiPhong = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Phong__20BD5E5BEB5F3F4F", x => x.MaPhong);
                    table.ForeignKey(
                        name: "FK_Phong_LoaiPhong_LoaiPhongMaLoaiPhong",
                        column: x => x.LoaiPhongMaLoaiPhong,
                        principalTable: "LoaiPhong",
                        principalColumn: "MaLoaiPhong");
                    table.ForeignKey(
                        name: "FK__Phong__MaLoaiPho__45F365D3",
                        column: x => x.MaLoaiPhong,
                        principalTable: "LoaiPhong",
                        principalColumn: "MaLoaiPhong");
                });

            migrationBuilder.CreateTable(
                name: "CaLamViec",
                columns: table => new
                {
                    MaCaLamViec = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaNhanVien = table.Column<int>(type: "int", nullable: false),
                    ThoiGianBatDau = table.Column<DateTime>(type: "datetime", nullable: false),
                    ThoiGianKetThuc = table.Column<DateTime>(type: "datetime", nullable: true),
                    TrangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Đang làm việc"),
                    TongTienTrongCa = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    TongTienChuyenGiao = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    MaNhanVienCaTiepTheo = table.Column<int>(type: "int", nullable: true),
                    GhiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__CaLamVie__E545F62591AA82E2", x => x.MaCaLamViec);
                    table.ForeignKey(
                        name: "FK__CaLamViec__MaNha__628FA481",
                        column: x => x.MaNhanVien,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung");
                    table.ForeignKey(
                        name: "FK__CaLamViec__MaNha__6383C8BA",
                        column: x => x.MaNhanVienCaTiepTheo,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung");
                });

            migrationBuilder.CreateTable(
                name: "KhachHangLuuTru",
                columns: table => new
                {
                    MaKhachHangLuuTru = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LoaiGiayTo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    SoGiayTo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    HoTen = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NgaySinh = table.Column<DateOnly>(type: "date", nullable: true),
                    GioiTinh = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    QuocTich = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    NgayCapGiayTo = table.Column<DateOnly>(type: "date", nullable: true),
                    NoiCapGiayTo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    MaNguoiDung = table.Column<int>(type: "int", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__KhachHan__7FE4FD2A61CC29E5", x => x.MaKhachHangLuuTru);
                    table.ForeignKey(
                        name: "FK__KhachHang__MaNgu__5441852A",
                        column: x => x.MaNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung");
                });

            migrationBuilder.CreateTable(
                name: "NhomDatPhong",
                columns: table => new
                {
                    MaNhomDatPhong = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenNhom = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    MaNguoiDaiDien = table.Column<int>(type: "int", nullable: true),
                    HoTenNguoiDaiDien = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    SoDienThoaiNguoiDaiDien = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    MaNhanVien = table.Column<int>(type: "int", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    TrangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Đang xử lý")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NhomDatP__F91B37A1EAF9428A", x => x.MaNhomDatPhong);
                    table.ForeignKey(
                        name: "FK__NhomDatPh__MaNgu__4BAC3F29",
                        column: x => x.MaNguoiDaiDien,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung");
                    table.ForeignKey(
                        name: "FK__NhomDatPh__MaNha__4CA06362",
                        column: x => x.MaNhanVien,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung");
                });

            migrationBuilder.CreateTable(
                name: "ThongBao",
                columns: table => new
                {
                    MaThongBao = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaNguoiGui = table.Column<int>(type: "int", nullable: true),
                    MaNguoiNhan = table.Column<int>(type: "int", nullable: false),
                    TieuDe = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NoiDung = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LoaiThongBao = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ThoiGianGui = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    TrangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Chưa đọc")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ThongBao__04DEB54E13533773", x => x.MaThongBao);
                    table.ForeignKey(
                        name: "FK__ThongBao__MaNguo__0D7A0286",
                        column: x => x.MaNguoiGui,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung");
                    table.ForeignKey(
                        name: "FK__ThongBao__MaNguo__0E6E26BF",
                        column: x => x.MaNguoiNhan,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung");
                });

            migrationBuilder.CreateTable(
                name: "LichSuThaoTac",
                columns: table => new
                {
                    MaThaoTac = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaCaLamViec = table.Column<int>(type: "int", nullable: false),
                    MaNhanVien = table.Column<int>(type: "int", nullable: false),
                    LoaiThaoTac = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ChiTiet = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThoiGian = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__LichSuTh__32ACE29307E9F52E", x => x.MaThaoTac);
                    table.ForeignKey(
                        name: "FK__LichSuTha__MaCaL__05D8E0BE",
                        column: x => x.MaCaLamViec,
                        principalTable: "CaLamViec",
                        principalColumn: "MaCaLamViec");
                    table.ForeignKey(
                        name: "FK__LichSuTha__MaNha__06CD04F7",
                        column: x => x.MaNhanVien,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung");
                });

            migrationBuilder.CreateTable(
                name: "DatPhong",
                columns: table => new
                {
                    MaDatPhong = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaNhomDatPhong = table.Column<int>(type: "int", nullable: true),
                    MaNguoiDung = table.Column<int>(type: "int", nullable: true),
                    MaNhanVien = table.Column<int>(type: "int", nullable: false),
                    MaPhong = table.Column<int>(type: "int", nullable: false),
                    MaKhachHangLuuTru = table.Column<int>(type: "int", nullable: true),
                    TrangThaiBaoCaoTamTru = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Chưa báo cáo"),
                    NgayNhanPhong = table.Column<DateTime>(type: "datetime", nullable: false),
                    NgayTraPhong = table.Column<DateTime>(type: "datetime", nullable: true),
                    TongThoiGian = table.Column<int>(type: "int", nullable: true),
                    TongTienTheoThoiGian = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    TongTienDichVu = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    TrangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Chờ xác nhận"),
                    MaGiamGia = table.Column<int>(type: "int", nullable: true),
                    SoTienGiam = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    TrangThaiThanhToan = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Chưa thanh toán"),
                    NgayTao = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__DatPhong__6344ADEAC3325991", x => x.MaDatPhong);
                    table.ForeignKey(
                        name: "FK__DatPhong__MaGiam__72C60C4A",
                        column: x => x.MaGiamGia,
                        principalTable: "GiamGia",
                        principalColumn: "MaGiamGiaId");
                    table.ForeignKey(
                        name: "FK__DatPhong__MaKhac__71D1E811",
                        column: x => x.MaKhachHangLuuTru,
                        principalTable: "KhachHangLuuTru",
                        principalColumn: "MaKhachHangLuuTru");
                    table.ForeignKey(
                        name: "FK__DatPhong__MaNguo__6EF57B66",
                        column: x => x.MaNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung");
                    table.ForeignKey(
                        name: "FK__DatPhong__MaNhan__6FE99F9F",
                        column: x => x.MaNhanVien,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung");
                    table.ForeignKey(
                        name: "FK__DatPhong__MaNhom__6E01572D",
                        column: x => x.MaNhomDatPhong,
                        principalTable: "NhomDatPhong",
                        principalColumn: "MaNhomDatPhong");
                    table.ForeignKey(
                        name: "FK__DatPhong__MaPhon__70DDC3D8",
                        column: x => x.MaPhong,
                        principalTable: "Phong",
                        principalColumn: "MaPhong");
                });

            migrationBuilder.CreateTable(
                name: "ChiTietDichVu",
                columns: table => new
                {
                    MaChiTietDichVu = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaDatPhong = table.Column<int>(type: "int", nullable: false),
                    MaDichVu = table.Column<int>(type: "int", nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: false),
                    DonGia = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    ThanhTien = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ChiTietD__11EFCA675B5F763E", x => x.MaChiTietDichVu);
                    table.ForeignKey(
                        name: "FK__ChiTietDi__MaDat__76969D2E",
                        column: x => x.MaDatPhong,
                        principalTable: "DatPhong",
                        principalColumn: "MaDatPhong");
                    table.ForeignKey(
                        name: "FK__ChiTietDi__MaDic__778AC167",
                        column: x => x.MaDichVu,
                        principalTable: "DichVu",
                        principalColumn: "MaDichVu");
                });

            migrationBuilder.CreateTable(
                name: "HoaDon",
                columns: table => new
                {
                    MaHoaDon = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaCaLamViec = table.Column<int>(type: "int", nullable: true),
                    MaNhomDatPhong = table.Column<int>(type: "int", nullable: true),
                    MaDatPhong = table.Column<int>(type: "int", nullable: true),
                    NgayXuat = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    TongTien = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    PhuongThucThanhToan = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TrangThaiThanhToan = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Chưa thanh toán"),
                    GhiChu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LoaiHoaDon = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__HoaDon__835ED13B9D48AA98", x => x.MaHoaDon);
                    table.ForeignKey(
                        name: "FK__HoaDon__MaCaLamV__7F2BE32F",
                        column: x => x.MaCaLamViec,
                        principalTable: "CaLamViec",
                        principalColumn: "MaCaLamViec");
                    table.ForeignKey(
                        name: "FK__HoaDon__MaDatPho__01142BA1",
                        column: x => x.MaDatPhong,
                        principalTable: "DatPhong",
                        principalColumn: "MaDatPhong");
                    table.ForeignKey(
                        name: "FK__HoaDon__MaNhomDa__00200768",
                        column: x => x.MaNhomDatPhong,
                        principalTable: "NhomDatPhong",
                        principalColumn: "MaNhomDatPhong");
                });

            migrationBuilder.CreateIndex(
                name: "IX_CaLamViec_MaNhanVien",
                table: "CaLamViec",
                column: "MaNhanVien");

            migrationBuilder.CreateIndex(
                name: "IX_CaLamViec_MaNhanVienCaTiepTheo",
                table: "CaLamViec",
                column: "MaNhanVienCaTiepTheo");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietDichVu_MaDatPhong",
                table: "ChiTietDichVu",
                column: "MaDatPhong");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietDichVu_MaDichVu",
                table: "ChiTietDichVu",
                column: "MaDichVu");

            migrationBuilder.CreateIndex(
                name: "IX_DatPhong_MaGiamGia",
                table: "DatPhong",
                column: "MaGiamGia");

            migrationBuilder.CreateIndex(
                name: "IX_DatPhong_MaKhachHangLuuTru",
                table: "DatPhong",
                column: "MaKhachHangLuuTru");

            migrationBuilder.CreateIndex(
                name: "IX_DatPhong_MaNguoiDung",
                table: "DatPhong",
                column: "MaNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_DatPhong_MaNhanVien",
                table: "DatPhong",
                column: "MaNhanVien");

            migrationBuilder.CreateIndex(
                name: "IX_DatPhong_MaNhomDatPhong",
                table: "DatPhong",
                column: "MaNhomDatPhong");

            migrationBuilder.CreateIndex(
                name: "IX_DatPhong_MaPhong",
                table: "DatPhong",
                column: "MaPhong");

            migrationBuilder.CreateIndex(
                name: "UQ__GiamGia__EF9458E539872A42",
                table: "GiamGia",
                column: "MaGiamGia",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HoaDon_MaCaLamViec",
                table: "HoaDon",
                column: "MaCaLamViec");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDon_MaDatPhong",
                table: "HoaDon",
                column: "MaDatPhong");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDon_MaNhomDatPhong",
                table: "HoaDon",
                column: "MaNhomDatPhong");

            migrationBuilder.CreateIndex(
                name: "IX_KhachHangLuuTru_MaNguoiDung",
                table: "KhachHangLuuTru",
                column: "MaNguoiDung");

            migrationBuilder.CreateIndex(
                name: "UQ__KhachHan__04338D259D39AD6F",
                table: "KhachHangLuuTru",
                column: "SoGiayTo",
                unique: true,
                filter: "[SoGiayTo] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_LichSuThaoTac_MaCaLamViec",
                table: "LichSuThaoTac",
                column: "MaCaLamViec");

            migrationBuilder.CreateIndex(
                name: "IX_LichSuThaoTac_MaNhanVien",
                table: "LichSuThaoTac",
                column: "MaNhanVien");

            migrationBuilder.CreateIndex(
                name: "UQ__NguoiDun__55F68FC03B6F6DD7",
                table: "NguoiDung",
                column: "TenDangNhap",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NhomDatPhong_MaNguoiDaiDien",
                table: "NhomDatPhong",
                column: "MaNguoiDaiDien");

            migrationBuilder.CreateIndex(
                name: "IX_NhomDatPhong_MaNhanVien",
                table: "NhomDatPhong",
                column: "MaNhanVien");

            migrationBuilder.CreateIndex(
                name: "IX_Phong_LoaiPhongMaLoaiPhong",
                table: "Phong",
                column: "LoaiPhongMaLoaiPhong");

            migrationBuilder.CreateIndex(
                name: "IX_Phong_MaLoaiPhong",
                table: "Phong",
                column: "MaLoaiPhong");

            migrationBuilder.CreateIndex(
                name: "UQ__Phong__7C736CA1FB3838F8",
                table: "Phong",
                column: "SoPhong",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ThongBao_MaNguoiGui",
                table: "ThongBao",
                column: "MaNguoiGui");

            migrationBuilder.CreateIndex(
                name: "IX_ThongBao_MaNguoiNhan",
                table: "ThongBao",
                column: "MaNguoiNhan");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiTietDichVu");

            migrationBuilder.DropTable(
                name: "HoaDon");

            migrationBuilder.DropTable(
                name: "LichSuThaoTac");

            migrationBuilder.DropTable(
                name: "ThongBao");

            migrationBuilder.DropTable(
                name: "DichVu");

            migrationBuilder.DropTable(
                name: "DatPhong");

            migrationBuilder.DropTable(
                name: "CaLamViec");

            migrationBuilder.DropTable(
                name: "GiamGia");

            migrationBuilder.DropTable(
                name: "KhachHangLuuTru");

            migrationBuilder.DropTable(
                name: "NhomDatPhong");

            migrationBuilder.DropTable(
                name: "Phong");

            migrationBuilder.DropTable(
                name: "NguoiDung");

            migrationBuilder.DropTable(
                name: "LoaiPhong");
        }
    }
}
