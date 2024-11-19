const query_search = document.getElementById("query-search");
const btn_search = document.getElementById("btn-search");
let dataCategory = [];
getData()
function getData(){
  fetch("/api/get/categories_product",{ cache: "no-store" })
  .then((response) => response.json())
  .then((data) => {
    displayCategories(data.data)
    dataCategory = data.data
  })
  .catch((error) => console.error("Error fetching category:", error));
}
btn_search.addEventListener("click", function (e) {
  e.preventDefault();
  const result_search = query_search.value.trim().toLowerCase();

  const filteredCategories = dataCategory.filter((category) => {
    return category.name.toLowerCase().includes(result_search);
  });

  displayCategories(filteredCategories);
});

async function displayCategories(categories) {
  const tableBody = document.getElementById("category-table-body");
  tableBody.innerHTML = ""; // Xóa bảng hiện có để hiển thị kết quả tìm kiếm mới

 await categories.forEach((category) => {
    const newRow = document.createElement("tr");
   
      newRow.innerHTML = `
                <td class="h5">${category._id}</td>
                <td class="h5">${category.name}</td>
                <td> <img src="${category.image}" style="max-width: 120px; max-height: 120px;" class="rounded mx-auto d-block";alt="Fstyle shop"></td>
                <td class="h5">${category.description}</td>
                <td class="h5">${category.status == true ?"Còn Hàng": "Hết Hàng"}</td>
                <td><a href="${category._id}"style="color:
       #007bff; font-size:15px; text-decoration: underline;"
       >Ngừng bán</a></td>`;
    
        tableBody.appendChild(newRow);
    });
}
document.getElementById("add-category-btn").addEventListener('click', function(){
    window.location.href ="addcategory";
})
document.getElementById("category-table-body").addEventListener("click",async function (event) {
  if (event.target.tagName === "A") {
    event.preventDefault(); 
    const productId = await event.target.getAttribute("href");
    $("#confirmModalProduct").modal('show')
    $("#confirmProductBtn").off('click').click(function(){
      fetch(`/api/post/update_category_product/${productId}`)
      .then(res => res.json())
      .then(data =>{
      if(data.message==="update category success"){
        $("#confirmModalProduct").modal('hide')
        alert("update thành công")
        getData()
      }else if(data.message==="update category failed"){
        alert("update thất bại")
      }else{
        alert("Không tìm thấy sản phẩm")
      }
      })
      
    })
   
  }
});
