// Biến toàn cục để lưu dữ liệu nhóm
let groupsData = [];

// DOM Elements
const groupModal = document.getElementById('groupModal');
const mergeBillModal = document.getElementById('mergeBillModal');
const groupRoomSelection = document.getElementById('group-room-selection');
const mergeGroupId = document.getElementById('merge-group-id');
const mergeGroupName = document.getElementById('merge-group-name');
const mergeGroupRepresentative = document.getElementById('merge-group-representative');
const mergeGroupPhone = document.getElementById('merge-group-phone');
const mergeBillRooms = document.getElementById('merge-bill-rooms');
const mergeTotalServices = document.getElementById('merge-total-services');
const mergeTotalRoom = document.getElementById('merge-total-room');
const mergeTotal = document.getElementById('merge-total');
const groupSelect = document.getElementById('group-select');

// Hàm hiển thị thông báo toast
function showToast(message, type = 'success') {
    const iconMap = {
        success: 'success',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };

    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: iconMap[type] || 'info',
        title: message,
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });
}

// Tải danh sách nhóm từ backend
function loadGroups() {
    fetch('https://localhost:5284/api/KhachSanAPI/groups', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success) {
                groupsData = data.groups
                    .filter(group => group.rooms.some(roomId => {
                        const room = document.querySelector(`.room[data-room-id="${roomId}"]`);
                        return room && room.classList.contains('occupied');
                    }))
                    .map(group => ({
                        id: group.id,
                        name: group.name,
                        representative: group.representative,
                        phone: group.phone,
                        rooms: group.rooms, // MaPhong
                        datPhongs: group.datPhongs || [] // Thêm MaDatPhong
                    }))
                    .sort((a, b) => a.id - b.id);
                console.log('Danh sách nhóm đã tải:', groupsData);
                updateGroupSelect();
            } else {
                showToast(data.message || 'Không thể tải danh sách nhóm!', 'error');
            }
        })
        .catch(error => {
            console.error('Lỗi khi tải danh sách nhóm:', error);
            showToast('Lỗi khi tải danh sách nhóm!', 'error');
        });
}

// Mở modal thêm vào nhóm
function openGroupModal() {
    const rooms = document.querySelectorAll('.room');
    groupRoomSelection.innerHTML = '';
    rooms.forEach(room => {
        const roomId = room.getAttribute('data-room-id');
        const isOccupied = room.classList.contains('occupied');
        if (isOccupied) {
            groupRoomSelection.innerHTML += `
                <label>
                    <input type="checkbox" value="${roomId}"> ${roomId}
                </label>
            `;
        }
    });
    groupModal.style.display = 'block';
}

// Mở modal gộp hóa đơn
function openMergeBillModal() {
    if (groupsData.length === 0) {
        showToast('Chưa có nhóm nào để gộp hóa đơn!', 'error');
        return;
    }

    updateGroupSelect(); // Điền danh sách nhóm vào dropdown
    updateMergeBillDetails(); // Hiển thị chi tiết nhóm đầu tiên
    mergeBillModal.style.display = 'block';
}

// Cập nhật danh sách nhóm trong dropdown
function updateGroupSelect() {
    groupSelect.innerHTML = groupsData.map(group =>
        `<option value="${group.id}">${group.name} (ID: ${group.id})</option>`
    ).join('');
    if (groupsData.length === 0) {
        groupSelect.innerHTML = '<option value="">Không có nhóm nào</option>';
    }
}

