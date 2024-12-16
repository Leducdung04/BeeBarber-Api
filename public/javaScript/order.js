// let orders = [];

// fetch("/api/orders")
//   .then((response) => response.json())
//   .then((data) => {
//     if (data.message === "All orders retrieved successfully") {
//       $(".cart .icon-shopping-cart").text(`Order[${data.orders.length}]`);
//       orders = data.orders;
//       displayOrder(orders);
//     }
//   })
//   .catch((error) => console.error("Error fetching orders:", error));

// function displayOrder(orders) {
//   const tableOrder = document.getElementById("order-table-body");
//   tableOrder.innerHTML = "";

//   orders.forEach((order) => {
//     const newRow = document.createElement("tr");
//     newRow.setAttribute("data-order-id", order._id);
//     let statusText = "";
//     let timeDisplay = "";
//     const orderTime = new Date(order.timeOrder);
//     const confirmTime = new Date(order.timeConfirm);
//     const deliveryTime = new Date(order.timeDelivery);
//     const cancelTime = new Date(order.timeCancel);
//     const successTime = new Date(order.timeSuccess);

//     switch (order.status) {
//       case "pending":
//         statusText = "Chờ xác nhận";
//         timeDisplay = orderTime.toLocaleString();
//         break;
//       case "active":
//         statusText = "Đã xác nhận";
//         timeDisplay = confirmTime.toLocaleString();
//         break;
//       case "deactive":
//         statusText = "Đã hủy";
//         timeDisplay = cancelTime.toLocaleString();
//         break;
//       case "trading":
//         statusText = "Đang giao";
//         timeDisplay = deliveryTime.toLocaleString();
//         break;
//       case "delivered":
//         statusText = "Đã giao";
//         timeDisplay = successTime.toLocaleString();
//         break;
//     }

//     newRow.innerHTML = `
//         <td class='h6'>${order._id}</td>
//         <td class='h6'>${order.idUser}</td>
//         <td class='h6'>${order.totalPrice} VNĐ</td>
//         <td class='h6'>${statusText}</td>
//         <td class='h6'>${timeDisplay}</td>
//         <td><a href="${order._id}" style="color: #007bff; text-decoration: none;">Chi tiết</a></td>
//         `;
//     tableOrder.appendChild(newRow);
//   });
// }

// document.addEventListener("DOMContentLoaded", function () {
//   const searchForm = document.querySelector(".search-wrap");

//   searchForm.addEventListener("submit", function (event) {
//     event.preventDefault();

//     const searchQuery = document
//       .getElementById("query-search-order")
//       .value.trim()
//       .toLowerCase();

//     const filteredOrders = orders.filter(function (order) {
//       return (
//         order._id.toLowerCase().includes(searchQuery) ||
//         order.idUser.toLowerCase().includes(searchQuery)
//       );
//     });

//     displayOrder(filteredOrders);
//   });
// });

let orderId = null;
let Orders = [];
let currentPage = 1;
const limit = 4;
// Fetch order data from API

fetch('api/getOrdersAdmin')
    .then(response => response.json())
    .then(data => {
        Orders = data
        renderOrders()
        renderPagination()
    })
    .catch(error => console.error('Error fetching orders:', error));

function renderOrders() {
    const orderList = document.getElementById('orderList');
    const orderInfoModal = new bootstrap.Modal(document.getElementById('orderInfoModal'));
    orderList.innerHTML = '';

    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = Orders.slice(startIndex, endIndex);

    paginatedOrders.forEach(order => {
        const orderDate = new Date(order.createdAt).toLocaleDateString();
        const statusBadge = getStatusBadge(order.status);

        const row = document.createElement('tr');
        row.onclick = () => {
            document.querySelectorAll('tr').forEach(r => r.classList.remove('selected-row'));
            row.classList.add('selected-row');
            viewOrderDetails(order);
            orderInfoModal.show();
        };

        row.innerHTML =
            `<td><img src="${order.listProduct[0].image}" alt="Ảnh"></td>
             <td>${order.listProduct[0].name}</td>
             <td>${order.total_price_sold.toLocaleString()} VND</td>
             <td>${orderDate}</td>
             <td>${order.location}</td>
             <td>${statusBadge}</td>`;

        orderList.appendChild(row);
    });
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(Orders.length / limit);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.className = i === currentPage ? 'active' : '';
        pageButton.onclick = () => {
            currentPage = i;
            renderOrders(); // Render selected page
        };
        paginationContainer.appendChild(pageButton);
    }
}


function getStatusBadge(status) {
    switch (status) {
        case "pending":
            return '<span class="status-badge bg-warning">Chờ xác nhận</span>';
        case "active":
            return '<span class="status-badge bg-info">Xác nhận</span>';
        case "trading":
            return '<span class="status-badge bg-info">Đang giao</span>';
        case "delivered":
            return '<span class="status-badge bg-success">Đã giao</span>';
        case "deactive":
            return '<span class="status-badge bg-danger">Đã hủy</span>';
    }
}

