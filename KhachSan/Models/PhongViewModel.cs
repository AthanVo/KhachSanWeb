namespace KhachSan.Models
{
    public class ModelViewPhong
    {
        public int MaPhong { get; set; }          // Mã phòng
        public string SoPhong { get; set; }       // Số phòng (ví dụ: P101)
        public string LoaiPhong { get; set; }     // Loại phòng (ví dụ: Phòng đôi, VIP)
        public decimal GiaTheoGio { get; set; }   // Giá theo giờ
        public bool DangSuDung { get; set; }      // Trạng thái sử dụng
        public string TrangThai { get; set; }     // Trạng thái hiển thị (ví dụ: Đang sử dụng, Trống)
        public string KhachHang { get; set; }     // Tên khách hàng
        public string MaHoaDon { get; set; }      // Mã hóa đơn
        public string NhanVien { get; set; }      // Tên nhân viên
        public string NgayNhanPhong { get; set; } // Thời gian nhận phòng
        public string HienTrang { get; set; }     // Hiện trạng phòng (ví dụ: Đã dọn dẹp)

        public string MoTa { get; set; }
    }
}