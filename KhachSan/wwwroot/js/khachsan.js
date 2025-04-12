// DOM Elements
const rooms = document.querySelectorAll('.room');
const roomModal = document.getElementById('roomModal');
const bookingModal = document.getElementById('bookingModal');
const serviceModal = document.getElementById('serviceModal');
const billingModal = document.getElementById('billingModal');
const modalRoomId = document.getElementById('modal-room-id');
const modalCustomer = document.getElementById('modal-customer');
const modalType = document.getElementById('modal-type');
const modalPrice = document.getElementById('modal-price');
const modalStatus = document.getElementById('modal-status');
const modalCurrent = document.getElementById('modal-current');
const bookingRoomId = document.getElementById('booking-room-id');
const serviceRoomId = document.getElementById('service-room-id');
const billingBillId = document.getElementById('billing-bill-id');
const billingStaff = document.getElementById('billing-staff');
const billingStaffId = document.getElementById('billing-staff-id');
const billingCheckin = document.getElementById('billing-checkin');
const billingCheckout = document.getElementById('billing-checkout');
const billingNote = document.getElementById('billing-note');
const billingServices = document.getElementById('billing-services');
const billingTotalServices = document.getElementById('billing-total-services');
const billingDiscount = document.getElementById('billing-discount');
const billingRoomPrice = document.getElementById('billing-room-price');
const billingServiceFee = document.getElementById('billing-service-fee');
const billingTotal = document.getElementById('billing-total');
const billingFinal = document.getElementById('billing-final');
const billingPrepaid = document.getElementById('billing-prepaid');
const billingStatus = document.getElementById('billing-status');
const billingDatphongStatus = document.getElementById('billing-datphong-status');

// Hàm hiển thị thông báo xác nhận
function showConfirmDialog(message, onConfirm, onCancel) {
    Swal.fire({
        title: 'Xác nhận',
        text: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ'
    }).then((result) => {
        if (result.isConfirmed && typeof onConfirm === 'function') {
            onConfirm();
        } else if (typeof onCancel === 'function') {
            onCancel();
        }
    });
}

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

// Hàm định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Hàm tải thông tin thống kê
function fetchStats() {
    fetch('https://localhost:5284/api/KhachSanAPI/stats', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const totalRevenue = document.getElementById('total-revenue');
            const totalCustomers = document.getElementById('total-customers');
            const totalRooms = document.getElementById('total-rooms');
            const occupiedRooms = document.getElementById('occupied-rooms');
            const availableRooms = document.getElementById('available-rooms');
            const pendingPayment = document.getElementById('pending-payment');

            if (totalRevenue) totalRevenue.textContent = formatCurrency(data.totalRevenue || 0);
            if (totalCustomers) totalCustomers.textContent = data.totalCustomers || 0;
            if (totalRooms) totalRooms.textContent = data.totalRooms || 0;
            if (occupiedRooms) occupiedRooms.textContent = data.occupiedRooms || 0;
            if (availableRooms) availableRooms.textContent = data.availableRooms || 0;
            if (pendingPayment) pendingPayment.textContent = data.pendingPayment || 0;
        })
        .catch(error => {
            console.error('Lỗi khi tải thông tin thống kê:', error);
            showToast('Không thể tải thông tin thống kê!', 'error');
        });
}

// Logout
function logout() {
    showConfirmDialog('Bạn có muốn đăng xuất không?', () => {
        localStorage.removeItem('token');
        window.location.href = '/TaiKhoan/DangXuat';
        showToast('Đăng xuất thành công!', 'success');
    });
}

// Change Password
function changePassword() {
    window.location.href = '/TaiKhoan/DoiMatKhau';
}

// Scan CCCD (mô phỏng)
function scanCCCD() {
    document.getElementById('cccd-number').value = '123456789';
    document.getElementById('customer-name').value = 'Trần Quốc Đông';
    document.getElementById('customer-address').value = '123 Đường ABC, TP.HCM';
    document.getElementById('customer-nationality').value = 'Việt Nam';
    showToast('Quét CCCD thành công!', 'success');
}

