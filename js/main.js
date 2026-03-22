/* 
    Sweet Trio Bakery - Main JavaScript (Phase 3: Mini Cart, Checkout, 7 Products)
*/

$(document).ready(function () {

    // =====================
    // SCROLL ANIMATIONS
    // =====================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) $(entry.target).addClass('visible');
            else $(entry.target).removeClass('visible');
        });
    }, { threshold: 0.15 });

    $('.fade-in').each(function () { observer.observe(this); });

    // Khai báo currentPath toàn file
    let currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (!currentPath || currentPath === '') currentPath = 'index.html';

    // =====================
    // TOAST NOTIFICATION SYSTEM
    // =====================
    window.showNotification = function (type, title, message) {
        let icon = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', warning: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill' }[type] || 'bi-info-circle-fill';

        if ($('#toastContainer').length === 0) {
            $('body').append('<div id="toastContainer" class="custom-toast-container"></div>');
        }

        let $toast = $(`
            <div class="custom-toast ${type}">
                <div class="custom-toast-header">
                    <h5 class="custom-toast-title"><i class="bi ${icon}"></i> ${title}</h5>
                    <span class="custom-toast-close">&times;</span>
                </div>
                <div class="custom-toast-body">${message}</div>
            </div>
        `);
        $('#toastContainer').append($toast);

        $toast.find('.custom-toast-close').click(function () {
            $toast.fadeOut(300, function () { $toast.remove(); });
        });
        setTimeout(() => $toast.fadeOut(300, function () { $toast.remove(); }), 4500);
    };

    // =====================
    // NAVBAR AUTH STATE
    // =====================
    window.updateNavbar = function () {
        let user = JSON.parse(localStorage.getItem('cakeShopUser'));
        if (user) {
            $('#authNavContainer').hide();
            $('#avatarNavContainer').show();
            let avatar = localStorage.getItem('userAvatar');
            $('#avatarDropdown').html(avatar
                ? `<img src="${avatar}" alt="Avatar" class="rounded-circle avatar-img" width="30" height="30">`
                : `<i class="bi bi-person-circle fs-5"></i>`
            );
        } else {
            $('#authNavContainer').show();
            $('#avatarNavContainer').hide();
        }
    };
    updateNavbar();

    // =====================
    // LOGOUT
    // =====================
    window.handleLogout = function (e) {
        if (e) e.preventDefault();
        localStorage.removeItem('cakeShopUser');
        updateNavbar();
        showNotification('info', 'Đã Đăng Xuất', 'Bạn đã đăng xuất thành công. Hẹn gặp lại!');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    };

    // =====================
    // CART UTILITIES
    // =====================
    const CART_KEY = 'cakeShopCartVi';

    function getCart() { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

    function formatVND(amount) { return amount.toLocaleString('vi-VN') + ' VNĐ'; }

    window.syncCartState = function () {
        let cart = getCart();
        let totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
        $('#cartBadgeCount').text(totalQty);
        renderMiniCart(cart);
    };
    syncCartState();

    // =====================
    // MINI CART DROPDOWN
    // =====================
    function renderMiniCart(cart) {
        let $items = $('#miniCartItems');
        let $total = $('#miniCartTotal');
        if (!$items.length) return;

        if (!cart || cart.length === 0) {
            $items.html(`
                <div class="text-center py-4 text-muted">
                    <i class="bi bi-cart-x fs-2 d-block mb-2"></i>
                    Giỏ hàng đang trống
                </div>
            `);
            $total.text('0 VNĐ');
            return;
        }

        let html = '';
        let subtotal = 0;
        cart.forEach(item => {
            let lineTotal = item.price * item.qty;
            subtotal += lineTotal;
            html += `
                <div class="d-flex align-items-center py-2 border-bottom">
                    <img src="${item.img}" alt="${item.name}" class="rounded" style="width:48px;height:48px;object-fit:cover;flex-shrink:0;">
                    <div class="ms-2 flex-grow-1 overflow-hidden">
                        <div class="text-truncate fw-bold small">${item.name}</div>
                        <div class="text-muted small">${item.qty} x ${formatVND(item.price)}</div>
                    </div>
                    <div class="ms-2 small fw-bold text-nowrap" style="color: var(--accent-color);">${formatVND(lineTotal)}</div>
                </div>
            `;
        });
        $items.html(html);
        $total.text(formatVND(subtotal));
    }

    // Populate mini cart when dropdown opens
    $(document).on('show.bs.dropdown', '#cartNavContainer', function () {
        renderMiniCart(getCart());
    });

    // =====================
    // ADD TO CART
    // =====================
    $('.add-to-cart-btn').click(function (e) {
        e.preventDefault();
        let name = $('.breadcrumb-item.active').text().trim() || $('h2').first().text().trim() || 'Bánh Ngọt';
        let priceText = $('h3.product-detail-price').text().trim() || '0';
        let price = parseInt(priceText.replace(/\D/g, '')) || 0;
        let qty = parseInt($('#qty').val()) || 1;
        let img = $('.img-fluid.rounded').first().attr('src') || 'images/cake1.jpg';

        let cart = getCart();
        let existing = cart.find(i => i.name === name);
        if (existing) existing.qty += qty;
        else cart.push({ id: Date.now(), name, price, qty, img });

        saveCart(cart);
        syncCartState();
        showNotification('success', 'Thêm Thành Công! 🛒', `Đã thêm <strong>${qty}x ${name}</strong> vào giỏ hàng!`);
    });

    // =====================
    // CART PAGE
    // =====================
    window.renderCart = function () {
        let cart = getCart();
        let $tbody = $('#cartTableBody');
        if (!$tbody.length) return;
        $tbody.empty();
        let subtotal = 0;

        if (cart.length === 0) {
            $tbody.html(`
                <tr><td colspan="5" class="text-center py-5">
                    <i class="bi bi-cart-x text-muted" style="font-size:4rem;"></i>
                    <h4 class="mt-3" style="color:var(--heading-color);">Giỏ hàng trống</h4>
                    <p class="text-muted">Hãy chọn thêm bánh ngọt của chúng tôi nhé!</p>
                    <a href="products.html" class="btn btn-primary-custom mt-2">Xem Sản Phẩm</a>
                </td></tr>
            `);
            $('#checkoutBtn').prop('disabled', true);
            $('#cartSubtotal, #cartTotal').text('0 VNĐ');
            return;
        }

        $('#checkoutBtn').prop('disabled', false);

        cart.forEach(item => {
            let lineTotal = item.price * item.qty;
            subtotal += lineTotal;
            $tbody.append(`
                <tr>
                    <td class="p-3 align-middle">
                        <div class="d-flex align-items-center">
                            <img src="${item.img}" alt="${item.name}" class="rounded shadow-sm border me-3" style="width:65px;height:65px;object-fit:cover;">
                            <span class="fw-bold">${item.name}</span>
                        </div>
                    </td>
                    <td class="p-3 align-middle text-muted">${formatVND(item.price)}</td>
                    <td class="p-3 align-middle">
                        <div class="input-group input-group-sm mx-auto" style="width:110px;">
                            <button class="btn btn-outline-secondary qty-minus" data-id="${item.id}">-</button>
                            <input type="text" class="form-control text-center bg-white fw-bold" value="${item.qty}" readonly>
                            <button class="btn btn-outline-secondary qty-plus" data-id="${item.id}">+</button>
                        </div>
                    </td>
                    <td class="p-3 fw-bold align-middle text-end" style="color:var(--accent-color);">${formatVND(lineTotal)}</td>
                    <td class="p-3 align-middle text-center">
                        <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `);
        });

        $('#cartSubtotal, #cartTotal').text(formatVND(subtotal));

        $('.qty-minus').click(function () {
            let cart = getCart(); let item = cart.find(i => i.id == $(this).data('id'));
            if (item && item.qty > 1) { item.qty--; saveCart(cart); renderCart(); syncCartState(); }
        });
        $('.qty-plus').click(function () {
            let cart = getCart(); let item = cart.find(i => i.id == $(this).data('id'));
            if (item) { item.qty++; saveCart(cart); renderCart(); syncCartState(); }
        });
        $('.remove-item').click(function () {
            let cart = getCart().filter(i => i.id != $(this).data('id'));
            saveCart(cart); renderCart(); syncCartState();
            showNotification('info', 'Đã Xóa', 'Sản phẩm đã được xóa khỏi giỏ hàng.');
        });
    };

    // =====================
    // CHECKOUT PAGE
    // =====================
    if (currentPath === 'cart.html') {
        renderCart();
        // Override checkout button => go to checkout.html
        $('#checkoutBtn').off('click').click(function () {
            window.location.href = 'checkout.html';
        });
    }

    if (currentPath === 'checkout.html') {
        // Pre-fill from logged-in user
        let user = JSON.parse(localStorage.getItem('cakeShopUser'));
        if (user) {
            $('#coName').val(user.name || '');
            $('#coEmail').val(user.email || '');
            $('#coPhone').val(user.phone || '');
            $('#coAddress').val(user.address || '');
        }

        // Render right sidebar cart
        function renderCheckoutSidebar() {
            let cart = getCart();
            let $items = $('#checkoutCartItems');
            $items.empty();
            let subtotal = 0;
            if (cart.length === 0) {
                $items.html('<p class="text-muted">Giỏ hàng trống.</p>');
            }
            cart.forEach(item => {
                let lt = item.price * item.qty;
                subtotal += lt;
                $items.append(`
                    <div class="d-flex align-items-center mb-3">
                        <img src="${item.img}" alt="${item.name}" class="rounded" style="width:50px;height:50px;object-fit:cover;flex-shrink:0;">
                        <div class="ms-2 flex-grow-1">
                            <div class="small fw-bold text-truncate">${item.name}</div>
                            <div class="small text-muted">x${item.qty}</div>
                        </div>
                        <div class="small fw-bold" style="color:var(--accent-color);">${formatVND(lt)}</div>
                    </div>
                `);
            });
            $('#checkoutSubtotal, #checkoutTotal').text(formatVND(subtotal));
        }
        renderCheckoutSidebar();

        function setStep(step) {
            ['#checkoutStep1', '#checkoutStep2', '#checkoutStep3'].forEach((s, i) => $(s).toggle(i + 1 === step));
            ['#stepDot1', '#stepDot2', '#stepDot3'].forEach((d, i) => {
                $(d).toggleClass('active', i + 1 === step).toggleClass('done', i + 1 < step);
            });
        }

        // STEP 1 → STEP 2
        $('#checkoutInfoForm').submit(function (e) {
            e.preventDefault();
            let cart = getCart();
            if (cart.length === 0) {
                showNotification('warning', 'Giỏ Hàng Trống', 'Vui lòng thêm sản phẩm trước khi thanh toán.');
                return;
            }

            let name = $('#coName').val(), email = $('#coEmail').val(), phone = $('#coPhone').val(), address = $('#coAddress').val(), note = $('#coNote').val();

            // Build items summary
            let itemsHtml = '<div class="table-responsive"><table class="table table-sm mb-3"><thead class="table-light"><tr><th>Sản phẩm</th><th class="text-end">Thành tiền</th></tr></thead><tbody>';
            let total = 0;
            cart.forEach(i => { let lt = i.price * i.qty; total += lt; itemsHtml += `<tr><td>${i.name} x ${i.qty}</td><td class="text-end fw-bold" style="color:var(--accent-color);">${formatVND(lt)}</td></tr>`; });
            itemsHtml += `</tbody><tfoot><tr class="fw-bold border-top"><td>Tổng cộng</td><td class="text-end fs-6" style="color:var(--accent-color);">${formatVND(total)}</td></tr></tfoot></table></div>`;

            let customerHtml = `
                <h6 class="fw-bold mb-3"><i class="bi bi-person-check me-2"></i>Thông Tin Giao Hàng</h6>
                <div class="row g-2 text-sm">
                    <div class="col-6"><span class="text-muted">Họ tên:</span> <strong>${name}</strong></div>
                    <div class="col-6"><span class="text-muted">Email:</span> <strong>${email}</strong></div>
                    <div class="col-6"><span class="text-muted">Điện thoại:</span> <strong>${phone}</strong></div>
                    <div class="col-12"><span class="text-muted">Địa chỉ:</span> <strong>${address}</strong></div>
                    ${note ? `<div class="col-12"><span class="text-muted">Ghi chú:</span> <em>${note}</em></div>` : ''}
                </div>
            `;

            $('#confirmOrderItems').html(itemsHtml);
            $('#confirmCustomerInfo').html(customerHtml);
            setStep(2);
            $('html, body').animate({ scrollTop: 0 }, 400);
        });

        // Back to step 1
        $('#backToStep1Btn').click(function () { setStep(1); });

        // STEP 2 → Place Order
        $('#placeOrderBtn').click(function () {
            localStorage.removeItem(CART_KEY);
            syncCartState();
            showNotification('success', 'Đặt Hàng Thành Công! 🎉', 'Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ sớm nhất. Hẹn gặp lại!');
            setTimeout(() => { window.location.href = 'index.html'; }, 2500);
        });
    }

    // =====================
    // HOMEPAGE SEARCH (REDIRECT)
    // =====================
    // From index.html: redirect to products.html?search=<keyword>
    window.handleSearchRedirect = function () {
        let query = $('#searchInput').val().trim();
        if (query) {
            window.location.href = 'products.html?search=' + encodeURIComponent(query);
        }
        return false;
    };

    // =====================
    // CATEGORY FILTER (products.html)
    // =====================
    if (currentPath === 'products.html') {
        $('#categoryMenu a').click(function (e) {
            e.preventDefault();
            const filter = $(this).data('filter');
            if (!filter) return;

            // Ẩn banner khi click vào category pill
            $('#searchResultBanner').addClass('d-none');

            // Active pill styling
            $('#categoryMenu a').removeClass('category-pill-active').addClass('category-pill-outline');
            $(this).removeClass('category-pill-outline').addClass('category-pill-active');

            // Show/hide cards
            if (filter === 'All') {
                $('.cake-card').closest('[data-category]').fadeIn(300);
            } else {
                $('.cake-card').closest('[data-category]').hide().each(function () {
                    if ($(this).data('category') === filter) {
                        $(this).fadeIn(300);
                    }
                });
            }
        });

        // On products.html: read query string and auto-filter
        const params = new URLSearchParams(window.location.search);
        const searchQuery = params.get('search');

        if (searchQuery) {
            const keyword = searchQuery.trim();
            let count = 0;

            // Lọc sản phẩm
            $('.cake-card').each(function () {
                const title = $(this).find('.card-title').text().toLowerCase();
                const category = $(this).find('.small.text-muted').text().toLowerCase();
                const match = title.includes(keyword.toLowerCase()) || category.includes(keyword.toLowerCase());
                $(this).closest('[class*="col-"]').toggle(match);
                if (match) count++;
            });

            // Hiển thị banner thông báo
            const $banner = $('#searchResultBanner');
            if (count > 0) {
                $banner.html(`
                    <div class="d-flex justify-content-between align-items-center px-4 py-2 rounded-pill" style="background:#ffd6e0; color:#4a0020; font-size:0.95rem;">
                        <span>Hiển thị kết quả tìm kiếm cho: <strong>"${keyword}"</strong> — Tìm thấy <strong>${count}</strong> sản phẩm</span>
                        <a href="products.html" class="ms-3 text-decoration-none fw-bold" style="color:#4a0020;">✕ Xóa tìm kiếm</a>
                    </div>
                `).removeClass('d-none');
            } else {
                $banner.html(`
                    <div class="d-flex justify-content-between align-items-center px-4 py-2 rounded-pill" style="background:#f8d7da; color:#721c24; font-size:0.95rem;">
                        <span>Không tìm thấy sản phẩm nào cho: <strong>"${keyword}"</strong></span>
                        <a href="products.html" class="ms-3 text-decoration-none fw-bold" style="color:#721c24;">✕ Xóa tìm kiếm</a>
                    </div>
                `).removeClass('d-none');
            }
        }
    }

    // Fallback: local filter on index.html (instant keyup)
    window.handleSearch = function () {
        let query = $('#searchInput').val().toLowerCase().trim();
        let found = false;
        $('.product-item').each(function () {
            let match = $(this).data('name').toLowerCase().includes(query);
            $(this).toggle(match);
            if (match) found = true;
        });
        $('#noResultMessage').toggleClass('d-none', found);
        return false;
    };
    $('#searchInput').on('keyup', handleSearch);

    // =====================
    // REGISTRATION FORM
    // =====================
    $('#registerForm').submit(function (e) {
        e.preventDefault();
        let btn = $(this).find('button[type="submit"]'), orig = btn.html();
        btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang xử lý...');
        setTimeout(() => {
            let name = $('#fullName').val().trim(), email = $('#email').val().trim();
            let pwd = $('#password').val(), cpwd = $('#confirmPassword').val();
            let phone = $('#phone').val().trim(), dob = $('#dob').val(), gender = $('#gender').val(), address = $('#address').val().trim();
            let errors = [];

            if (!name) errors.push('Họ và Tên là bắt buộc.');
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Email không hợp lệ.');
            if (pwd.length < 6) errors.push('Mật khẩu phải có ít nhất 6 ký tự.');
            if (pwd !== cpwd) errors.push('Mật khẩu không khớp.');
            if (!/^0\d{9}$/.test(phone)) errors.push('Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.');
            if (!dob) errors.push('Ngày sinh không được để trống.');

            if (errors.length) {
                showNotification('error', 'Đăng Ký Thất Bại', '<ul class="mb-0">' + errors.map(e => `<li>${e}</li>`).join('') + '</ul>');
                btn.prop('disabled', false).html(orig); return;
            }
            let users = JSON.parse(localStorage.getItem('cakeShopUsers')) || [];
            if (users.some(u => u.email === email)) {
                showNotification('error', 'Email Đã Tồn Tại', 'Tài khoản với email này đã được đăng ký.'); btn.prop('disabled', false).html(orig); return;
            }
            users.push({ name, email, password: pwd, phone, dob, gender, address });
            localStorage.setItem('cakeShopUsers', JSON.stringify(users));
            showNotification('success', 'Đăng Ký Thành Công!', 'Vui lòng xem lại thông tin bên dưới.');

            // Show summary card instead of immediate redirect
            $('#registerForm').hide();
            $('#registerSummaryContainer').removeClass('d-none').html(`
                <div class="text-center mb-4">
                    <i class="bi bi-person-check text-success" style="font-size: 4rem;"></i>
                    <h4 class="mt-3" style="color: var(--heading-color);">Đăng Ký Thành Công!</h4>
                    <p class="text-muted">Thông tin tài khoản của bạn</p>
                </div>
                <div class="card bg-light border-0 mb-4 shadow-sm">
                    <div class="card-body px-4 py-3">
                        <div class="row py-2 border-bottom"><div class="col-5 text-muted fw-bold">Họ tên:</div><div class="col-7">${name}</div></div>
                        <div class="row py-2 border-bottom"><div class="col-5 text-muted fw-bold">Email:</div><div class="col-7">${email}</div></div>
                        <div class="row py-2 border-bottom"><div class="col-5 text-muted fw-bold">Số điện thoại:</div><div class="col-7">${phone}</div></div>
                        <div class="row py-2 border-bottom"><div class="col-5 text-muted fw-bold">Ngày sinh:</div><div class="col-7">${dob}</div></div>
                        <div class="row py-2 border-bottom"><div class="col-5 text-muted fw-bold">Giới tính:</div><div class="col-7">${gender}</div></div>
                        <div class="row py-2"><div class="col-5 text-muted fw-bold">Địa chỉ:</div><div class="col-7">${address || '<em>Chưa cập nhật</em>'}</div></div>
                    </div>
                </div>
                <div class="d-grid mt-4">
                    <a href="login.html" class="btn btn-primary-custom btn-lg">Đến Trang Đăng Nhập <i class="bi bi-arrow-right ms-2"></i></a>
                </div>
            `);
        }, 1200);
    });

    // =====================
    // LOGIN FORM
    // =====================
    $('#loginForm').submit(function (e) {
        e.preventDefault();
        let btn = $(this).find('button[type="submit"]'), orig = btn.html();
        btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang xử lý...');
        setTimeout(() => {
            let email = $('#loginEmail').val().trim(), pwd = $('#loginPassword').val();
            if (!email || !pwd) { showNotification('error', 'Lỗi', 'Vui lòng nhập email và mật khẩu.'); btn.prop('disabled', false).html(orig); return; }
            let users = JSON.parse(localStorage.getItem('cakeShopUsers')) || [];
            let user = users.find(u => u.email === email && u.password === pwd);
            if (user) {
                localStorage.setItem('cakeShopUser', JSON.stringify(user));
                showNotification('success', `Chào ${user.name}! 👋`, 'Đăng nhập thành công. Đang chuyển hướng...');
                updateNavbar();
                setTimeout(() => window.location.href = 'index.html', 1500);
            } else {
                showNotification('error', 'Đăng Nhập Thất Bại', 'Email hoặc mật khẩu không đúng.');
                btn.prop('disabled', false).html(orig);
            }
        }, 1200);
    });

    // =====================
    // PROFILE PAGE
    // =====================
    if (currentPath === 'profile.html') {
        let user = JSON.parse(localStorage.getItem('cakeShopUser'));
        if (!user) { showNotification('warning', 'Chưa Đăng Nhập', 'Bạn cần đăng nhập để xem hồ sơ.'); setTimeout(() => window.location.href = 'login.html', 1500); return; }
        $('#profileName').val(user.name); $('#profileEmail').val(user.email);
        $('#profilePhone').val(user.phone || ''); $('#profileDob').val(user.dob || ''); $('#profileAddress').val(user.address || '');
        $('#displayUserName').text(user.name); $('#displayUserEmail').text(user.email);
        let savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) $('#profileAvatarPreview').attr('src', savedAvatar);

        $('#avatarUpload').change(function (e) {
            let file = e.target.files[0];
            if (!file) return;
            let reader = new FileReader();
            reader.onload = function (ev) {
                $('#profileAvatarPreview').attr('src', ev.target.result);
                localStorage.setItem('userAvatar', ev.target.result);
                showNotification('success', 'Cập Nhật Ảnh', 'Ảnh đại diện đã được thay đổi.'); updateNavbar();
            };
            reader.readAsDataURL(file);
        });

        window.handleProfileSave = function () {
            user.name = $('#profileName').val(); user.phone = $('#profilePhone').val(); user.dob = $('#profileDob').val(); user.address = $('#profileAddress').val();
            localStorage.setItem('cakeShopUser', JSON.stringify(user));
            $('#displayUserName').text(user.name);
            let users = JSON.parse(localStorage.getItem('cakeShopUsers')) || [];
            let idx = users.findIndex(u => u.email === user.email);
            if (idx !== -1) { users[idx] = { ...users[idx], ...user }; localStorage.setItem('cakeShopUsers', JSON.stringify(users)); }
            showNotification('success', 'Đã Lưu', 'Thông tin hồ sơ đã được cập nhật!'); updateNavbar();
        };
    }

    // =====================
    // PRODUCT REVIEWS
    // =====================
    function updateStarsUI(selector, val) {
        $(selector).each(function () {
            $(this).toggleClass('bi-star-fill', $(this).data('value') <= val).toggleClass('bi-star', $(this).data('value') > val);
        });
    }

    window.renderReviews = function (productName) {
        let reviews = JSON.parse(localStorage.getItem(`reviews_${productName}`)) || [];
        let $list = $('#reviewsList');
        if (!$list.length) return;
        if (reviews.length === 0) { $list.html('<p class="text-muted" id="noReviewsMsg">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>'); return; }
        $list.empty();
        reviews.forEach(r => {
            let stars = [...Array(5)].map((_, i) => `<i class="bi ${i < r.rating ? 'bi-star-fill' : 'bi-star'} text-warning"></i>`).join('');
            $list.append(`<div class="card border-0 bg-light p-3 rounded shadow-sm">
                <div class="d-flex justify-content-between mb-1"><strong>${r.name}</strong><small class="text-muted">${r.date}</small></div>
                <div class="mb-2">${stars}</div>
                <p class="mb-0 text-secondary">${r.comment}</p>
            </div>`);
        });
    };

    if (currentPath.includes('sanpham')) {
        let productName = $('.breadcrumb-item.active').text().trim();
        let savedRating = localStorage.getItem(`rating_${productName}`);
        if (savedRating) updateStarsUI('#interactiveRating .rating-star', parseInt(savedRating));

        $('#interactiveRating .rating-star').click(function () {
            let val = $(this).data('value');
            updateStarsUI('#interactiveRating .rating-star', val);
            localStorage.setItem(`rating_${productName}`, val);
            showNotification('success', 'Đánh Giá', `Bạn đã đánh giá ${val} sao, cảm ơn!`);
        });

        $('#reviewRatingStars .form-star').click(function () {
            let val = $(this).data('value'); updateStarsUI('#reviewRatingStars .form-star', val); $('#reviewRatingInput').val(val);
        });

        $('#reviewForm').submit(function (e) {
            e.preventDefault();
            let rating = parseInt($('#reviewRatingInput').val());
            if (!rating) { showNotification('warning', 'Thiếu Xếp Hạng', 'Vui lòng chọn số sao trước khi gửi.'); return; }
            let reviews = JSON.parse(localStorage.getItem(`reviews_${productName}`)) || [];
            reviews.unshift({ name: $('#reviewerName').val(), rating, comment: $('#reviewComment').val(), date: new Date().toLocaleDateString('vi-VN') });
            localStorage.setItem(`reviews_${productName}`, JSON.stringify(reviews));
            showNotification('success', 'Đánh Giá Đã Gửi', 'Cảm ơn bạn đã chia sẻ cảm nhận!');
            $('#reviewerName, #reviewComment').val(''); $('#reviewRatingInput').val(''); updateStarsUI('#reviewRatingStars .form-star', 0);
            renderReviews(productName);
        });

        renderReviews(productName);
    }

    // =====================
    // ACTIVE NAV LINK (auto-detect from pathname)
    // =====================
    (function setActiveNav() {
        let page = window.location.pathname.split('/').pop() || 'index.html';
        // Map product detail pages to products.html
        let navMap = { 'index.html': 'index.html', 'about.html': 'about.html', 'products.html': 'products.html', 'news.html': 'news.html', 'contact.html': 'contact.html' };
        let activeHref = navMap[page];
        if (!activeHref && page.startsWith('sanpham')) activeHref = 'products.html';
        if (!activeHref && page === 'cart.html') activeHref = null; // no highlight
        if (!activeHref && page === 'checkout.html') activeHref = null;

        if (activeHref) {
            $('.navbar-nav .nav-link').each(function () {
                if ($(this).attr('href') === activeHref) {
                    $(this).addClass('active fw-bold');
                }
            });
        }
    })();
});
