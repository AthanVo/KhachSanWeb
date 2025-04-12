// Biến lưu thông tin ca hiện tại
let currentShift = null;
let userRole = "Nhân viên"; // Mặc định

// Hàm định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Hàm hiển thị thông báo toast (thêm vào file ketca.js)
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        console.error('Không tìm thấy toast-container trong DOM!');
        return;
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} icon"></i>
        <span class="message">${message}</span>
        <button class="close" onclick="this.parentElement.remove()">×</button>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3500);
}

// Hàm lấy thông tin người dùng hiện tại
function fetchCurrentUser() {
    return fetch('https://localhost:5284/api/KhachSanAPI/current-user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                console.error(`Yêu cầu API thất bại: Status ${response.status}, StatusText: ${response.statusText}`);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                userRole = data.user.vaiTro;
            } else {
                console.error('Lỗi khi lấy thông tin người dùng:', data.message);
            }
        })
        .catch(error => {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
            window.location.href = '/TaiKhoan/Dangnhap';
        });
}

// Hàm tải thông tin ca hiện tại
function fetchCurrentShift() {
    console.log('Đang gọi API để lấy ca hiện tại...');
    return fetch('https://localhost:5284/api/KhachSanAPI/current-shift', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then(response => {
            console.log('Phản hồi từ server:', response.status);
            if (!response.ok) {
                console.error(`Yêu cầu API thất bại: Status ${response.status}, StatusText: ${response.statusText}`);
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
                document.getElementById('shift-total').textContent = formatCurrency(data.tongTienHoaDon || 0);
                document.getElementById('shift-transfer').textContent = formatCurrency(data.shift.tongTienChuyenGiao || 0);
            } else {
                console.error('Lỗi từ API:', data.message);
                showToast(data.message || 'Không thể lấy thông tin ca hiện tại', 'error');
            }
        })
        .catch(error => {
            console.error('Lỗi chi tiết khi tải thông tin ca hiện tại:', error);
            showToast('Không thể kết nối đến server. Vui lòng kiểm tra mạng hoặc thử lại sau.', 'error');
        });
}

// Hàm tải danh sách nhân viên cho ca tiếp theo
function loadStaffList() {
    return fetch('https://localhost:5284/api/KhachSanAPI/staff/available', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                console.error(`Yêu cầu API thất bại: Status ${response.status}, StatusText: ${response.statusText}`);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
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
    return fetch('https://localhost:5284/api/KhachSanAPI/staff/available', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                console.error(`Yêu cầu API thất bại: Status ${response.status}, StatusText: ${response.statusText}`);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
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
    const adminStaffSection = document.getElementById('admin-staff-selection');
    if (userRole === "Quản trị") {
        adminStaffSection.style.display = 'block';
        loadAdminStaffList();
    } else {
        adminStaffSection.style.display = 'none';
    }

    // Mở modal trước, sau đó tải dữ liệu
    document.getElementById('shiftEndModal').style.display = 'block';

    Promise.all([
        fetchCurrentShift().catch(error => {
            console.error('Lỗi khi tải ca hiện tại:', error);
            return null;
        }),
        loadStaffList().catch(error => {
            console.error('Lỗi khi tải danh sách nhân viên:', error);
            return null;
        })
    ]).catch(error => {
        console.error('Lỗi khi tải dữ liệu cho modal:', error);
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
        TongTienTrongCa: total, // Tổng tiền thực tế từ hóa đơn
        TongTienChuyenGiao: nextStaffSelect.value ? transfer : 0,
        GhiChu: document.getElementById('shift-note').value,
        MaNhanVienCaTiepTheo: nextStaffSelect.value ? parseInt(nextStaffSelect.value) : null,
        MaNhanVien: userRole === "Quản trị" && adminStaffSelect.value ? parseInt(adminStaffSelect.value) : null
    };

    fetch('https://localhost:5284/api/KhachSanAPI/end-shift', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                console.error(`Yêu cầu API thất bại: Status ${response.status}, StatusText: ${response.statusText}`);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            if (result.success) {
                showToast(result.message, 'success');
                closeShiftEndModal();
            } else {
                showToast(result.message || 'Có lỗi xảy ra khi kết thúc ca', 'error');
            }
        })
        .catch(error => {
            console.error('Lỗi khi gửi yêu cầu kết thúc ca:', error);
            showToast('Đã xảy ra lỗi khi kết thúc ca làm việc', 'error');
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