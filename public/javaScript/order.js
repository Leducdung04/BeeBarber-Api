let orders = [];

fetch("/api/orders")
  .then((response) => response.json())
  .then((data) => {
    if (data.message === "All orders retrieved successfully") {
      $(".cart .icon-shopping-cart").text(`Order[${data.orders.length}]`);
      orders = data.orders;
      displayOrder(orders);
    }
  })
  .catch((error) => console.error("Error fetching orders:", error));

function displayOrder(orders) {
  const tableOrder = document.getElementById("order-table-body");
  tableOrder.innerHTML = "";

  orders.forEach((order) => {
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-order-id", order._id);
    let statusText = "";
    let timeDisplay = "";
    const orderTime = new Date(order.timeOrder);
    const confirmTime = new Date(order.timeConfirm);
    const deliveryTime = new Date(order.timeDelivery);
    const cancelTime = new Date(order.timeCancel);
    const successTime = new Date(order.timeSuccess);

    switch (order.status) {
      case "pending":
        statusText = "Chờ xác nhận";
        timeDisplay = orderTime.toLocaleString();
        break;
      case "active":
        statusText = "Đã xác nhận";
        timeDisplay = confirmTime.toLocaleString();
        break;
      case "deactive":
        statusText = "Đã hủy";
        timeDisplay = cancelTime.toLocaleString();
        break;
      case "trading":
        statusText = "Đang giao";
        timeDisplay = deliveryTime.toLocaleString();
        break;
      case "delivered":
        statusText = "Đã giao";
        timeDisplay = successTime.toLocaleString();
        break;
    }

    newRow.innerHTML = `
        <td class='h6'>${order._id}</td>
        <td class='h6'>${order.idUser}</td>
        <td class='h6'>${order.totalPrice} VNĐ</td>
        <td class='h6'>${statusText}</td>
        <td class='h6'>${timeDisplay}</td>
        <td><a href="${order._id}" style="color: #007bff; text-decoration: none;">Chi tiết</a></td>
        `;
    tableOrder.appendChild(newRow);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.querySelector(".search-wrap");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const searchQuery = document
      .getElementById("query-search-order")
      .value.trim()
      .toLowerCase();

    const filteredOrders = orders.filter(function (order) {
      return (
        order._id.toLowerCase().includes(searchQuery) ||
        order.idUser.toLowerCase().includes(searchQuery)
      );
    });

    displayOrder(filteredOrders);
  });
});
