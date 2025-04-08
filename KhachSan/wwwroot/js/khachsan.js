// DOM Elements (khai báo đầu file)
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

// Gán sự kiện click cho nút "Đặt phòng"
document.addEventListener('DOMContentLoaded', function () {
    const bookRoomBtn = document.getElementById('book-room-btn');
    if (bookRoomBtn) {
        bookRoomBtn.addEventListener('click', bookRoom);
    } else {
        console.error('Không tìm thấy nút book-room-btn');
    }
});

// Logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/TaiKhoan/DangXuat';
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
}

// Book Room
function bookRoom() {
    const roomId = bookingRoomId.textContent;
    const bookingType = document.getElementById('booking-type').value;
    const cccdNumber = document.getElementById('cccd-number').value;
    const customerName = document.getElementById('customer-name').value;
    const customerAddress = document.getElementById('customer-address').value;
    const customerNationality = document.getElementById('customer-nationality').value;

    // Kiểm tra các giá trị
    console.log('Room ID:', roomId);
    console.log('Booking Type:', bookingType);
    console.log('CCCD Number:', cccdNumber);
    console.log('Customer Name:', customerName);
    console.log('Customer Address:', customerAddress);
    console.log('Customer Nationality:', customerNationality);

    if (!roomId || isNaN(parseInt(roomId))) {
        alert('Mã phòng không hợp lệ!');
        return;
    }

    if (!cccdNumber || !customerName || !customerAddress || !customerNationality) {
        alert('Vui lòng nhập đầy đủ thông tin khách hàng!');
        return;
    }

    console.log('Dữ liệu gửi lên:', {
        MaPhong: parseInt(roomId),
        LoaiGiayTo: 'CCCD',
        SoGiayTo: cccdNumber,
        HoTen: customerName,
        DiaChi: customerAddress,
        QuocTich: customerNationality,
        LoaiDatPhong: bookingType
    });

    fetch('https://localhost:5284/api/KhachSanAPI/BookRoom', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
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
            console.log('Status:', response.status, 'StatusText:', response.statusText);
            if (!response.ok) {
                return response.text().then(text => {
                    console.error('Response body:', text);
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${text || response.statusText}`);
                });
            }
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
                    alert('Đặt phòng thành công!');
                } else {
                    console.error('Không tìm thấy phòng với ID:', roomId);
                    alert('Có lỗi xảy ra khi cập nhật trạng thái phòng!');
                }
            } else {
                alert(data.message || 'Có lỗi khi đặt phòng!');
            }
        })
        .catch(error => {
            console.error('Lỗi khi đặt phòng:', error);
            if (error.message.includes('401')) {
                alert('Bạn cần đăng nhập để đặt phòng!');
                window.location.href = '/TaiKhoan/DangNhap';
            } else {
                alert('Đã xảy ra lỗi khi đặt phòng: ' + error.message);
            }
        });
}

// Open Service Modal
function openServiceModal() {
    const roomId = modalRoomId.textContent;
    serviceRoomId.textContent = roomId;
    fetch('https://localhost:5284/api/KhachSanAPI/GetServices', {
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
            const serviceSelect = document.getElementById('service-name');
            serviceSelect.innerHTML = '';
            if (data.success) {
                data.services.forEach(service => {
                    const option = document.createElement('option');
                    option.value = `${service.maDichVu}|${service.gia}`;
                    option.textContent = `${service.tenDichVu} - ${service.gia.toLocaleString('vi-VN')}đ`;
                    serviceSelect.appendChild(option);
                });
            }
            serviceModal.style.display = 'block';
        })
        .catch(error => {
            console.error('Lỗi khi tải danh sách dịch vụ:', error);
            if (error.message.includes('401')) {
                alert('Bạn cần đăng nhập để thêm dịch vụ!');
                window.location.href = '/TaiKhoan/DangNhap';
            } else {
                alert('Không thể tải danh sách dịch vụ!');
            }
        });
}

// Add Service
function addService() {
    const roomId = serviceRoomId.textContent;
    const datPhongId = Array.from(rooms).find(r => r.getAttribute('data-room-id') === roomId).getAttribute('data-datphong-id');
    const serviceSelect = document.getElementById('service-name').value.split('|');
    const maDichVu = parseInt(serviceSelect[0]);
    const quantity = parseInt(document.getElementById('service-quantity').value);

    if (quantity <= 0) {
        alert('Số lượng phải lớn hơn 0!');
        return;
    }

    fetch('https://localhost:5284/api/KhachSanAPI/AddService', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            maDatPhong: parseInt(datPhongId),
            maDichVu: maDichVu,
            soLuong: quantity
        }),
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
                console.log(`Đã thêm dịch vụ ${maDichVu} (x${quantity}) cho phòng ${roomId}`);
                closeServiceModal();
            } else {
                alert(data.message || 'Có lỗi khi thêm dịch vụ!');
            }
        })
        .catch(error => {
            console.error('Lỗi khi thêm dịch vụ:', error);
            if (error.message.includes('401')) {
                alert('Bạn cần đăng nhập để thêm dịch vụ!');
                window.location.href = '/TaiKhoan/DangNhap';
            } else {
                alert('Đã xảy ra lỗi khi thêm dịch vụ!');
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

    // Kiểm tra dữ liệu trước khi gửi
    console.log('RoomId:', roomId);
    console.log('DatPhongId:', datPhongId);
    console.log('MaDichVu:', maDichVu);
    console.log('SoLuong:', quantity);

    if (!datPhongId || isNaN(parseInt(datPhongId))) {
        alert('Không thể thêm dịch vụ vì phòng chưa được đặt!');
        return;
    }

    if (isNaN(maDichVu)) {
        alert('Vui lòng chọn một dịch vụ hợp lệ!');
        return;
    }

    if (quantity <= 0) {
        alert('Số lượng phải lớn hơn 0!');
        return;
    }

    fetch('https://localhost:5284/api/KhachSanAPI/AddService', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            maDatPhong: parseInt(datPhongId),
            maDichVu: maDichVu,
            soLuong: quantity
        }),
        credentials: 'include'
    })
        .then(response => {
            console.log('Status:', response.status, 'StatusText:', response.statusText);
            if (!response.ok) {
                return response.text().then(text => {
                    console.error('Response body:', text);
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${text || response.statusText}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log(`Đã thêm dịch vụ ${maDichVu} (x${quantity}) cho phòng ${roomId}`);
                closeServiceModal();
                alert('Thêm dịch vụ thành công!');
            } else {
                alert(data.message || 'Có lỗi khi thêm dịch vụ!');
            }
        })
        .catch(error => {
            console.error('Lỗi khi thêm dịch vụ:', error);
            if (error.message.includes('401')) {
                alert('Bạn cần đăng nhập để thêm dịch vụ!');
                window.location.href = '/TaiKhoan/DangNhap';
            } else {
                alert('Đã xảy ra lỗi khi thêm dịch vụ: ' + error.message);
            }
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

        // Kiểm tra datPhongId
        console.log('RoomId:', roomId);
        console.log('DatPhongId:', datPhongId);
        console.log('Staff:', staff);
        console.log('StaffId:', staffId);
        console.log('Checkin:', checkin);
        console.log('PriceHour:', priceHour);
        console.log('PriceDay:', priceDay);

        if (!datPhongId || isNaN(parseInt(datPhongId))) {
            alert('Không thể tải danh sách dịch vụ vì mã đặt phòng không hợp lệ!');
            return;
        }

        billingBillId.textContent = datPhongId;
        billingStatus.textContent = 'Chưa thanh toán'; // Trạng thái của HoaDon
        billingDatphongStatus.textContent = 'Chưa thanh toán'; // Trạng thái của DatPhong (ban đầu)
        billingStaff.textContent = staff || 'N/A';
        billingStaffId.textContent = staffId || 'N/A';
        billingCheckin.textContent = checkin;
        billingCheckout.textContent = new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'medium' });

        // Tính toán thời gian sử dụng và tiền phòng
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date();
        const thoiGianO = (checkoutDate - checkinDate) / (1000 * 60 * 60); // Thời gian ở (giờ)
        let tongTienPhong = 0;
        let loaiTinhTien = '';

        if (thoiGianO <= 24) {
            loaiTinhTien = 'Theo giờ';
            tongTienPhong = Math.ceil(thoiGianO) * priceHour;
        } else {
            loaiTinhTien = 'Theo ngày';
            tongTienPhong = priceDay;
        }

        fetch(`https://localhost:5284/api/KhachSanAPI/GetRoomServices?maDatPhong=${datPhongId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => {
                console.log(`Yêu cầu API: Status ${response.status}, StatusText: ${response.statusText}`);
                if (!response.ok) {
                    return response.text().then(text => {
                        console.error('Response body:', text);
                        throw new Error(`HTTP error! Status: ${response.status}, Message: ${text || response.statusText}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                billingServices.innerHTML = '';
                let totalServices = 0;

                // Thêm dòng tiền phòng vào bảng
                billingServices.innerHTML += `
                <tr>
                    <td>-</td>
                    <td>Tiền phòng (${loaiTinhTien})</td>
                    <td>-</td>
                    <td>-</td>
                    <td>${Math.ceil(thoiGianO)} giờ</td>
                    <td>${(loaiTinhTien === 'Theo giờ' ? priceHour : priceDay).toLocaleString()}đ</td>
                    <td>0%</td>
                    <td>${tongTienPhong.toLocaleString()}đ</td>
                    <td>-</td>
                </tr>
            `;

                // Thêm các dòng dịch vụ
                if (data.success && data.services) {
                    data.services.forEach(service => {
                        totalServices += service.thanhTien;
                        billingServices.innerHTML += `
                        <tr>
                            <td>${service.maDichVu}</td>
                            <td>${service.tenDichVu}</td>
                            <td>-</td>
                            <td>Chai</td>
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
                if (error.message.includes('401')) {
                    alert('Bạn cần đăng nhập để tính tiền!');
                    window.location.href = '/TaiKhoan/DangNhap';
                } else {
                    alert('Không thể tải danh sách dịch vụ: ' + error.message);
                }
            });
    });
});


function processPayment() {
    const datPhongId = billingBillId.textContent;
    const note = billingNote.value;

    if (!confirm('Bạn có chắc muốn thanh toán không?')) {
        return;
    }

    fetch('https://localhost:5284/api/KhachSanAPI/ProcessPayment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            maDatPhong: parseInt(datPhongId),
            ghiChu: note
        }),
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
                // Cập nhật trạng thái phòng trên giao diện
                const room = Array.from(rooms).find(r => r.getAttribute('data-datphong-id') === datPhongId);
                room.classList.remove('occupied');
                room.querySelector('.status').textContent = 'Trống';
                room.querySelector('.door-icon').classList.remove('fa-door-open');
                room.querySelector('.door-icon').classList.add('fa-door-closed');
                room.removeAttribute('data-datphong-id');

                // Cập nhật trạng thái trong modal
                billingStatus.textContent = data.hoaDonTrangThaiThanhToan || 'Đã thanh toán';
                billingDatphongStatus.textContent = data.datPhongTrangThaiThanhToan || 'Đã thanh toán';

                // Cập nhật thông tin trong modal hóa đơn
                billingRoomPrice.textContent = data.tongTienPhong.toLocaleString('vi-VN') + 'đ';
                billingTotal.textContent = data.tongTien.toLocaleString('vi-VN') + 'đ';
                billingFinal.textContent = data.tongTien.toLocaleString('vi-VN') + 'đ';

                // Cập nhật lại danh sách dịch vụ và các thông tin khác trong modal
                fetch(`https://localhost:5284/api/KhachSanAPI/GetRoomServices?maDatPhong=${datPhongId}`, {
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
                        billingServices.innerHTML = '';
                        let totalServices = 0;

                        // Thêm dòng tiền phòng vào bảng
                        billingServices.innerHTML += `
                            <tr>
                                <td>-</td>
                                <td>Tiền phòng (${loaiTinhTien})</td>
                                <td>-</td>
                                <td>-</td>
                                <td>${Math.ceil(thoiGianO)} giờ</td>
                                <td>${(loaiTinhTien === 'Theo giờ' ? priceHour : priceDay).toLocaleString()}đ</td>
                                <td>0%</td>
                                <td>${data.tongTienPhong.toLocaleString()}đ</td>
                                <td>-</td>
                            </tr>
                        `;

                        // Thêm các dòng dịch vụ
                        if (data.success && data.services) {
                            data.services.forEach(service => {
                                totalServices += service.thanhTien;
                                billingServices.innerHTML += `
                                    <tr>
                                        <td>${service.maDichVu}</td>
                                        <td>${service.tenDichVu}</td>
                                        <td>-</td>
                                        <td>Chai</td>
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
                        billingServiceFee.textContent = '0đ';
                    })
                    .catch(error => {
                        console.error('Lỗi khi tải dịch vụ phòng:', error);
                        if (error.message.includes('401')) {
                            alert('Bạn cần đăng nhập để tính tiền!');
                            window.location.href = '/TaiKhoan/DangNhap';
                        } else {
                            alert('Không thể tải danh sách dịch vụ: ' + error.message);
                        }
                    });

                alert(`Thanh toán thành công! Tổng tiền: ${data.tongTien.toLocaleString('vi-VN')}đ`);
                // Không đóng modal: xóa dòng closeBillingModal()
            } else {
                alert(data.message || 'Có lỗi khi thanh toán!');
            }
        })
        .catch(error => {
            console.error('Lỗi khi thanh toán:', error);
            if (error.message.includes('401')) {
                alert('Bạn cần đăng nhập để thanh toán!');
                window.location.href = '/TaiKhoan/DangNhap';
            } else {
                alert('Đã xảy ra lỗi khi thanh toán!');
            }
        });
}


// Close Modals
function closeModal() { roomModal.style.display = 'none'; }
function closeBookingModal() { bookingModal.style.display = 'none'; }
function closeServiceModal() { serviceModal.style.display = 'none'; }
function closeBillingModal() { billingModal.style.display = 'none'; }