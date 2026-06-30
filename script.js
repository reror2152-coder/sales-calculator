// مصفوفة لتخزين عناصر الطلب الحالي
let currentOrder = [];
// مصفوفة لتخزين سجل الطلبات السابقة (تحمل البيانات من الذاكرة المحلية إن وجدت)
let orderHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];

// ربط عناصر الواجهة
const itemNameInput = document.getElementById('itemName');
const itemPriceInput = document.getElementById('itemPrice');
const itemQtyInput = document.getElementById('itemQty');
const addBtn = document.getElementById('addBtn');
const orderItemsContainer = document.getElementById('orderItems');
const finalTotalText = document.getElementById('finalTotal');
const clearBtn = document.getElementById('clearBtn');
const saveOrderBtn = document.getElementById('saveOrderBtn');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// تشغيل عرض السجل عند فتح التطبيق لأول مرة
renderHistory();

// حدث إضافة منتج للطلب الحالي
addBtn.addEventListener('click', () => {
    const name = itemNameInput.value.trim();
    const price = parseFloat(itemPriceInput.value);
    const qty = parseInt(itemQtyInput.value);

    if (!name || isNaN(price) || price <= 0 || isNaN(qty) || qty <= 0) {
        alert('الرجاء إدخال بيانات المنتج بشكل صحيح.');
        return;
    }

    // إضافة المنتج للمصفوفة
    currentOrder.push({ id: Date.now(), name, price, qty });
    
    // إعادة تعيين المدخلات
    itemNameInput.value = '';
    itemPriceInput.value = '';
    itemQtyInput.value = '1';

    updateOrderTable();
});

// تحديث جدول الطلب الحالي
function updateOrderTable() {
    orderItemsContainer.innerHTML = '';
    let total = 0;

    currentOrder.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price.toFixed(2)} ريال</td>
            <td>${item.qty}</td>
            <td>${itemTotal.toFixed(2)} ريال</td>
            <td><button class="delete-item-btn" onclick="deleteCurrentItem(${item.id})">❌</button></td>
        `;
        orderItemsContainer.appendChild(row);
    });

    finalTotalText.innerText = `${total.toFixed(2)} ريال`;
}

// حذف عنصر من الطلب الحالي
window.deleteCurrentItem = function(id) {
    currentOrder = currentOrder.filter(item => item.id !== id);
    updateOrderTable();
};

// تفريغ الطلب الحالي (السلة)
clearBtn.addEventListener('click', () => {
    if (confirm('هل أنت متأكد من تفريغ السلة الحالية؟')) {
        currentOrder = [];
        updateOrderTable();
    }
});

// حفظ وإغلاق الطلب الحالي وترحيله للسجل
saveOrderBtn.addEventListener('click', () => {
    if (currentOrder.length === 0) {
        alert('السلة فارغة! لا يمكن حفظ طلب فارغ.');
        return;
    }

    const total = currentOrder.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const timestamp = new Date().toLocaleString('ar-EG', { hour12: true });

    // إنشاء كائن الطلب المحفوظ
    const savedOrder = {
        id: Date.now(),
        time: timestamp,
        total: total,
        itemsCount: currentOrder.reduce((sum, item) => sum + item.qty, 0)
    };

    // إضافة للسجل وحفظه بالذاكرة المحلية
    orderHistory.unshift(savedOrder); // يوضع في البداية ليظهر كأحدث طلب
    localStorage.setItem('salesHistory', JSON.stringify(orderHistory));

    // تفريغ السلة الحالية وتحديث العرض
    currentOrder = [];
    updateOrderTable();
    renderHistory();
    alert('تم حفظ الطلب بنجاح في السجل!');
});

// عرض سجل الطلبات
function renderHistory() {
    historyList.innerHTML = '';

    if (orderHistory.length === 0) {
        historyList.innerHTML = '<p class="empty-msg">لا توجد طلبات مسجلة بعد.</p>';
        return;
    }

    orderHistory.forEach(order => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <span class="history-time">📅 ${order.time}</span>
            <div class="history-total">إجمالي الفاتورة: ${order.total.toFixed(2)} ريال</div>
            <small style="color: #7f8c8d;">عدد القطع: ${order.itemsCount}</small>
        `;
        historyList.appendChild(div);
    });
}

// مسح السجل بالكامل
clearHistoryBtn.addEventListener('click', () => {
    if (confirm('هل أنت متأكد من حذف السجل بالكامل؟ لا يمكن التراجع عن هذا الإجراء.')) {
        orderHistory = [];
        localStorage.removeItem('salesHistory');
        renderHistory();
    }
});