// Cập nhật chi tiết gộp hóa đơn dựa trên nhóm được chọn
function updateMergeBillDetails() {
    const selectedGroupId = parseInt(groupSelect.value);
    const group = groupsData.find(g => g.id === selectedGroupId);
    if (!group) {
        showToast('Không tìm thấy nhóm được chọn!', 'error');
        return;
    }

    mergeGroupId.textContent = group.id;
    mergeGroupName.textContent = group.name || 'N/A';
    mergeGroupRepresentative.textContent = group.representative || 'N/A';
    mergeGroupPhone.textContent = group.phone || 'N/A';

    // Dùng MaDatPhong thay vì MaPhong
    const url = `https://localhost:5284/api/KhachSanAPI/GetRoomServices?${group.datPhongs.map(datPhongId => `maDatPhong=${datPhongId}`).join('&')}`;
    fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success) {
                mergeBillRooms.innerHTML = '';
                let totalServices = 0;
                let totalRoom = 0;
                const rooms = document.querySelectorAll('.room');
                group.rooms.forEach(roomId => {
                    const room = Array.from(rooms).find(r => r.getAttribute('data-room-id') === roomId);
                    if (room) {
                        const price = parseInt(room.getAttribute('data-price')?.replace(/[^0-9]/g, '') || '0');
                        const billId = room.getAttribute('data-bill-id') || 'N/A';
                        const datPhongId = room.getAttribute('data-datphong-id');
                        const services = data.services.filter(s => s.maDatPhong === parseInt(datPhongId));
                        let roomServicesTotal = services.reduce((sum, s) => sum + (s.thanhTien || 0), 0);
                        totalServices += roomServicesTotal;
                        totalRoom += price;
                        mergeBillRooms.innerHTML += `
                            <tr>
                                <td>${roomId}</td>
                                <td>${billId}</td>
                                <td>${price.toLocaleString()}đ</td>
                                <td>${roomServicesTotal.toLocaleString()}đ</td>
                                <td>${(price + roomServicesTotal).toLocaleString()}đ</td>
                            </tr>
                        `;
                    }
                });
                mergeTotalServices.textContent = totalServices.toLocaleString() + 'đ';
                mergeTotalRoom.textContent = totalRoom.toLocaleString() + 'đ';
                mergeTotal.textContent = (totalServices + totalRoom).toLocaleString() + 'đ';
            } else {
                showToast(data.message || 'Không thể tải dịch vụ!', 'error');
            }
        })
        .catch(error => {
            console.error('Lỗi khi tải dịch vụ cho nhóm:', error);
            showToast('Lỗi khi tải dữ liệu gộp hóa đơn: ' + error.message, 'error');
        });
}

// Đóng modal thêm vào nhóm
function closeGroupModal() {
    groupModal.style.display = 'none';
}

// Đóng modal gộp hóa đơn
function closeMergeBillModal() {
    mergeBillModal.style.display = 'none';
}

// Thêm vào nhóm
function addToGroup() {
    const groupName = document.getElementById('group-name').value.trim();
    const representative = document.getElementById('group-representative').value.trim();
    const phone = document.getElementById('group-phone').value.trim();

    if (!groupName || !representative || !phone) {
        showToast('Vui lòng nhập đầy đủ thông tin đoàn!', 'error');
        speak('Vui lòng nhập đầy đủ thông tin đoàn!');
        return;
    }

    if (!/^\d{10,11}$/.test(phone)) {
        showToast('Số điện thoại phải có 10-11 số!', 'error');
        speak('Số điện thoại phải có 10-11 số!');
        return;
    }

    // Kiểm tra trùng tên nhóm
    fetch('https://localhost:5284/api/KhachSanAPI/groups', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.groups.some(group => group.name === groupName)) {
                Swal.fire({
                    title: 'Tên nhóm đã tồn tại',
                    text: 'Tên đoàn này đã được sử dụng. Bạn có muốn tiếp tục tạo nhóm mới không?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Có, tiếp tục',
                    cancelButtonText: 'Hủy'
                }).then((result) => {
                    if (result.isConfirmed) {
                        createGroup(groupName, representative, phone);
                    }
                });
            } else {
                createGroup(groupName, representative, phone);
            }
        })
        .catch(error => {
            console.error('Lỗi khi kiểm tra tên nhóm:', error);
            showToast('Lỗi khi kiểm tra tên nhóm: ' + error.message, 'error');
            speak('Lỗi khi kiểm tra tên nhóm: ' + error.message);
        });
}

