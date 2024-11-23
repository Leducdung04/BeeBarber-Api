const query_search_service = document.getElementById("query-search-product");
const btn_search_service = document.getElementById("btn-search-product");
let dataServices = [];
let nameCategory='';
getDataService()
//get name ccategory
async function getNameCategoryService(idCategory) {
  try {
    const response = await fetch(`/api/categorys/get_category/${idCategory}`);
    const data = await response.json(); 
    return data.data.name;
  } catch (error) {
    console.error("err_name_category:", error);
    return "Error";
  }
}
function getDataService(){
  fetch("/api/services/get_list_service")
  .then((response) => response.json())
  .then((data) => {
    dataServices = data;
    displayServices(dataServices);
  })
  .catch((error) => console.error("Error fetching products:", error));
}


btn_search_service.addEventListener("click", function (e) {
  e.preventDefault();
  const result_search = query_search_service.value.trim().toLowerCase();

  const filteredProduct = dataServices.filter((products) => {
    return products.name.toLowerCase().includes(result_search);
  });

  displayServices(filteredProduct);
});

async function displayServices(products) {
  const tableBody1 = document.getElementById("services-list");
  tableBody1.innerHTML = "";

  for (const product of products) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td class="h5">${product._id}</td>
      <td class="h5">${product.name}</td>
      <td> <img src="${product.images}" style="max-width: 100px; max-height: 100px;" class="rounded mx-auto d-block" alt="Fstyle shop"></td>
      
      <td class="h5">${product.price.toLocaleString()}</td>
      <td class="h5">${product.duration}</td>
      <td class="h5">${product.description}</td>
      <td class="h5">${await getNameCategoryService
      (product.id_category)}</td>
      <td class="h5">${product.status == true ? "Khả dụng": "Không khả dụng"}</td>
      <td><a href="${product._id}"style="color:
       #007bff; font-size:15px; text-decoration: underline;"
       >Ngừng bán</a></td>
    `;
    tableBody1.appendChild(newRow);
  }
}
document.getElementById('add-product-btn').addEventListener('click', async function(e){
  e.preventDefault();
  window.location.href="/add_service";
})
document.getElementById("services-list").addEventListener("click",async function (event) {
  if (event.target.tagName === "A") {
    event.preventDefault(); 
    const productId = await event.target.getAttribute("href");
    $("#confirmModalProduct").modal('show')
    $("#confirmProductBtn").click(function(){
      fetch(`/api/services/update_status_service/${productId}`)
      .then(res => res.json())
      .then(data =>{
      if(data.message==="Update service successfully"){
        $("#confirmModalProduct").modal('hide')
        alert("update thành công")
        getDataService()
      }else if(data.message==="Update service failed"){
        alert("update thất bại")
      }else{
        alert("Không tìm thấy sản phẩm")
      }
      })
      
    })
   
  }
});