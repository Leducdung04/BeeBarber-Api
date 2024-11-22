const query_search_category_service = document.getElementById("query-search");
const btnSearchCategoryService
 = document.getElementById("btn-search");
let dataCategoriesService = [];
getData()
function getData(){
  fetch("/api/categorys/get_list_category",{ cache: "no-store" })
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
    displayCategories(data)
    dataCategoriesService = data
  })
  .catch((error) => console.error("Error fetching category:", error));
}
btnSearchCategoryService
.addEventListener("click", function (e) {
  e.preventDefault();
  const result_search = query_search_category_service.value.trim().toLowerCase(); 

  const filteredCategories = dataCategoriesService.filter((category) => {
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
                <td class="h5">${category.status == true ? "Khả dụng": "Không khả dụng"}</td>
                <td><a href="${category._id}"style="color:
       #007bff; font-size:15px; text-decoration: underline;"
       >Ngừng bán</a></td>`;
    
        tableBody.appendChild(newRow);
    });
}
document.getElementById("add-category-service-btn").addEventListener('click', function(){
    window.location.href ="addcategoryService";
})
document.getElementById("category-table-body").addEventListener("click",async function (event) {
  if (event.target.tagName === "A") {
    event.preventDefault(); 
    const productId = await event.target.getAttribute("href");
    $("#confirmModalProduct").modal('show')
    $("#confirmProductBtn").off('click').click(function(){
      fetch(`/api/categorys/update_status_category/${productId}`)
      .then(res => res.json())
      .then(data =>{
      if(data.message==="update status successfully"){
        $("#confirmModalProduct").modal('hide')
        alert("update thành công")
        getData()
      }else{
        alert(data.message)
      }
      })
      
    })
   
  }
});