function createGroup(groupName, representative, phone) {
    Swal.fire({
        title: 'Xác nhận tạo đoàn',
        text: 'Bạn có chắc muốn tạo đoàn này không?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Có, tạo đoàn',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('https://localhost:5284/api/KhachSanAPI/add-group', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    TenNhom: groupName,
                    HoTenNguoiDaiDien: representative,
                    SoDienThoaiNguoiDaiDien: phone,
                    MaPhong: []
                })
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => {
                            throw new Error(err.message || `HTTP error! Status: ${response.status}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        closeGroupModal();
                        showToast(`Tạo đoàn thành công! Mã nhóm: ${data.maNhomDatPhong}`, 'success');
                        speak(`Tạo đoàn thành công! Mã nhóm: ${data.maNhomDatPhong}`);
                        // Cập nhật danh sách nhóm
                        loadGroups();
                    } else {
                        showToast(data.message || 'Có lỗi khi tạo đoàn!', 'error');
                        speak(data.message || 'Có lỗi khi tạo đoàn!');
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi tạo đoàn:', error);
                    if (error.message.includes('401')) {
                        Swal.fire({
                            title: 'Chưa đăng nhập',
                            text: 'Bạn cần đăng nhập để thêm nhóm!',
                            icon: 'warning',
                            confirmButtonText: 'Đăng nhập'
                        }).then(() => {
                            window.location.href = '/TaiKhoan/DangNhap';
                        });
                    } else {
                        showToast('Đã xảy ra lỗi khi thêm nhóm: ' + error.message, 'error');
                        speak('Đã xảy ra lỗi khi thêm nhóm: ' + error.message);
                    }
                });
        }
    });
}

function closeGroupModal() {
    document.getElementById('groupModal').style.display = 'none';
}

function openGroupModal() {
    document.getElementById('groupModal').style.display = 'block';
}

// Gộp hóa đơn
function mergeBill() {
    const groupId = parseInt(groupSelect.value);
    const note = "Gộp hóa đơn cho nhóm " + mergeGroupName.textContent;

    if (isNaN(groupId) || groupId <= 0) {
        showToast('Mã nhóm đặt phòng không hợp lệ!', 'error');
        return;
    }

    const payload = {
        MaNhomDatPhong: groupId,
        GhiChu: note
    };

    console.log('Dữ liệu gửi lên:', payload);

    fetch('https://localhost:5284/api/KhachSanAPI/merge-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${err.message || 'Không có thông báo lỗi'}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const total = mergeTotal.textContent;
                showToast(data.message, 'success');
                closeMergeBillModal();
                const rooms = document.querySelectorAll('.room');
                groupsData.find(g => g.id === groupId).rooms.forEach(roomId => {
                    const room = Array.from(rooms).find(r => r.getAttribute('data-room-id') === roomId);
                    if (room) {
                        room.classList.remove('occupied');
                        room.querySelector('.status').textContent = 'Trống';
                        room.querySelector('.door-icon').classList.remove('fa-door-open');
                        room.querySelector('.door-icon').classList.add('fa-door-closed');
                        room.removeAttribute('data-datphong-id');
                    }
                });
                groupsData = groupsData.filter(g => g.id !== groupId);
                updateGroupSelect(); // Cập nhật dropdown sau khi thanh toán
            } else {
                showToast(data.message || 'Có lỗi khi gộp hóa đơn!', 'error');
            }
        })
        .catch(error => {
            console.error('Lỗi khi gộp hóa đơn:', error);
            showToast(error.message, 'error');
        });
}

// Hàm phụ để cập nhật MaNhomDatPhong trong DatPhong
function updateDatPhongWithGroup(datPhongId, maNhomDatPhong) {
    fetch('https://localhost:5284/api/KhachSanAPI/UpdateDatPhongGroup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            MaDatPhong: parseInt(datPhongId),
            MaNhomDatPhong: maNhomDatPhong
        })
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (!data.success) {
                console.warn(`Không thể cập nhật DatPhong ${datPhongId} với MaNhomDatPhong ${maNhomDatPhong}: ${data.message}`);
            } else {
                console.log(`Đã cập nhật DatPhong ${datPhongId} với MaNhomDatPhong ${maNhomDatPhong}`);
            }
        })
        .catch(error => {
            console.error('Lỗi khi cập nhật DatPhong:', error);
            showToast('Lỗi khi liên kết phòng với nhóm: ' + error.message, 'error');
        });
}

function redirectToGroupManagement() {
    fetch('https://localhost:5284/api/KhachSanAPI/groups', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success && data.groups && data.groups.length > 0) {
                // Hiển thị danh sách nhóm để chọn
                Swal.fire({
                    title: 'Chọn nhóm',
                    input: 'select',
                    inputOptions: data.groups.reduce((options, group) => {
                        options[group.id] = group.name;
                        return options;
                    }, {}),
                    inputPlaceholder: 'Chọn một nhóm',
                    showCancelButton: true,
                    confirmButtonText: 'Tiếp tục',
                    cancelButtonText: 'Hủy',
                    inputValidator: (value) => {
                        if (!value) {
                            return 'Vui lòng chọn một nhóm!';
                        }
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        const maNhomDatPhong = result.value;
                        window.location.href = `/KhachSan/GroupManagement?maNhomDatPhong=${maNhomDatPhong}`;
                    }
                });
            } else {
                showToast('Không có nhóm nào để chọn! Vui lòng tạo nhóm trước.', 'error');
                speak('Không có nhóm nào để chọn! Vui lòng tạo nhóm trước.');
            }
        })
        .catch(error => {
            console.error('Lỗi khi tải danh sách nhóm:', error);
            showToast('Lỗi khi tải danh sách nhóm: ' + error.message, 'error');
            speak('Lỗi khi tải danh sách nhóm: ' + error.message);
        });
}

// Khởi tạo khi trang tải
document.addEventListener('DOMContentLoaded', function () {
    loadGroups();
});