// Book Room
function bookRoom() {
    const roomId = bookingRoomId.textContent;
    const bookingType = document.getElementById('booking-type').value;
    const cccdNumber = document.getElementById('cccd-number').value;
    const customerName = document.getElementById('customer-name').value;
    const customerAddress = document.getElementById('customer-address').value;
    const customerNationality = document.getElementById('customer-nationality').value;

    if (!roomId || isNaN(parseInt(roomId))) {
        showToast('Mã phòng không hợp lệ!', 'error');
        return;
    }

    if (!cccdNumber || !customerName || !customerAddress || !customerNationality) {
        showToast('Vui lòng nhập đầy đủ thông tin khách hàng!', 'error');
        return;
    }

    // Thêm xác nhận bằng SweetAlert2
    Swal.fire({
        title: 'Xác nhận đặt phòng',
        text: 'Bạn có chắc muốn đặt phòng này không?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Có, đặt phòng',
        cancelButtonText: 'Hủy',
        buttonsStyling: true,
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Tiếp tục với logic gốc
            fetch('https://localhost:5284/api/KhachSanAPI/BookRoom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    MaPhong: parseInt(roomId),
                    LoaiGiayTo: 'CCCD',
                    SoGiayTo: cccdNumber,
                    HoTen: customerName,
                    DiaChi: customerAddress,
                    QuocTich: customerNationality,
                    LoaiDatPhong: bookingType
                }),
                credentials: 'include'
            })
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        const room = Array.from(rooms).find(r => r.getAttribute('data-room-id') === roomId);
                        if (room) {
                            room.classList.add('occupied');
                            room.querySelector('.status').textContent = 'Đang sử dụng';
                            room.querySelector('.door-icon').classList.remove('fa-door-closed');
                            room.querySelector('.door-icon').classList.add('fa-door-open');
                            room.setAttribute('data-customer', customerName);
                            room.setAttribute('data-checkin', new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'medium' }));
                            room.setAttribute('data-datphong-id', data.maDatPhong);
                            closeBookingModal();
                            showToast('Đặt phòng thành công!', 'success');
                        } else {
                            showToast('Không tìm thấy phòng để cập nhật trạng thái!', 'error');
                        }
                    } else {
                        showToast(data.message || 'Có lỗi khi đặt phòng!', 'error');
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi đặt phòng:', error);
                    if (error.message.includes('401')) {
                        Swal.fire({
                            title: 'Chưa đăng nhập',
                            text: 'Bạn cần đăng nhập để đặt phòng!',
                            icon: 'warning',
                            confirmButtonText: 'Đăng nhập'
                        }).then(() => {
                            window.location.href = '/TaiKhoan/DangNhap';
                        });
                    } else {
                        showToast('Đã xảy ra lỗi khi đặt phòng: ' + error.message, 'error');
                    }
                });
        }
    });
}

// Open Service Modal
function openServiceModal() {
    const roomId = modalRoomId.textContent;
    serviceRoomId.textContent = roomId;
    fetch('https://localhost:5284/api/KhachSanAPI/GetServices', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const serviceSelect = document.getElementById('service-name');
            serviceSelect.innerHTML = '';
            if (data.success) {
                data.services.forEach(service => {
                    const option = document.createElement('option');
                    option.value = `${service.maDichVu}|${service.gia}`;
                    option.textContent = `${service.tenDichVu} - ${service.gia.toLocaleString('vi-VN')}đ`;
                    serviceSelect.appendChild(option);
                });
                serviceModal.style.display = 'block';
            } else {
                showToast('Không thể tải danh sách dịch vụ!', 'error');
            }
        })
        .catch(error => {
            console.error('Lỗi khi tải danh sách dịch vụ:', error);
            if (error.message.includes('401')) {
                Swal.fire({
                    title: 'Chưa đăng nhập',
                    text: 'Bạn cần đăng nhập để thêm dịch vụ!',
                    icon: 'warning',
                    confirmButtonText: 'Đăng nhập'
                }).then(() => {
                    window.location.href = '/TaiKhoan/DangNhap';
                });
            } else {
                showToast('Không thể tải danh sách dịch vụ: ' + error.message, 'error');
            }
        });
}

