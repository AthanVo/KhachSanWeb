// Biến lưu thông tin ca hiện tại
let currentShift = null;
let userRole = "Nhân viên"; // Mặc định

// Hàm định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Hàm lấy thông tin người dùng hiện tại
function fetchCurrentUser() {
    fetch('http://localhost:5284/api/KhachSanAPI/current-user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                userRole = data.user.vaiTro; // Cập nhật vai trò
            } else {
                console.error('Lỗi khi lấy thông tin người dùng:', data.message);
            }
        })
        .catch(error => {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
        });
}

// Hàm tải thông tin ca hiện tại
function fetchCurrentShift() {
    console.log('Đang gọi API để lấy ca hiện tại...');
    return fetch('http://localhost:5284/api/KhachSanAPI/current-shift', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(response => {
            console.log('Phản hồi từ server:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Dữ liệu nhận được:', data);
            if (data.success) {
                currentShift = data;
                document.getElementById('shift-id').textContent = data.shift.maCa || 'N/A';
                const thoiGianBatDau = data.shift.thoiGianBatDau
                    ? new Date(data.shift.thoiGianBatDau.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5:$6'))
                    : null;
                document.getElementById('shift-start').textContent = thoiGianBatDau
                    ? thoiGianBatDau.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
                    : 'N/A';
                document.getElementById('shift-end').textContent = new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
                document.getElementById('shift-total').textContent = formatCurrency(data.shift.tongTienTrongCa || 0);
                document.getElementById('shift-transfer').textContent = formatCurrency(data.shift.tongTienChuyenGiao || 0);
            } else {
                console.error('Lỗi từ API:', data.message);
                alert(data.message || 'Không thể lấy thông tin ca hiện tại');
            }
        })
        .catch(error => {
            console.error('Lỗi chi tiết khi tải thông tin ca hiện tại:', error);
            alert('Không thể kết nối đến server. Vui lòng kiểm tra mạng hoặc thử lại sau.');
        });
}

// Hàm tải danh sách nhân viên cho ca tiếp theo
function loadStaffList() {
    fetch('http://localhost:5284/api/KhachSanAPI/staff/available', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            const staffSelect = document.getElementById('next-staff');
            staffSelect.innerHTML = '<option value="">-- Không chọn --</option>';

            if (data.success && Array.isArray(data.nhanViens)) {
                data.nhanViens.forEach(staff => {
                    const option = document.createElement('option');
                    option.value = staff.maNguoiDung;
                    option.textContent = `${staff.hoTen} - ${staff.soDienThoai}`;
                    staffSelect.appendChild(option);
                });
            } else {
                console.error('Dữ liệu nhân viên không hợp lệ:', data);
            }
        })
        .catch(error => {
            console.error('Lỗi khi tải danh sách nhân viên:', error);
        });
}

// Hàm tải danh sách nhân viên cho dropdown admin-staff (dành cho quản trị viên)
function loadAdminStaffList() {
    fetch('http://localhost:5284/api/KhachSanAPI/staff/available', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            const adminStaffSelect = document.getElementById('admin-staff');
            adminStaffSelect.innerHTML = '<option value="">-- Chọn nhân viên --</option>';

            if (data.success && Array.isArray(data.nhanViens)) {
                data.nhanViens.forEach(staff => {
                    const option = document.createElement('option');
                    option.value = staff.maNguoiDung;
                    option.textContent = `${staff.hoTen} - ${staff.soDienThoai}`;
                    adminStaffSelect.appendChild(option);
                });
            } else {
                console.error('Dữ liệu nhân viên không hợp lệ:', data);
            }
        })
        .catch(error => {
            console.error('Lỗi khi tải danh sách nhân viên:', error);
        });
}

// Hàm mở modal kết ca
function openShiftEndModal() {
    // Kiểm tra vai trò người dùng
    const adminStaffSection = document.getElementById('admin-staff-selection');
    if (userRole === "Quản trị") {
        adminStaffSection.style.display = 'block'; // Hiển thị dropdown cho quản trị viên
        loadAdminStaffList(); // Tải danh sách nhân viên
    } else {
        adminStaffSection.style.display = 'none'; // Ẩn dropdown cho nhân viên thường
    }

    Promise.all([fetchCurrentShift(), loadStaffList()])
        .then(() => {
            document.getElementById('shiftEndModal').style.display = 'block';
        })
        .catch(error => {
            console.error('Lỗi khi tải dữ liệu cho modal:', error);
            alert('Không thể tải dữ liệu cho modal. Vui lòng thử lại.');
        });
}

// Hàm đóng modal kết ca
function closeShiftEndModal() {
    document.getElementById('shiftEndModal').style.display = 'none';
}

// Hàm gửi yêu cầu kết thúc ca
function submitShiftEnd() {
    const nextStaffSelect = document.getElementById('next-staff');
    const adminStaffSelect = document.getElementById('admin-staff');
    const total = parseFloat((document.getElementById('shift-total').textContent || '0').replace(/[^\d.-]/g, ''));
    const transfer = parseFloat((document.getElementById('shift-transfer').textContent || '0').replace(/[^\d.-]/g, ''));

    const data = {
        TongTienTrongCa: total,
        TongTienChuyenGiao: nextStaffSelect.value ? transfer : 0,
        GhiChu: document.getElementById('shift-note').value,
        MaNhanVienCaTiepTheo: nextStaffSelect.value ? parseInt(nextStaffSelect.value) : null,
        MaNhanVien: userRole === "Quản trị" && adminStaffSelect.value ? parseInt(adminStaffSelect.value) : null
    };

    fetch('http://localhost:5284/api/KhachSanAPI/end-shift', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert(result.message);
                closeShiftEndModal();
            } else {
                alert(result.message || 'Có lỗi xảy ra khi kết thúc ca');
            }
        })
        .catch(error => {
            console.error('Lỗi khi gửi yêu cầu kết thúc ca:', error);
            alert('Đã xảy ra lỗi khi kết thúc ca làm việc');
        });
}

// Hàm xử lý khi thay đổi nhân viên ca tiếp theo
function onNextStaffChange() {
    const nextStaffSelect = document.getElementById('next-staff');
    const transferField = document.querySelector('.transfer-field');

    if (nextStaffSelect.value) {
        transferField.style.display = 'block';
    } else {
        transferField.style.display = 'none';
    }
}

// Khởi tạo sự kiện khi trang được tải
document.addEventListener('DOMContentLoaded', function () {
    fetchCurrentUser();
    const nextStaffSelect = document.getElementById('next-staff');
    if (nextStaffSelect) {
        nextStaffSelect.addEventListener('change', onNextStaffChange);
    }
});