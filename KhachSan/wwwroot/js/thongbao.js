let notificationsData = [];

document.addEventListener('DOMContentLoaded', function () {
    loadNotifications();
    checkStuckShifts();
    setInterval(checkStuckShifts, 120 * 60 * 1000); // Gọi định kỳ mỗi 1 giờ
});

function loadNotifications() {
    let maNhanVien = localStorage.getItem('maNhanVien');
    if (!maNhanVien) {
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
                    maNhanVien = data.user.maNguoiDung;
                    localStorage.setItem('maNhanVien', maNhanVien);
                    continueLoadingNotifications(maNhanVien);
                } else {
                    console.error('Không thể lấy MaNhanVien:', data.message);
                    const dropdown = document.getElementById('notification-dropdown');
                    if (dropdown) {
                        dropdown.innerHTML = '<p>Lỗi khi tải thông báo!</p>';
                    }
                }
            })
            .catch(error => {
                console.error('Lỗi khi lấy MaNhanVien:', error);
                const dropdown = document.getElementById('notification-dropdown');
                if (dropdown) {
                    dropdown.innerHTML = '<p>Lỗi khi tải thông báo!</p>';
                }
            });
    } else {
        continueLoadingNotifications(maNhanVien);
    }
}

// Đây là cách mà hàm continueLoadingNotifications có thể được cài đặt
function continueLoadingNotifications(maNhanVien) {
    console.log("Đang tải thông báo chưa đọc...");

    fetch(`http://localhost:5284/api/KhachSanAPI/notifications/unread`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log("Kết quả thông báo:", data);

            const dropdown = document.getElementById('notification-dropdown');
            const countElement = document.getElementById('notification-count');
            dropdown.innerHTML = '';

            if (data.success && data.notifications && data.notifications.length > 0) {
                notificationsData = data.notifications;
                countElement.textContent = data.unreadCount;

                data.notifications.forEach(notification => {
                    // Kiểm tra và sử dụng đúng cách đặt tên thuộc tính 
                    const notificationId = notification.MaThongBao || notification.maThongBao;
                    const title = notification.TieuDe || notification.tieuDe;
                    const content = notification.NoiDung || notification.noiDung;
                    const time = notification.ThoiGianGui || notification.thoiGianGui;

                    console.log("Thông báo ID:", notificationId);

                    const item = document.createElement('div');
                    item.className = 'notification-item';
                    item.setAttribute('data-id', notificationId);
                    item.innerHTML = `
                    <strong>${title}</strong>
                    <p>${content}</p>
                    <small>${new Date(time).toLocaleString('vi-VN')}</small>
                `;

                    // Truyền đúng ID khi click
                    item.addEventListener('click', () => {
                        console.log("Click vào thông báo ID:", notificationId);
                        markAsRead(notificationId, item);
                    });

                    dropdown.appendChild(item);
                });
            } else {
                countElement.textContent = '0';
                dropdown.innerHTML = '<p>Không có thông báo mới</p>';
            }
        })
        .catch(error => {
            console.error('Lỗi khi tải thông báo:', error);
            const dropdown = document.getElementById('notification-dropdown');
            if (dropdown) {
                dropdown.innerHTML = '<p>Lỗi khi tải thông báo!</p>';
            }
        });

        // Trong hàm continueLoadingNotifications
.then(data => {
    console.log("Raw data:", JSON.stringify(data));
    console.log("Notifications data:", data.notifications);
    if (data.notifications && data.notifications.length > 0) {
        console.log("First notification:", data.notifications[0]);
        console.log("Available fields:", Object.keys(data.notifications[0]));
    }
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedLoadNotifications = debounce(loadNotifications, 1000);

function toggleNotifications() {
    const dropdown = document.getElementById('notification-dropdown');
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        debouncedLoadNotifications();
        dropdown.style.display = 'block';
    }
}

function markAsRead(maThongBao, element) {
    console.log(`Đánh dấu đã đọc: ${maThongBao}`);

    // Kiểm tra ID trước khi gọi API
    if (!maThongBao) {
        console.error("ID thông báo không hợp lệ:", maThongBao);
        alert("Lỗi: ID thông báo không hợp lệ");
        return;
    }

    fetch(`http://localhost:5284/api/KhachSanAPI/notifications/mark-read/${maThongBao}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(response => {
            console.log("Nhận response:", response.status);
            return response.json();
        })
        .then(data => {
            console.log("Kết quả:", data);

            if (data.success) {
                console.log(`Đánh dấu thành công, trạng thái: ${data.status}`);

                // Xóa thông báo khỏi UI
                if (element && element.parentNode) {
                    element.remove();
                }

                // Lọc thông báo đã đọc khỏi mảng dữ liệu toàn cục
                if (notificationsData.length > 0) {
                    notificationsData = notificationsData.filter(notification => {
                        const notificationId = notification.MaThongBao || notification.maThongBao;
                        return notificationId != maThongBao;
                    });
                }

                // Cập nhật số thông báo chưa đọc
                const countElement = document.getElementById('notification-count');
                countElement.textContent = data.unreadCount;

                // Nếu không còn thông báo, hiển thị message
                const dropdown = document.getElementById('notification-dropdown');
                if (dropdown && (!dropdown.children.length || dropdown.children.length === 0)) {
                    dropdown.innerHTML = '<p>Không có thông báo mới</p>';
                }
            } else {
                console.error(`Lỗi: ${data.message}`);
                alert(data.message || 'Có lỗi xảy ra khi đánh dấu thông báo!');
                // Tải lại thông báo để đồng bộ UI với server
                loadNotifications();
            }
        })
        .catch(error => {
            console.error('Lỗi khi đánh dấu thông báo:', error);
            alert('Lỗi khi đánh dấu thông báo!');
            // Tải lại thông báo để đồng bộ UI với server
            loadNotifications();
        });
}

function checkStuckShifts() {
    fetch('http://localhost:5284/api/KhachSanAPI/check-stuck-shifts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data.message);
                loadNotifications(); // Tải lại thông báo sau khi kiểm tra ca bị kẹt
            } else {
                console.error('Lỗi khi kiểm tra ca bị kẹt:', data.message);
            }
        })
        .catch(error => {
            console.error('Lỗi khi kiểm tra ca bị kẹt:', error);
        });
}
// Thêm log để debug
.then(data => {
    console.log("Raw data:", JSON.stringify(data));
    console.log("Notifications data:", data.notifications);
    if (data.notifications && data.notifications.length > 0) {
        console.log("First notification:", data.notifications[0]);
        console.log("ID field name:", Object.keys(data.notifications[0]).find(key => key.toLowerCase().includes('thongbao')));
    }
// ...