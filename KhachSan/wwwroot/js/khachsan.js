
        // Dữ liệu dịch vụ mẫu cho từng phòng
    const servicesData = {
        "P101": [
    {id: "0000000001", name: "COCA", promotion: "AQUARIUS", unit: "Chai", quantity: 1, price: 15000, discount: 0, total: 15000, note: "" },
    {id: "0000000002", name: "REDBULL", promotion: "", unit: "Lon", quantity: 1, price: 15000, discount: 0, total: 15000, note: "" }
    ],
    "P102": [
    {id: "0000000003", name: "AQUA", promotion: "", unit: "Chai", quantity: 1, price: 15000, discount: 0, total: 15000, note: "" }
    ],
    "P201": [
    {id: "0000000004", name: "COCA", promotion: "", unit: "Chai", quantity: 1, price: 15000, discount: 0, total: 15000, note: "" }
    ],
    "P202": [],
    "P301": [],
    "P304": []
        };

    // Dữ liệu nhóm (mô phỏng bảng NhomDatPhong)
    const groupsData = [];

    // Dữ liệu thông báo (mô phỏng bảng ThongBao)
    const notificationsData = [
    {id: "TB001", sender: "NV02", title: "Giao ca", content: "Nhân viên NV02 đã giao ca cho bạn.", type: "GiaoCa", time: "22/03/2025 08:00:00", status: "ChuaDoc" },
    {id: "TB002", sender: "Hệ thống", title: "Cảnh báo", content: "Phòng P101 cần dọn dẹp.", type: "CanhBao", time: "22/03/2025 09:00:00", status: "ChuaDoc" },
    {id: "TB003", sender: "Hệ thống", title: "Thông báo", content: "Hệ thống sẽ bảo trì vào 23/03/2025.", type: "ThongBaoHeThong", time: "22/03/2025 10:00:00", status: "DaDoc" }
    ];

    // Lấy tất cả các phần tử
    const rooms = document.querySelectorAll('.room');
    const roomModal = document.getElementById('roomModal');
    const bookingModal = document.getElementById('bookingModal');
    const serviceModal = document.getElementById('serviceModal');
    const billingModal = document.getElementById('billingModal');
    const groupModal = document.getElementById('groupModal');
    const mergeBillModal = document.getElementById('mergeBillModal');
    const shiftEndModal = document.getElementById('shiftEndModal');
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
    const groupRoomSelection = document.getElementById('group-room-selection');
    const mergeGroupId = document.getElementById('merge-group-id');
    const mergeGroupName = document.getElementById('merge-group-name');
    const mergeGroupRepresentative = document.getElementById('merge-group-representative');
    const mergeGroupPhone = document.getElementById('merge-group-phone');
    const mergeBillRooms = document.getElementById('merge-bill-rooms');
    const mergeTotalServices = document.getElementById('merge-total-services');
    const mergeTotalRoom = document.getElementById('merge-total-room');
    const mergeTotal = document.getElementById('merge-total');
    const notificationDropdown = document.getElementById('notification-dropdown');
    const notificationCount = document.getElementById('notification-count');

    // Cập nhật thời gian thực
    function updateTime() {
            const now = new Date();
    const timeString = now.toLocaleString('vi-VN', {dateStyle: 'short', timeStyle: 'medium' });
    document.getElementById('current-time').textContent = timeString;
        }
    setInterval(updateTime, 1000);
    updateTime();

    // Cập nhật danh sách thông báo
    function updateNotifications() {
        notificationDropdown.innerHTML = '';
    let unreadCount = 0;
            notificationsData.forEach(notification => {
                if (notification.status === 'ChuaDoc') unreadCount++;
    notificationDropdown.innerHTML += `
    <div class="notification-item ${notification.status === 'ChuaDoc' ? 'unread' : ''}" onclick="markAsRead('${notification.id}')">
        <strong>${notification.title}</strong><br>
            ${notification.content}<br>
                <small>${notification.time}</small>
            </div>
            `;
            });
            notificationCount.textContent = unreadCount;
            notificationCount.style.display = unreadCount > 0 ? 'inline-block' : 'none';
        }
            updateNotifications();

            // Hiển thị/Ẩn dropdown thông báo
            function toggleNotifications() {
            const isVisible = notificationDropdown.style.display === 'block';
            notificationDropdown.style.display = isVisible ? 'none' : 'block';
        }

            // Đánh dấu thông báo là đã đọc
            function markAsRead(notificationId) {
            const notification = notificationsData.find(n => n.id === notificationId);
            if (notification) {
                notification.status = 'DaDoc';
            updateNotifications();
                // Gửi yêu cầu đến backend để cập nhật ThongBao.TrangThai
            }
        }

        // Nhấp 1 lần: Hiển thị modal chi tiết (phòng đang sử dụng) hoặc modal đặt phòng (phòng trống)
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
                        // Phòng đang sử dụng: Hiển thị modal chi tiết
                        modalRoomId.textContent = roomId;
                        modalCustomer.textContent = customer;
                        modalType.textContent = type;
                        modalPrice.textContent = price;
                        modalStatus.textContent = status;
                        modalCurrent.textContent = current;
                        roomModal.style.display = 'block';
                        bookingModal.style.display = 'none';
                        serviceModal.style.display = 'none';
                        groupModal.style.display = 'none';
                        mergeBillModal.style.display = 'none';
                        shiftEndModal.style.display = 'none';
                    } else {
                        // Phòng trống: Hiển thị modal đặt phòng
                        bookingRoomId.textContent = roomId;
                        bookingModal.style.display = 'block';
                        roomModal.style.display = 'none';
                        serviceModal.style.display = 'none';
                        groupModal.style.display = 'none';
                        mergeBillModal.style.display = 'none';
                        shiftEndModal.style.display = 'none';
                    }
                });

            // Nhấp 2 lần: Hiển thị modal tính tiền (chỉ cho phòng đang sử dụng)
            room.addEventListener('dblclick', () => {
                const isOccupied = room.classList.contains('occupied');
            if (!isOccupied) return;

            const roomId = room.getAttribute('data-room-id');
            const billId = room.getAttribute('data-bill-id');
            const staff = room.getAttribute('data-staff');
            const checkin = room.getAttribute('data-checkin');
            const price = room.getAttribute('data-price').replace(/[^0-9]/g, '');

            billingBillId.textContent = billId;
            billingStaff.textContent = staff;
            billingCheckin.textContent = checkin;
            billingCheckout.textContent = new Date().toLocaleString('vi-VN', {dateStyle: 'short', timeStyle: 'medium' });

            const services = servicesData[roomId] || [];
            billingServices.innerHTML = '';
            let totalServices = 0;
                services.forEach(service => {
                totalServices += service.total;
            billingServices.innerHTML += `
            <tr>
                <td>${service.id}</td>
                <td>${service.name}</td>
                <td>${service.promotion}</td>
                <td>${service.unit}</td>
                <td>${service.quantity}</td>
                <td>${service.price.toLocaleString()}đ</td>
                <td>${service.discount}%</td>
                <td>${service.total.toLocaleString()}đ</td>
                <td>${service.note}</td>
            </tr>
            `;
                });

            billingTotalServices.textContent = totalServices.toLocaleString() + 'đ';
            billingDiscount.textContent = '0đ';
            billingRoomPrice.textContent = price.toLocaleString() + 'đ';
            billingServiceFee.textContent = '0đ';
            const total = parseInt(price) + totalServices;
            billingTotal.textContent = total.toLocaleString() + 'đ';
            billingFinal.textContent = total.toLocaleString() + 'đ';
            billingPrepaid.textContent = '0đ';

            billingModal.style.display = 'block';
            roomModal.style.display = 'none';
            bookingModal.style.display = 'none';
            serviceModal.style.display = 'none';
            groupModal.style.display = 'none';
            mergeBillModal.style.display = 'none';
            shiftEndModal.style.display = 'none';
            });
        });

            // Mở modal thêm dịch vụ
            function openServiceModal() {
            const roomId = modalRoomId.textContent;
            serviceRoomId.textContent = roomId;
            serviceModal.style.display = 'block';
        }

            // Mở modal thêm vào nhóm
            function openGroupModal() {
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
            roomModal.style.display = 'none';
            bookingModal.style.display = 'none';
            serviceModal.style.display = 'none';
            mergeBillModal.style.display = 'none';
            shiftEndModal.style.display = 'none';
        }

            // Mở modal gộp hóa đơn
            function openMergeBillModal() {
            if (groupsData.length === 0) {
                alert('Chưa có nhóm nào để gộp hóa đơn!');
            return;
            }

            const group = groupsData[0]; // Lấy nhóm đầu tiên (có thể thêm select để chọn nhóm)
            mergeGroupId.textContent = group.id;
            mergeGroupName.textContent = group.name;
            mergeGroupRepresentative.textContent = group.representative;
            mergeGroupPhone.textContent = group.phone;

            mergeBillRooms.innerHTML = '';
            let totalServices = 0;
            let totalRoom = 0;
            group.rooms.forEach(roomId => {
                const room = Array.from(rooms).find(r => r.getAttribute('data-room-id') === roomId);
            if (room) {
                    const price = parseInt(room.getAttribute('data-price').replace(/[^0-9]/g, ''));
            const billId = room.getAttribute('data-bill-id');
            const services = servicesData[roomId] || [];
            let roomServicesTotal = 0;
                    services.forEach(service => {
                roomServicesTotal += service.total;
                    });
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

            mergeBillModal.style.display = 'block';
            roomModal.style.display = 'none';
            bookingModal.style.display = 'none';
            serviceModal.style.display = 'none';
            groupModal.style.display = 'none';
            shiftEndModal.style.display = 'none';
        }

            // Mở modal kết ca
            function openShiftEndModal() {
                document.getElementById('shift-end').textContent = new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'medium' });
            shiftEndModal.style.display = 'block';
            roomModal.style.display = 'none';
            bookingModal.style.display = 'none';
            serviceModal.style.display = 'none';
            groupModal.style.display = 'none';
            mergeBillModal.style.display = 'none';
        }

            // Đóng modal chi tiết
            function closeModal() {
                roomModal.style.display = 'none';
        }

            // Đóng modal đặt phòng
            function closeBookingModal() {
                bookingModal.style.display = 'none';
        }

            // Đóng modal thêm dịch vụ
            function closeServiceModal() {
                serviceModal.style.display = 'none';
        }

            // Đóng modal tính tiền
            function closeBillingModal() {
                billingModal.style.display = 'none';
        }

            // Đóng modal thêm vào nhóm
            function closeGroupModal() {
                groupModal.style.display = 'none';
        }

            // Đóng modal gộp hóa đơn
            function closeMergeBillModal() {
                mergeBillModal.style.display = 'none';
        }

            // Đóng modal kết ca
            function closeShiftEndModal() {
                shiftEndModal.style.display = 'none';
        }

            // Quét CCCD (mô phỏng)
            function scanCCCD() {
                // Mô phỏng quét CCCD (có thể tích hợp webcam hoặc API)
                document.getElementById('cccd-number').value = '123456789';
            document.getElementById('customer-name').value = 'Trần Quốc Đông';
            document.getElementById('customer-address').value = '123 Đường ABC, TP.HCM';
            document.getElementById('customer-nationality').value = 'Việt Nam';
        }

            // Xử lý đặt phòng
            function bookRoom() {
            const roomId = bookingRoomId.textContent;
            const bookingType = document.getElementById('booking-type').value;
            const cccdNumber = document.getElementById('cccd-number').value;
            const customerName = document.getElementById('customer-name').value;
            const customerAddress = document.getElementById('customer-address').value;
            const customerNationality = document.getElementById('customer-nationality').value;

            if (!cccdNumber || !customerName || !customerAddress || !customerNationality) {
                alert('Vui lòng nhập đầy đủ thông tin khách hàng!');
            return;
            }

            // Cập nhật trạng thái phòng
            const room = Array.from(rooms).find(r => r.getAttribute('data-room-id') === roomId);
            room.classList.add('occupied');
            room.querySelector('.status').textContent = 'Đang sử dụng';
            room.querySelector('.door-icon').classList.remove('fa-door-closed');
            room.querySelector('.door-icon').classList.add('fa-door-open');
            room.setAttribute('data-customer', customerName);
            room.setAttribute('data-checkin', new Date().toLocaleString('vi-VN', {dateStyle: 'short', timeStyle: 'medium' }));

            console.log(`Đặt phòng ${roomId} theo ${bookingType} cho khách ${customerName} (CCCD: ${cccdNumber})`);
            // Logic đặt phòng: Gửi yêu cầu đến backend để tạo bản ghi trong KhachHangLuuTru và DatPhong
            closeBookingModal();
        }

            // Thêm dịch vụ
            function addService() {
            const roomId = serviceRoomId.textContent;
            const serviceSelect = document.getElementById('service-name').value.split('|');
            const serviceName = serviceSelect[0];
            const servicePrice = parseInt(serviceSelect[1]);
            const quantity = parseInt(document.getElementById('service-quantity').value);
            const total = servicePrice * quantity;

            // Tạo ID ngẫu nhiên cho dịch vụ mới
            const serviceId = '000000' + (Math.floor(Math.random() * 10000)).toString().padStart(4, '0');

            // Thêm dịch vụ vào servicesData
            if (!servicesData[roomId]) {
                servicesData[roomId] = [];
            }
            servicesData[roomId].push({
                id: serviceId,
            name: serviceName,
            promotion: "",
            unit: serviceName === "MI_GOI" || serviceName === "BANH_NGOT" ? "Gói" : "Chai",
            quantity: quantity,
            price: servicePrice,
            discount: 0,
            total: total,
            note: ""
            });

            console.log(`Đã thêm dịch vụ ${serviceName} (x${quantity}) cho phòng ${roomId}`);
            // Logic thêm dịch vụ: Gửi yêu cầu đến backend để cập nhật DatPhong.MaDichVu và TongTienDichVu
            closeServiceModal();
        }

            // Thêm vào nhóm
            function addToGroup() {
            const groupName = document.getElementById('group-name').value;
            const representative = document.getElementById('group-representative').value;
            const phone = document.getElementById('group-phone').value;
            const selectedRooms = Array.from(document.querySelectorAll('#group-room-selection input:checked')).map(input => input.value);

            if (!groupName || !representative || !phone || selectedRooms.length === 0) {
                alert('Vui lòng nhập đầy đủ thông tin và chọn ít nhất một phòng!');
            return;
            }

            const groupId = 'GRP' + (groupsData.length + 1).toString().padStart(3, '0');
            groupsData.push({
                id: groupId,
            name: groupName,
            representative: representative,
            phone: phone,
            rooms: selectedRooms
            });

            console.log(`Đã tạo nhóm ${groupName} với các phòng: ${selectedRooms.join(', ')}`);
            // Logic thêm nhóm: Gửi yêu cầu đến backend để tạo bản ghi trong NhomDatPhong
            closeGroupModal();
        }

            // Gộp hóa đơn
            function mergeBill() {
            const groupId = mergeGroupId.textContent;
            const total = mergeTotal.textContent;
            console.log(`Thanh toán hóa đơn gộp cho nhóm ${groupId}: ${total}`);
            // Logic gộp hóa đơn: Gửi yêu cầu đến backend để tạo HoaDon với MaNhomDatPhong
            closeMergeBillModal();
        }

            // Xử lý tính tiền
            function processPayment() {
            const roomId = billingBillId.textContent;
            const total = billingTotal.textContent;
            const note = billingNote.value;

            // Cập nhật trạng thái phòng
            const room = Array.from(rooms).find(r => r.getAttribute('data-room-id') === roomId);
            room.classList.remove('occupied');
            room.querySelector('.status').textContent = 'Trống';
            room.querySelector('.door-icon').classList.remove('fa-door-open');
            room.querySelector('.door-icon').classList.add('fa-door-closed');

            console.log(`Thanh toán cho phòng ${roomId}: ${total}, Ghi chú: ${note}`);
            // Logic thanh toán: Gửi yêu cầu đến backend để tạo HoaDon và cập nhật DatPhong.TrangThai
            closeBillingModal();
        }

            // Xử lý kết ca
            function endShift() {
            const nextStaff = document.getElementById('next-staff').value;
            const note = document.getElementById('shift-note').value;

            // Tạo thông báo giao ca
            const notificationId = 'TB' + (notificationsData.length + 1).toString().padStart(3, '0');
            notificationsData.push({
                id: notificationId,
            sender: 'NV01',
            title: 'Giao ca',
            content: `Nhân viên NV01 đã giao ca cho bạn. Ghi chú: ${note}`,
            type: 'GiaoCa',
            time: new Date().toLocaleString('vi-VN', {dateStyle: 'short', timeStyle: 'medium' }),
            status: 'ChuaDoc'
            });

            updateNotifications();
            console.log(`Đã kết ca và giao cho nhân viên ${nextStaff}. Ghi chú: ${note}`);
            // Logic kết ca: Gửi yêu cầu đến backend để cập nhật CaLamViec và tạo ThongBao
            closeShiftEndModal();
        }

        // Đóng modal khi nhấp ra ngoài
        window.addEventListener('click', (event) => {
            if (event.target === roomModal) {
                closeModal();
            }
            if (event.target === bookingModal) {
                closeBookingModal();
            }
            if (event.target === serviceModal) {
                closeServiceModal();
            }
            if (event.target === billingModal) {
                closeBillingModal();
            }
            if (event.target === groupModal) {
                closeGroupModal();
            }
            if (event.target === mergeBillModal) {
                closeMergeBillModal();
            }
            if (event.target === shiftEndModal) {
                closeShiftEndModal();
            }
            if (!event.target.closest('.notification')) {
                notificationDropdown.style.display = 'none';
            }
        });
// Chuyển hướng đến action DangXuat
function logout() {
    window.location.href = '/TaiKhoan/DangXuat';
}

// Chuyển hướng đến action DoiMatKhau
function changePassword() {
    window.location.href = '/TaiKhoan/DoiMatKhau';
}