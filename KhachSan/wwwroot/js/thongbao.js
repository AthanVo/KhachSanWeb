let notificationsData = [];

document.addEventListener('DOMContentLoaded', function () {
    loadNotifications();
    checkStuckShifts();
    setInterval(checkStuckShifts, 120 * 60 * 1000); // Gọi định kỳ mỗi 2 giờ
});

function loadNotifications() {
    let maNhanVien = localStorage.getItem('maNhanVien');
    if (!maNhanVien) {
        fetch('https://localhost:5284/api/KhachSanAPI/current-user', {
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

function continueLoadingNotifications(maNhanVien) {
    console.log("Đang tải thông báo chưa đọc...");

    fetch(`https://localhost:5284/api/KhachSanAPI/notifications/unread`, {
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
            console.log("Kết quả thông báo:", data);
            console.log("Raw data:", JSON.stringify(data));
            console.log("Notifications data:", data.notifications);
            if (data.notifications && data.notifications.length > 0) {
                console.log("First notification:", data.notifications[0]);
                console.log("Available fields:", Object.keys(data.notifications[0]));
                console.log("ID field name:", Object.keys(data.notifications[0]).find(key => key.toLowerCase().includes('thongbao')));
            }

            const dropdown = document.getElementById('notification-dropdown');
            const countElement = document.getElementById('notification-count');
            dropdown.innerHTML = '';

            if (data.success && data.notifications && data.notifications.length > 0) {
                notificationsData = data.notifications;
                countElement.textContent = data.unreadCount;

                data.notifications.forEach(notification => {
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

    if (!maThongBao) {
        console.error("ID thông báo không hợp lệ:", maThongBao);
        alert("Lỗi: ID thông báo không hợp lệ");
        return;
    }

    fetch(`https://localhost:5284/api/KhachSanAPI/notifications/mark-read/${maThongBao}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then(response => {
            console.log("Nhận response:", response.status);
            if (!response.ok) {
                console.error(`Yêu cầu API thất bại: Status ${response.status}, StatusText: ${response.statusText}`);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Kết quả:", data);

            if (data.success) {
                console.log(`Đánh dấu thành công, trạng thái: ${data.status}`);

                if (element && element.parentNode) {
                    element.remove();
                }

                if (notificationsData.length > 0) {
                    notificationsData = notificationsData.filter(notification => {
                        const notificationId = notification.MaThongBao || notification.maThongBao;
                        return notificationId != maThongBao;
                    });
                }

                const countElement = document.getElementById('notification-count');
                countElement.textContent = data.unreadCount;

                const dropdown = document.getElementById('notification-dropdown');
                if (dropdown && (!dropdown.children.length || dropdown.children.length === 0)) {
                    dropdown.innerHTML = '<p>Không có thông báo mới</p>';
                }
            } else {
                console.error(`Lỗi: ${data.message}`);
                alert(data.message || 'Có lỗi xảy ra khi đánh dấu thông báo!');
                loadNotifications();
            }
        })
        .catch(error => {
            console.error('Lỗi khi đánh dấu thông báo:', error);
            alert('Lỗi khi đánh dấu thông báo!');
            loadNotifications();
        });
}

function checkStuckShifts() {
    fetch('https://localhost:5284/api/KhachSanAPI/check-stuck-shifts', {
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
                console.log(data.message);
                loadNotifications();
            } else {
                console.error('Lỗi khi kiểm tra ca bị kẹt:', data.message);
            }
        })
        .catch(error => {
            console.error('Lỗi khi kiểm tra ca bị kẹt:', error);
        });
}