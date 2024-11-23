const nameInput = document.getElementById('category-name');
const descInput = document.getElementById('category-desc');
const imageInput = document.getElementById("category-image");
const addButton = document.getElementById("btn-add");
const nameError = document.querySelector("#categoryname-error");
const descError = document.querySelector("#categorydesc-error");
const imageError = document.querySelector("#categoryimage-error");
//check name
function checkName(nameInput){
    if(nameInput.value.length === 0){
      nameError.textContent = "*Vui lòng nhập tên thể loại";
      return false;
    }
    return true;
}
function checkDesc(descInput){
    if(descInput.value.length === 0){
      descError.textContent = "*Vui lòng nhập chi tiết thể loại";
      return false;
    }
    return true;
}
function checkImageSelected(imageInput) {
    if (!imageInput.files[0]) {
        imageError.textContent ="*Vui lòng nhập link ảnh";
        return false;
    }
    return true;
}

addButton.addEventListener('click',  function(e) {
    e.preventDefault();
    if (!checkName(nameInput) || !checkDesc(descInput) || !checkImageSelected(imageInput)) {
        return;
    }
    const formData = new FormData();
    formData.append("name", nameInput.value)
    formData.append("description", descInput.value)
    formData.append("image", imageInput.files[0])

        fetch("/api/categoryProducts/add_category_product", {
            method: "POST",
            body: formData

        })
        .then(response=> response.json())
        .then(data =>{
        if (data.message === "Create new category product successfully") {
            alert(data.message);
            window.location.href = "/categories_product";
        } else {
            alert(data.message);
        }
        })
        .catch(err=>{
            alert(`Error:${err}`)
        })
});