async function viewOrderDetails(order) {
    console.log(order.status);
    
    orderId = order._id;
    document.getElementById('idDisplay').textContent = order._id;
    document.getElementById('userIdDisplay').textContent = order.user_id.name;
    document.getElementById('addressDisplay').textContent = order.location;
    document.getElementById('userPhoneDisplay').textContent = order.user_id.phone;
    document.getElementById('totalPriceSoldDisplay').textContent = `${order.total_price_sold.toLocaleString()} VNĐ`;
    document.getElementById('paymentMethodDisplay').textContent = order.paymentMethod;

    const statusDisplay = document.getElementById('statusDisplay');
    const statusSelect = document.getElementById('statusSelect');
    const statusOptions = {
        pending: [{ value: 'active', label: 'Xác nhận' }, { value: 'deactive', label: 'Hủy' }],
        active: [{ value: 'trading', label: 'Đang giao' }, { value: 'deactive', label: 'Hủy' }],
        trading: [{ value: 'delivered', label: 'Đã giao' }],
        delivered: [],
        deactive: [],
    };

    statusSelect.innerHTML = '';
    if (statusOptions[order.status]) {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.hidden = true;
        defaultOption.textContent = 'Chọn trạng thái';
        statusSelect.appendChild(defaultOption);

        statusOptions[order.status].forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            statusSelect.appendChild(optionElement);
        });
    } else {
        statusSelect.disabled = true;
    }

    let statusText;
    switch (order.status) {
        case 'pending': statusText = 'Chờ xác nhận'; break;
        case 'active': statusText = 'Xác nhận'; break;
        case 'trading': statusText = 'Đang giao'; break;
        case 'delivered': statusText = 'Đã giao'; break;
        case 'deactive': statusText = 'Đã hủy'; break;
        default: statusText = 'Trạng thái không xác định';
    }
    statusDisplay.textContent = `${statusText}`;

    statusSelect.addEventListener('change', function () {
        const newStatus = this.value;
        $("#confirmModal").modal("show");
    });

    if (order.timeConfirm) {
        document.getElementById('confirmTimeDisplay').textContent = `${new Date(order.timeConfirm).toLocaleString()}`;
    } else {
        document.getElementById('confirmTimeDisplay').textContent = '';
    }

    if (order.timeDelivery) {
        document.getElementById('deliveryTimeDisplay').textContent = `${new Date(order.timeDelivery).toLocaleString()}`;
    } else {
        document.getElementById('deliveryTimeDisplay').textContent = '';
    }

    if (order.timeCancel) {
        document.getElementById('cancelTimeDisplay').textContent = `${new Date(order.timeCancel).toLocaleString()}`;
    } else {
        document.getElementById('cancelTimeDisplay').textContent = '';
    }

    if (order.timeSuccess) {
        document.getElementById('successTimeDisplay').textContent = `${new Date(order.timeSuccess).toLocaleString()}`;
    } else {
        document.getElementById('successTimeDisplay').textContent = '';
    }

    let shippingMethodText;
    switch (order.shippingMethod) {
        case 'standard':
            shippingMethodText = 'Giao hàng tiết kiệm';
            break;
        case 'express':
            shippingMethodText = 'Giao hàng nhanh';
            break;
        default:
            shippingMethodText = 'Phương thức không xác định';
    }
    document.getElementById('shippingMethodDisplay').textContent = shippingMethodText;

    const productDetailsContainer = document.getElementById('productDetails');
    productDetailsContainer.innerHTML = '';
    const productsPerPage = 2;
    let currentPage = 1;

    async function renderTable() {
        productDetailsContainer.innerHTML = '';

        const productDetailsMap = await fetchAllProductDetails();
    
        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;
        const productsToShow = order.listProduct.slice(start, end);
    
        productsToShow.forEach(product => {
            const productDetails = productDetailsMap[product.idProduct];
            console.log(productDetails);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${product.image}" alt="${product.name}" style="width: 55px; height: 55px;"></td>
                <td>${product.name}</td>
                <td>${product.price_selling.toLocaleString()} VNĐ</td>
                <td>${product.quantity}</td>
            `;
            productDetailsContainer.appendChild(row);
        });
    
        toggleButtonState();
    }

    function handlePrev() {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    }

    function handleNext() {
        const totalPages = Math.ceil(order.listProduct.length / productsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    }

    function toggleButtonState() {
        const totalPages = Math.ceil(order.listProduct.length / productsPerPage);
        document.querySelector('.nav-button.prev').disabled = currentPage === 1;
        document.querySelector('.nav-button.next').disabled = currentPage === totalPages;
    }

    document.querySelector('.nav-button.prev').addEventListener('click', handlePrev);
    document.querySelector('.nav-button.next').addEventListener('click', handleNext);

    renderTable();
}

async function fetchAllProductDetails() {
    try {
        const productIds = order.listProduct.map(product => product.idProduct);
        const productDetailsArray = await Promise.all(
            productIds.map(id => checkProductQuantity(id))
        );
        const productDetailsMap = {};
        productDetailsArray.forEach(details => {
            if (details && details.data) {
                productDetailsMap[details.data._id] = details.data;
            }
        });

        return productDetailsMap; 
    } catch (error) {
        console.error('Error fetching all product details:', error.message);
        return {};
    }
}

$(document).ready(function () {
    $("#confirmStatusBtn").click(function () {
        var confirmTime = $("#confirmTime").text();
        var deliveryTime = $("#deliveryTime").text();
        var cancelTime = $("#cancelTime").text();
        var newStatus = $("#statusSelect").val();
        if (!newStatus) {
            showAlert("error", "Vui lòng chọn trạng thái để cập nhật.");
            return;
        }
        $.ajax({
            url: `/api/updateOrderStatus/${orderId}`,
            type: "POST",
            data: { status: newStatus },
            success: function (response) {
                showAlert("success", "Trạng thái đơn hàng đã được cập nhật thành công!");
                $("#confirmModal").modal("hide");
                reloadPage();
            },
            error: function (err) {
                console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err);
                showAlert("error", "Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.");
                $("#confirmModal").modal("hide");
            },
        });
    });


    function reloadPage() {
        location.reload();
    }
    function showAlert(type, message) {
        const alertClass = type === "success" ? "alert-success" : "alert-danger";
        const alert = $('<div class="alert ' + alertClass + '" role="alert">' + message + "</div>");
        $("body").append(alert);
        setTimeout(function () {
            $(alert).remove();
        }, 5000);
    }
});
