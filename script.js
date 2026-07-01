let cart = [];
let ordersHistory = JSON.parse(localStorage.getItem('ordersHistory')) || [];

// تحديث السجل عند فتح التطبيق
updateHistoryUI();

function addToCart() {
    const name = document.getElementById('prod-name').value.trim();
    const price = parseFloat(document.getElementById('prod-price').value);
    const qty = parseInt(document.getElementById('prod-qty').value);

    if (!name || isNaN(price) || price <= 0 || isNaN(qty) || qty <= 0) {
        alert('الرجاء إدخال بيانات المنتج بشكل صحيح!');
        return;
    }

    const itemTotal = price * qty;
    cart.push({ name, price, qty, total: itemTotal });
    
    // إعادة تعيين الحقول لسرعة الإدخال التالي
    document.getElementById('prod-name').value = '';
    document.getElementById('prod-price').value = '';
    document.getElementById('prod-qty').value = '1';

    updateCartUI();
}

function updateCartUI() {
    const tbody = document.getElementById('cart-table-body');
    tbody.innerHTML = '';
    let total = 0;

    cart.forEach((item) => {
        total += item.total;
        tbody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.qty}</td>
                <td>${item.total.toFixed(2)}</td>
            </tr>
        `;
    });

    document.getElementById('cart-total').innerText = total.toFixed(2);
}

function clearCart() {
    cart = [];
    updateCartUI();
}

function saveAndPrintOrder() {
    if (cart.length === 0) {
        alert('السلة فارغة! أضف منتجات أولاً للطلب.');
        return;
    }

    const total = parseFloat(document.getElementById('cart-total').innerText);
    const now = new Date();
    const dateStr = now.toLocaleDateString('ar-SA') + ' ' + now.toLocaleTimeString('ar-SA');

    const order = {
        date: dateStr,
        items: cart,
        total: total
    };

    // حفظ في السجل المحلي مؤقتاً
    ordersHistory.unshift(order);
    localStorage.setItem('ordersHistory', JSON.stringify(ordersHistory));

    // 🖨️ تجهيز الفاتورة للطباعة الحرارية
    document.getElementById('receipt-date').innerText = `التاريخ: ${dateStr}`;
    const receiptItemsContainer = document.getElementById('receipt-items');
    receiptItemsContainer.innerHTML = '';

    cart.forEach(item => {
        receiptItemsContainer.innerHTML += `
            <div class="receipt-line">
                <span>${item.name} (x${item.qty})</span>
                <span>${item.total.toFixed(2)} ريال</span>
            </div>
        `;
    });
    document.getElementById('receipt-total-val').innerText = `${total.toFixed(2)} ريال`;

    // استدعاء نافذة الطباعة التلقائية للجوال لتتصل بالطابعة المحمولة
    setTimeout(() => {
        window.print();
        // تفريغ السلة وتحديث السجل بعد الطباعة
        cart = [];
        updateCartUI();
        updateHistoryUI();
    }, 500);
}

function updateHistoryUI() {
    const container = document.getElementById('orders-history');
    container.innerHTML = '';

    ordersHistory.forEach((order) => {
        container.innerHTML += `
            <div class="order-card" style="border-right: 4px solid #2ecc71;">
                <p style="margin: 0; font-size: 12px; color: #7f8c8d;">📅 ${order.date}</p>
                <p style="margin: 5px 0; font-weight: bold;">إجمالي الفاتورة: ${order.total.toFixed(2)} ريال</p>
                <span style="font-size: 13px; color: #555;">عدد القطع: ${order.items.length}</span>
            </div>
        `;
    });
}

function clearHistory() {
    if (confirm('هل أنت متأكد من مسح جميع الفواتير السابقة من السجل؟')) {
        ordersHistory = [];
        localStorage.removeItem('ordersHistory');
        updateHistoryUI();
    }
}