// Add Service
function addService() {
    const roomId = serviceRoomId.textContent;
    const datPhongId = Array.from(rooms).find(r => r.getAttribute('data-room-id') === roomId)?.getAttribute('data-datphong-id');
    const serviceSelect = document.getElementById('service-name').value.split('|');
    const maDichVu = parseInt(serviceSelect[0]);
    const quantity = parseInt(document.getElementById('service-quantity').value);

    if (!datPhongId || isNaN(parseInt(datPhongId))) {
        Swal.fire({
            title: 'Lỗi',
            text: 'Không thể thêm dịch vụ vì phòng chưa được đặt!',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (isNaN(maDichVu)) {
        Swal.fire({
            title: 'Lỗi',
            text: 'Vui lòng chọn một dịch vụ hợp lệ!',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (quantity <= 0) {
        Swal.fire({
            title: 'Lỗi',
            text: 'Số lượng phải lớn hơn 0!',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    const payload = {
        maDatPhong: parseInt(datPhongId),
        maDichVu: maDichVu,
        soLuong: quantity
    };

    fetch('https://localhost:5284/api/KhachSanAPI/AddService', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success) {
                closeServiceModal();
                Swal.fire({
                    title: 'Thành công',
                    text: 'Thêm dịch vụ thành công!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Cập nhật danh sách dịch vụ trong billingModal nếu đang mở
                    if (billingModal.style.display === 'block') {
                        updateBillingServices(datPhongId);
                    }
                });
            } else {
                Swal.fire({
                    title: 'Lỗi',
                    text: data.message || 'Có lỗi khi thêm dịch vụ!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(error => {
            console.error('Lỗi khi thêm dịch vụ:', error);
            if (error.message.includes('401')) {
                Swal.fire({
                    title: 'Chưa đăng nhập',
                    text: 'Bạn cần đăng nhập để thêm dịch vụ!',
                    icon: 'warning',
                    confirmButtonText: 'Đăng nhập'
                }).then(() => {
                    window.location.href = '/TaiKhoan/DangNhap';
                });
            } else {
                Swal.fire({
                    title: 'Lỗi',
                    text: 'Đã xảy ra lỗi khi thêm dịch vụ: ' + error.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        });
}

// Hàm phụ để cập nhật danh sách dịch vụ trong billingModal
function updateBillingServices(datPhongId) {
    fetch(`https://localhost:5284/api/KhachSanAPI/GetRoomServices?maDatPhong=${datPhongId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success && data.services) {
                let totalServices = 0;
                billingServices.innerHTML = billingServices.querySelector('tr')?.outerHTML || ''; // Giữ dòng tiền phòng
                data.services.forEach(service => {
                    totalServices += service.thanhTien;
                    billingServices.innerHTML += `
                        <tr>
                            <td>${service.maDichVu}</td>
                            <td>${service.tenDichVu}</td>
                            <td>-</td>
                            <td></td>
                            <td>${service.soLuong}</td>
                            <td>${service.donGia.toLocaleString()}đ</td>
                            <td>0%</td>
                            <td>${service.thanhTien.toLocaleString()}đ</td>
                            <td>-</td>
                        </tr>
                    `;
                });
                billingTotalServices.textContent = totalServices.toLocaleString('vi-VN') + 'đ';
                const roomPrice = parseInt(billingRoomPrice.textContent.replace(/[^0-9]/g, '') || '0');
                const tempTotal = roomPrice + totalServices;
                billingTotal.textContent = tempTotal.toLocaleString('vi-VN') + 'đ';
                billingFinal.textContent = tempTotal.toLocaleString('vi-VN') + 'đ';
            }
        })
        .catch(error => {
            console.error('Lỗi khi cập nhật dịch vụ:', error);
            showToast('Không thể cập nhật danh sách dịch vụ!', 'error');
        });
}

// Room Click Events
rooms.forEach(room => {
    room.addEventListener('click', () => {
        const roomId = room.getAttribute('data-room-id');
        const customer = room.getAttribute('data-customer');
        const type = room.getAttribute('data-type');
        const price = room.getAttribute('data-price');
        const status = room.getAttribute('data-status');
        const current = room.getAttribute('data-current');
        const isOccupied = room.classList.contains('occupied');

        if (isOccupied) {
            modalRoomId.textContent = roomId;
            modalCustomer.textContent = customer || 'N/A';
            modalType.textContent = type || 'N/A';
            modalPrice.textContent = price || '0đ';
            modalStatus.textContent = status || 'N/A';
            modalCurrent.textContent = current || 'N/A';
            roomModal.style.display = 'block';
            bookingModal.style.display = 'none';
            serviceModal.style.display = 'none';
            billingModal.style.display = 'none';
        } else {
            bookingRoomId.textContent = roomId;
            bookingModal.style.display = 'block';
            roomModal.style.display = 'none';
            serviceModal.style.display = 'none';
            billingModal.style.display = 'none';
            const bookRoomBtn = document.getElementById('book-room-btn');
            if (bookRoomBtn) {
                bookRoomBtn.removeEventListener('click', bookRoom); // Xóa sự kiện cũ để tránh trùng lặp
                bookRoomBtn.addEventListener('click', bookRoom);
            }
        }
    });

    room.addEventListener('dblclick', () => {
        const isOccupied = room.classList.contains('occupied');
        if (!isOccupied) return;

        const roomId = room.getAttribute('data-room-id');
        const datPhongId = room.getAttribute('data-datphong-id');
        const staff = room.getAttribute('data-staff');
        const staffId = room.getAttribute('data-staff-id');
        const checkin = room.getAttribute('data-checkin');
        const priceHour = parseInt(room.getAttribute('data-price-hour') || '0') * 1000;
        const priceDay = parseInt(room.getAttribute('data-price-day') || '0') * 1000;

        if (!datPhongId || isNaN(parseInt(datPhongId))) {
            showToast('Mã đặt phòng không hợp lệ!', 'error');
            return;
        }

        billingBillId.textContent = datPhongId;
        billingStatus.textContent = 'Chưa thanh toán';
        billingDatphongStatus.textContent = 'Chưa thanh toán';
        billingStaff.textContent = staff || 'N/A';
        billingStaffId.textContent = staffId || 'N/A';
        billingCheckin.textContent = checkin;
        billingCheckout.textContent = new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'medium' });

        fetch(`https://localhost:5284/api/KhachSanAPI/GetBookingDetails/${datPhongId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(bookingData => {
                if (!bookingData.success) throw new Error(bookingData.message || 'Không lấy được chi tiết đặt phòng');

                const checkinDate = new Date(checkin);
                const checkoutDate = new Date();
                const thoiGianO = (checkoutDate - checkinDate) / (1000 * 60 * 60); // Thời gian ở (giờ)
                let tongTienPhong = 0;
                let loaiTinhTien = bookingData.loaiDatPhong;

                if (loaiTinhTien === 'Theo ngày') {
                    tongTienPhong = priceDay;
                } else {
                    tongTienPhong = Math.ceil(thoiGianO) * priceHour;
                }

                fetch(`https://localhost:5284/api/KhachSanAPI/GetRoomServices?maDatPhong=${datPhongId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                })
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                        return response.json();
                    })
                    .then(data => {
                        billingServices.innerHTML = '';
                        let totalServices = 0;

                        billingServices.innerHTML += `
                            <tr>
                                <td>-</td>
                                <td>Tiền phòng (${loaiTinhTien})</td>
                                <td>-</td>
                                <td>-</td>
                                <td>${loaiTinhTien === 'Theo giờ' ? Math.ceil(thoiGianO) : 1}</td>
                                <td>${(loaiTinhTien === 'Theo giờ' ? priceHour : priceDay).toLocaleString()}đ</td>
                                <td>0%</td>
                                <td>${tongTienPhong.toLocaleString()}đ</td>
                                <td>-</td>
                            </tr>
                        `;

                        if (data.success && data.services) {
                            data.services.forEach(service => {
                                totalServices += service.thanhTien;
                                billingServices.innerHTML += `
                                    <tr>
                                        <td>${service.maDichVu}</td>
                                        <td>${service.tenDichVu}</td>
                                        <td>-</td>
                                        <td></td>
                                        <td>${service.soLuong}</td>
                                        <td>${service.donGia.toLocaleString()}đ</td>
                                        <td>0%</td>
                                        <td>${service.thanhTien.toLocaleString()}đ</td>
                                        <td>-</td>
                                    </tr>
                                `;
                            });
                        }

                        billingTotalServices.textContent = totalServices.toLocaleString('vi-VN') + 'đ';
                        billingDiscount.textContent = '0đ';
                        billingRoomPrice.textContent = tongTienPhong.toLocaleString('vi-VN') + 'đ';
                        billingServiceFee.textContent = '0đ';
                        const tempTotal = tongTienPhong + totalServices;
                        billingTotal.textContent = tempTotal.toLocaleString('vi-VN') + 'đ';
                        billingFinal.textContent = tempTotal.toLocaleString('vi-VN') + 'đ';
                        billingPrepaid.textContent = '0đ';
                        billingModal.style.display = 'block';
                        roomModal.style.display = 'none';
                        bookingModal.style.display = 'none';
                        serviceModal.style.display = 'none';
                    })
                    .catch(error => {
                        console.error('Lỗi khi tải dịch vụ phòng:', error);
                        showToast('Không thể tải danh sách dịch vụ: ' + error.message, 'error');
                    });
            })
            .catch(error => {
                console.error('Lỗi khi lấy chi tiết đặt phòng:', error);
                showToast('Không thể lấy thông tin đặt phòng: ' + error.message, 'error');
            });
    });
});

// Process Payment
function processPayment() {
    const datPhongId = billingBillId.textContent;
    const note = billingNote.value;

    Swal.fire({
        title: 'Xác nhận thanh toán',
        text: 'Bạn có chắc muốn thanh toán không?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Có, thanh toán',
        cancelButtonText: 'Hủy',
        buttonsStyling: true,
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('https://localhost:5284/api/KhachSanAPI/ProcessPayment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    maDatPhong: parseInt(datPhongId),
                    ghiChu: note
                }),
                credentials: 'include'
            })
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        const room = Array.from(rooms).find(r => r.getAttribute('data-datphong-id') === datPhongId);
                        room.classList.remove('occupied');
                        room.querySelector('.status').textContent = 'Trống';
                        room.querySelector('.door-icon').classList.remove('fa-door-open');
                        room.querySelector('.door-icon').classList.add('fa-door-closed');
                        room.removeAttribute('data-datphong-id');

                        billingStatus.textContent = data.hoaDonTrangThaiThanhToan || 'Đã thanh toán';
                        billingDatphongStatus.textContent = data.datPhongTrangThaiThanhToan || 'Đã thanh toán';
                        billingRoomPrice.textContent = data.tongTienPhong.toLocaleString('vi-VN') + 'đ';
                        billingTotal.textContent = data.tongTien.toLocaleString('vi-VN') + 'đ';
                        billingFinal.textContent = data.tongTien.toLocaleString('vi-VN') + 'đ';

                        Swal.fire({
                            title: 'Thành công!',
                            text: `Thanh toán thành công! Tổng tiền: ${data.tongTien.toLocaleString('vi-VN')}đ`,
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                    } else {
                        Swal.fire({
                            title: 'Lỗi!',
                            text: data.message || 'Có lỗi khi thanh toán!',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi thanh toán:', error);
                    if (error.message.includes('401')) {
                        Swal.fire({
                            title: 'Chưa đăng nhập',
                            text: 'Bạn cần đăng nhập để thanh toán!',
                            icon: 'warning',
                            confirmButtonText: 'Đăng nhập'
                        }).then(() => {
                            window.location.href = '/TaiKhoan/DangNhap';
                        });
                    } else {
                        Swal.fire({
                            title: 'Lỗi!',
                            text: 'Đã xảy ra lỗi khi thanh toán: ' + error.message,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                });
        }
    });
}

// Close Modals
function closeModal() {
    roomModal.style.display = 'none';
}

function closeBookingModal() {
    bookingModal.style.display = 'none';
}

function closeServiceModal() {
    serviceModal.style.display = 'none';
}

function closeBillingModal() {
    billingModal.style.display = 'none';
}

// Group Modal Functions
function closeGroupModal() {
    const groupModal = document.getElementById('groupModal');
    groupModal.style.display = 'none';
}

function openGroupModal() {
    const groupModal = document.getElementById('groupModal');
    groupModal.style.display = 'block';
    loadGroupRoomSelection();
}

function loadGroupRoomSelection() {
    const roomSelection = document.getElementById('group-room-selection');
    roomSelection.innerHTML = '';

    fetch('https://localhost:5284/api/KhachSanAPI/GetRooms', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success && data.rooms) {
                data.rooms.forEach(room => {
                    const div = document.createElement('div');
                    div.className = 'room-checkbox';
                    div.innerHTML = `
                        <input type="checkbox" id="room-${room.maPhong}" value="${room.maPhong}">
                        <label for="room-${room.maPhong}">${room.tenPhong} (${room.trangThai})</label>
                    `;
                    roomSelection.appendChild(div);
                });
            } else {
                showToast('Không thể tải danh sách phòng!', 'error');
            }
        })
        .catch(error => {
            console.error('Lỗi khi tải danh sách phòng:', error);
            showToast('Không thể tải danh sách phòng: ' + error.message, 'error');
        });
}

function addToGroup() {
    const groupName = document.getElementById('group-name').value.trim();
    const representative = document.getElementById('group-representative').value.trim();
    const phone = document.getElementById('group-phone').value.trim();
    const roomSelection = document.getElementById('group-room-selection');
    const selectedRooms = Array.from(roomSelection.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => parseInt(checkbox.value));

    if (!groupName) {
        showToast('Vui lòng nhập tên nhóm!', 'error');
        return;
    }
    if (!representative) {
        showToast('Vui lòng nhập tên người đại diện!', 'error');
        return;
    }
    if (!phone || !/^\d{10,11}$/.test(phone)) {
        showToast('Vui lòng nhập số điện thoại hợp lệ (10-11 số)!', 'error');
        return;
    }
    if (selectedRooms.length === 0) {
        showToast('Vui lòng chọn ít nhất một phòng!', 'error');
        return;
    }

    const payload = {
        tenNhom: groupName,
        nguoiDaiDien: representative,
        soDienThoai: phone,
        MaPhong: selectedRooms
    };

    fetch('https://localhost:5284/api/KhachSanAPI/AddGroup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success) {
                closeGroupModal();
                fetchStats();
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Thêm nhóm thành công!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    title: 'Lỗi!',
                    text: data.message || 'Có lỗi khi thêm nhóm!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(error => {
            console.error('Lỗi khi thêm nhóm:', error);
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
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Đã xảy ra lỗi khi thêm nhóm: ' + error.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        });
}

// Gọi fetchStats khi trang tải
document.addEventListener('DOMContentLoaded', function () {
    fetchStats();
});