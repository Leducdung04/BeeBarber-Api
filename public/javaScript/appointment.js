let appointmentsData = [];
let appointmentStatusId = null

async function fetchAppointments() {
    const response = await fetch('api/getAppointmentsAdmin');
    const data = await response.json();
    appointmentsData = data;
    displayAppointments(data);
}

function displayAppointments(appointments) {
    const appointmentsList = document.getElementById('appointments-list');
    appointmentsList.innerHTML = '';

    appointments.forEach(appointment => {
        const appointmentDiv = document.createElement('div');
        appointmentDiv.classList.add('appointment');

        // Appointment header with Barber's image
        const appointmentHeader = document.createElement('div');
        appointmentHeader.classList.add('appointment-header');
        appointmentHeader.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between;">
        <img style=" border-radius: 50%; width: 80px; height: 80px; margin-right: 15px;" src="${appointment.barber_id.image || './img/barberBackgroug.png'}" alt="${appointment.barber_id.name}">
        <h3>Barber ${appointment.barber_id.name}</h3>
    </div>
    <span style="margin-left:24px">Time ${new Date(appointment.appointment_date).toLocaleDateString()} - ${appointment.appointment_time}</span>
`;
        appointmentDiv.appendChild(appointmentHeader);

        // Appointment details
        const appointmentDetails = document.createElement('div');
        appointmentDetails.classList.add('appointment-details');
        const serviceNames = appointment.service_id.map(service => service.name).join(', ');
        appointmentDetails.innerHTML = `
    <div style="display: flex;flex-direction: column; "><strong>Người đặt: ${appointment.user_id.name}</strong><strong>${appointment.user_id.phone}</strong></div>
    <div><strong>Dịch vụ:</strong> ${serviceNames}</div>
    <div style="color:orange;"><strong style="color: gray;">Tổng tiền:</strong> ${appointment.price.toLocaleString()} VND</div>
    <div><strong>Phương thức:</strong> ${appointment.payment.pay_method}</div>
`;
        appointmentDiv.appendChild(appointmentDetails);

        // Appointment footer (action buttons)
        const appointmentFooter = document.createElement('div');
        appointmentFooter.classList.add('appointment-footer');

        // Trạng thái và nút hành động
        if (appointment.appointment_status === 'pending') {
            appointmentFooter.innerHTML = `
                <span style="color: orange;">Đang chờ</span>
                <button class="btn btn-pending" onclick="handleFetchAndRender('${appointment._id}')">Chi Tiết</button>
            `;
        } else if (appointment.appointment_status === 'inuse') {
            appointmentFooter.innerHTML = `
                <span style="color: green;">Đang Thực Hiện</span> 
                <button class="btn btn-pending" onclick="handleFetchAndRender('${appointment._id}')">Chi Tiết</button>
            `;
        } else if (appointment.appointment_status === 'complete_payment') {
            appointmentFooter.innerHTML = `
                <span style="color: green;">Hoàn thành Thanh Toán</span> 
                <button class="btn btn-pending" onclick="handleFetchAndRender('${appointment._id}')">Chi Tiết</button>
            `;
        } else if (appointment.appointment_status === 'completed') {
            appointmentFooter.innerHTML = `
                <span style="color: blue;">Hoàn Thành</span>
            `;
        } else if (appointment.appointment_status === 'canceled') {
            appointmentFooter.innerHTML = `
            <span style="color: red;">Đã hủy</span>
            <button class="btn btn-danger" onclick="processRefund('${appointment.payment._id}')">Hoàn Tiền</button>
            `;
        }

        appointmentDiv.appendChild(appointmentFooter);

        // Append the appointment to the list
        appointmentsList.appendChild(appointmentDiv);
    });
}

function markAsComplete(appointmentId) {
    alert(`Đã đánh dấu lịch hẹn ${appointmentId} là đã cắt xong.`);
}

function markAsPending(appointmentId) {
    alert(`Vui lòng kiểm đúng số tiền thu trước khi hoàn thành.`);
    fetch(`/api/updateAppointmentStatusAdmin/${appointmentId}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ appointment_status: 'completed', pay_method_status: 'Success' }),
        }
    ).then(() => {
        fetchAppointments();
    })
}

