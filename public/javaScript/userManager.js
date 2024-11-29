// const query_search = document.getElementById("query-search");
// const btn_search = document.getElementById("btn-search");
let dataUser = [];
getData()
function getData(){
  fetch("/api/user/get_all_user")
  .then((response) => response.json())
  .then((data) => {
    displayUser(data.data)
    dataUser = data.data
  })
  .catch((error) => console.error("Error fetching user:", error));
}
// btn_search.addEventListener("click", function (e) {
//   e.preventDefault();
//   const result_search = query_search.value.trim().toLowerCase();

//   const filteredCategories = dataIser.filter((category) => {
//     return category.name.toLowerCase().includes(result_search);
//   });

//   displayUser(filteredCategories);
// });

async function displayUser(users) {
  const tableBody = document.getElementById("user-list");
  tableBody.innerHTML = ""; // Xóa bảng hiện có để hiển thị kết quả tìm kiếm mới

 await users.forEach((user) => {
    const newRow = document.createElement("tr");
   
      newRow.innerHTML = `
                <td class="h5">${user.name}</td>
                <td class="h5">${user.email}</td>
                <td class="h5">${user.phone}</td>
                <td class="h5">${user.role}</td>
                <td class="h5">${user.isLocked ? 'Locked' : 'UnLocked'}</td>
                <td><a href="${user._id}"style="color:
       #007bff; font-size:15px; text-decoration: underline;"
       >${user.isLocked ? "Gỡ khóa" : "Khóa"}</a></td>`;
    
        tableBody.appendChild(newRow);
    });
}
// document.getElementById("add-category-btn").addEventListener('click', function(){
//     window.location.href ="addcategory";
// })
document.getElementById("user-list").addEventListener("click",async function (event) {
    if (event.target.tagName === "A") {
      event.preventDefault(); 
      const userId = await event.target.getAttribute("href");
      console.log(userId)
      $("#confirmModalUser").modal('show')
      $("#confirmProductBtn").click(function(){
        fetch(`/api/user/lock_user/${userId}`)
        .then(res => res.json())
        .then(data =>{
        if(data.message==="User locked status updated"){
          alert("update thành công")
          $("#confirmModalUser").modal('hide')
          window.location.replace("/user")
        }else if(data.message==="User not found"){
          alert("Không tìm thấy người dùng")
        }else{
          alert("Internal server error")
        }
        })
        
      })
     
    }
  });
