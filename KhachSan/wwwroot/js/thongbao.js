let notificationsData = [];

document.addEventListener('DOMContentLoaded', function () {
    loadNotifications();
    checkStuckShifts();
    setInterval(checkStuckShifts, 60 * 60 * 1000); // Gọi định kỳ mỗi 1 giờ
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

function continueLoadingNotifications(maNhanVien) {
    fetch(`http://localhost:5284/api/KhachSanAPI/notifications/unread?maNhanVien=${maNhanVien}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            const dropdown = document.getElementById('notification-dropdown');
            const countElement = document.getElementById('notification-count');
            dropdown.innerHTML = '';

            if (data.success && data.notifications && data.notifications.length > 0) {
                notificationsData = data.notifications;
                countElement.textContent = data.unreadCount;
                data.notifications.forEach(notification => {
                    const item = document.createElement('div');
                    item.className = 'notification-item';
                    item.setAttribute('data-id', notification.maThongBao);
                    item.innerHTML = `
                        <strong>${notification.tieuDe}</strong>
                        <p>${notification.noiDung}</p>
                        <small>${new Date(notification.thoiGianGui).toLocaleString('vi-VN')}</small>
                    `;
                    item.addEventListener('click', () => markAsRead(notification.maThongBao, item));
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
    fetch(`http://localhost:5284/api/KhachSanAPI/notifications/mark-read/${maThongBao}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                element.classList.add('read');
                const countElement = document.getElementById('notification-count');
                countElement.textContent = data.unreadCount;
                loadNotifications();
            } else {
                alert(data.message || 'Có lỗi xảy ra khi đánh dấu thông báo!');
            }
        })
        .catch(error => {
            console.error('Lỗi khi đánh dấu thông báo:', error);
            alert('Lỗi khi đánh dấu thông báo!');
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