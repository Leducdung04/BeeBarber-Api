const startDate = document.getElementById("start-date-i");
const endDate = document.getElementById("end-date-i");
const startDateString = document.getElementById("startDate");
const endDateString = document.getElementById("endDate");
const startDateError = document.getElementById("startDateError")
const endDateError = document.getElementById("endDateError")
function validate(){
   let isCheck = true
   if(startDateString.value.trim()===''){
    startDateError.textContent= "*Chưa chọn ngày bắt đầu"
    isCheck = false
  }else{
    startDateError.textContent=""
    isCheck = true
  }
  if(endDateString.value.trim()===''){
    endDateError.textContent= "*Chưa chọn ngày kết thúc"
    isCheck = false
  }else{
    endDateError.textContent =""
    isCheck = true
  }
 
  return isCheck
}
$(document).ready(function () {
  let chart = null
  $(startDate).datepicker({
    format: "dd/mm/yyyy",
    autoclose: true,
    todayHighlight: true,
    orientation: "bottom",
  });

  $(startDate).on("changeDate", function (e) {
    const selectDate = e.date;
    const formatedDate = formatDate(selectDate);
    startDateString.value = formatedDate;
    $(startDate).datepicker("hide");
  });

  $(endDate).datepicker({
    format: "dd/mm/yyyy",
    autoclose: true,
    todayHighlight: true,
    orientation: "bottom",
  });

  $(endDate).on("changeDate", function (e) {
    const selectDate = e.date;
    const formatedDate = formatDate(selectDate);
    endDateString.value = formatedDate;
    $(endDate).datepicker("hide");
  });

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0"); 
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  document
    .getElementById("showCalendarBtn")
    .addEventListener("click", function (e) {
      e.preventDefault();
      const parts = startDateString.value.split("-").join("");
      const numberStartdate = parseInt(parts, 10);
      const parts2 = endDateString.value.split("-").join("");
      const numberEnddate = parseInt(parts2, 10);
      console.log(startDateString.value, endDateString.value);
      if(!validate()){
        return
      }
      if (numberStartdate >= numberEnddate ) {
        alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
        return;
      }
      fetch(`/api/revenue?startDate=${new Date(startDateString.value)}&endDate=${new Date(endDateString.value)}`)
      .then(res => res.json())
      .then(data => {
        if(data.message ==="successfully"){
          document.getElementById("result_total").textContent=`Doanh thu từ ${startDateString.value} đến ${endDateString.value} là: ${data.total.toLocaleString()} VNĐ`
          document.getElementById("result_total").style.fontWeight ='bold' 
          document.getElementById("title").textContent = "Sản phẩm đã bán"
          
          if(chart){
            chart.destroy()
          }
          const ctx = document.getElementById('priceChart').getContext('2d');
         
           chart = new Chart(ctx, {
              type: 'bar',
              data: {
                  labels: data.labels,
                  datasets: [
                    {
                      label: 'Prices by Date',
                      data: data.prices,
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1,
                      barThickness: 30,
                      yAxisID: 'yLeft',
                    },
                    {
                      label: 'Products Sold',
                      data: data.products, 
                      backgroundColor: 'rgba(153, 102, 255, 0.2)',
                      borderColor: 'rgba(153, 102, 255, 1)',
                      borderWidth: 1,
                      barThickness: 30,
                      yAxisID: 'yRight',
                    }
                  ]
              },
              options: {
                responsive: true,
                scales: {
                  yLeft: {
                    beginAtZero: true,
                    position: 'left',
                    ticks: {
                      callback: function (value) {
                        return value.toLocaleString() + ' VNĐ'; 
                      },
                    },
                    title: {
                      display: true,
                      text: 'Doanh thu (VNĐ)',
                    },
                  },
                  yRight: {
                    beginAtZero: true,
                    position: 'right',
                    ticks: {
                      stepSize: 5,
                      callback: function (value) {
                        return value.toLocaleString() + ' sản phẩm'; 
                      },
                    },
                    title: {
                      display: true,
                      text: 'Số lượng sản phẩm đã bán',
                    },
                    grid: {
                      drawOnChartArea: false, 
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Ngày',
                    },
                  },
                },
              },
          });
          const productSoltOut = data.uniqueProduct.map((product) => `
        <div class="col-lg-4 mb-4 text-center">
          <div class="product-entry border">
            <a class="prod-img">
              <img src="${product.image}" class="img-fluid" alt="Fstyle shop">
            </a>
            <div class="desc">
              <h4 class="line-clamp"><a href="#">${product.name}</a></h4>
              <span class="price">Giá: ${product.price.toLocaleString()} VNĐ</span>
              <span class="price">Số lượng đã bán: ${product.soldQuantity}</span>
            </div>
          </div>
        </div>
        `
          )
          .join("");
    
        document.getElementById("product-list-sold-out").innerHTML = productSoltOut;
        }else{
          alert(data.message)
        }
      })
    });
});