function processRefund(paymentId, userId) {
    const userConfirmed = window.confirm(`Xác nhận hoàn tiền vui lòng kiểm tra kỹ`);
    if (userConfirmed) {
        fetch(`/api/updateAppointmentStatusAdmin/${paymentId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ appointment_status: 'refunded', pay_method_status: 'Refunded' }),
            }
        ).then(() => {
            fetchAppointments();
        })
    }
}

function filterByToday() {
    const today = new Date().toLocaleDateString();
    const todayAppointments = appointmentsData.filter(appointment => {
        return new Date(appointment.appointment_date).toLocaleDateString() === today;
    });
    displayAppointments(todayAppointments);
}

function showAllAppointments() {
    displayAppointments(appointmentsData);
}

fetchAppointments()

async function fetchAppointmentDetail(appointmentId) {
    try {
        const response = await fetch(`/api/getAppointmentAdminById/${appointmentId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch appointment details: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Appointment Details:', data);
        return data;
    } catch (error) {
        console.error('Error fetching appointment details:', error.message);
        return null;
    }
}

function renderAppointmentDetail(data) {
    appointmentStatusId = data._id
    console.log(appointmentStatusId);

    const appointmentInfoModal = new bootstrap.Modal(document.getElementById('appointmentInfoModal'));

    if (!data) {
        console.error('Không có dữ liệu');
        return;
    }

    document.getElementById('idDisplay').textContent = data._id;
    document.getElementById('statusDisplay').textContent = data.appointment_status;
    document.getElementById('appointmentDateDisplay').textContent = `${new Date(data.appointment_date).toLocaleString()}`;;
    document.getElementById('appointmentTimeDisplay').textContent = data.appointment_time;
    document.getElementById('stylistDisplay').textContent = data.barber_id.name;

    if (data.timeCompleted) {
         document.getElementById('timeCompletedDisplay').textContent = `${new Date(data.timeCompleted).toLocaleString()}`
    } else {
         document.getElementById('timeCompletedDisplay').textContent = ``
    }

    if (data.timeCanceled) {
        document.getElementById('timeCanceledDisplay').textContent = `${new Date(data.timeCanceled).toLocaleString()}`
    } else {
        document.getElementById('timeCanceledDisplay').textContent = ``;
    }


    document.getElementById('idUserDisplay').textContent = data.user_id.name
    document.getElementById('userPhoneDisplay').textContent = data.user_id.phone
    document.getElementById('idPaymentDisplay').textContent = data.payment._id
    document.getElementById('payMethodDisplay').textContent = data.payment.pay_method
    const payMethodStatusMap = {
        Unpaid: 'Chưa thanh toán',
        Success: 'Đã thanh toán',
        canceled: 'Đã hủy lịch',
    };

    const payMethodStatusText = payMethodStatusMap[data.payment.pay_method_status] || 'Trạng thái không xác định';
    document.getElementById('payMethodStatusDisplay').textContent = payMethodStatusText;
    document.getElementById('timeDisplay').textContent = data.payment.time
    document.getElementById('dateDisplay').textContent = data.payment.date
    document.getElementById('priceDisplay').textContent = `${data.price.toLocaleString()} VNĐ`;

    const statusDisplay = document.getElementById('statusDisplay');
    const statusSelect = document.getElementById('statusSelect');
    const statusOptions = {
        pending: [
            { value: 'inuse', label: 'Đang Thực Hiện' },
            { value: 'canceled', label: 'Hủy' },
        ],
        inuse: [
            { value: 'complete_payment', label: 'Hoàn Thành Thanh Toán' },
        ],
        complete_payment: [
            { value: 'completed', label: 'Hoàn Thành' }
        ],
        completed: [],
        canceled: [],
    };

    statusSelect.innerHTML = '';
    if (statusOptions[data.appointment_status]) {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.hidden = true;
        defaultOption.textContent = 'Chọn trạng thái';
        statusSelect.appendChild(defaultOption);

        statusOptions[data.appointment_status].forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            statusSelect.appendChild(optionElement);
        });
    } else {
        statusSelect.disabled = true;
    }


    let statusText;
    switch (data.appointment_status) {
        case 'pending': statusText = 'Chờ xác nhận'; break;
        case 'inuse': statusText = 'Đang Thực Hiện'; break;
        case 'complete_payment': statusText = 'Hoàn Thành Thanh Toán'; break;
        case 'completed': statusText = 'Hoàn Thành'; break;
        case 'canceled': statusText = 'Hủy'; break;
        default: statusText = 'Trạng thái không xác định';
    }
    statusDisplay.textContent = `${statusText}`;


    statusSelect.addEventListener('change', function () {
        const newStatus = this.value;
        $("#confirmModal").modal("show");
    });

    appointmentInfoModal.show()
}

async function handleFetchAndRender(appointmentId) {
    const appointmentData = await fetchAppointmentDetail(appointmentId);
    renderAppointmentDetail(appointmentData);
}

$(document).ready(function () {
    $("#confirmStatusBtn").click(function () {
        var newStatus = $("#statusSelect").val();
        if (!newStatus) {
            showAlert("error", "Vui lòng chọn trạng thái để cập nhật.");
            return;
        }
        $.ajax({
            url: `/api/updateAppointmentStatus/${appointmentStatusId}`,
            type: "PUT",
            data: { 
                appointment_status: newStatus 
            },
            success: function (response) {
                showAlert("success", "Trạng thái đơn hàng đã được cập nhật thành công!");
                reloadPage()
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

