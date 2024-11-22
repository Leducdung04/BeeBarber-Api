const nameCategoryService = document.getElementById('category-service-name');
const descCategoryService = document.getElementById('category-service-desc');
const imageCategoryService = document.getElementById("category-service-image");
const addCategoryServiceButton = document.getElementById("btn-category-service-add");
const nameCategoryServiceError = document.querySelector("#categoryname-service-error");
const descCategoryServiceError = document.querySelector("#categorydesc-service-error");
const imageCategoryServiceError = document.querySelector("#categoryimage-service-error");
//check name
function checkName(nameCategoryService){
    if(nameCategoryService.value.length === 0){
      nameCategoryServiceError.textContent = "*Vui lòng nhập tên thể loại";
      return false;
    }
    return true;
}
function checkDesc(descCategoryServiceError){
    if(descCategoryServiceError.value.length === 0){
      descError.textContent = "*Vui lòng nhập chi tiết thể loại";
      return false;
    }
    return true;
}
function checkImageSelected(imageCategoryService) {
    if (!imageCategoryService.files[0]) {
        imageCategoryServiceError.textContent ="*Vui lòng nhập link ảnh";
        return false;
    }
    return true;
}

addCategoryServiceButton.addEventListener('click',  function(e) {
    e.preventDefault();
    if (!checkName(nameCategoryService) || !checkDesc(descCategoryService) || !checkImageSelected(imageCategoryService)) {
        return;
    }
    const formData = new FormData();
    formData.append("name", nameCategoryService.value)
    formData.append("description", descCategoryService.value)
    formData.append("image", imageCategoryService.files[0])

        fetch("/api/categorys/add_category", {
            method: "POST",
            body: formData

        })
        .then(response=> response.json())
        .then(data =>{
            console.log(data)
            alert("Create new category service successfully");
            window.location.href = "/categories_service";
        })
        .catch(err=>{
            alert(`Error:${err}`)
        })
});
