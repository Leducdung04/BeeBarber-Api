const nameInputService = document.getElementById("service-name");
const durationInput = document.getElementById("service_duration");
const priceServiceInput = document.getElementById("service_price");
const fileServiceInput = document.getElementById("service-file");
const descInputService = document.getElementById("service-description");
const categorySelect = document.getElementById("service-category-name"); 
const addButtonService = document.getElementById("btn-add-service");

let idCategory='';

// Check required fields
function checkRequired(inputArr) {
  let isRequired = false;
  inputArr.forEach(function(input) {
      if (input.value.trim() === '') {
          showError(input, `*${getFieldName(input)} is required`)
          isRequired = true
      }else {
          showSuccess(input)
      }
  })
  return isRequired
}
// Get fieldname
function getFieldName(input) {
  return input.name.charAt(0).toUpperCase() + input.name.slice(1)
}
// Show input error message
function showError(input, message) {
  const formControl = input.parentElement
  formControl.className = 'form-control error'
  const small = formControl.querySelector('small')
  small.innerText = message
  small.style.color = 'red'
}
// Show success outline
function showSuccess(input) {
  const formControl = input.parentElement
  formControl.className = 'form-control success'
  const small = formControl.querySelector('small')
  small.innerText = ''
}
//phần liên quan category
populateCategorySelect();
async function loadCategories() {
  try {
    const response = await fetch("/api/categorys/get_list_category");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading categories:", error);
    return [];
  }
}

async function populateCategorySelect() {
  const categories = await loadCategories();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category._id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}
categorySelect.addEventListener("change", function() {
  idCategory = categorySelect.options[categorySelect.selectedIndex].value;
});

function checkCategorySelected(){
    if(!idCategory &&categorySelect.options.length >0){
      idCategory = categorySelect.options[0].value;
      console.log(idCategory)
    }
}
//end category
//click
addButtonService.addEventListener("click", function (e) {
  e.preventDefault();
  checkCategorySelected();
  
  if (checkRequired([nameInputService, durationInput, priceServiceInput, descInputService])) {
    return;
  }
  const formData = new FormData();
  formData.append("name", nameInputService.value)
  formData.append("id_category", idCategory)
  formData.append("images", fileServiceInput.files[0])
  formData.append("duration", durationInput.value)
  formData.append("price", priceServiceInput.value)
  formData.append("description", descInputService.value)
  createProduct(formData)
});
async function createProduct(formData){
  const newProduct = await fetch("/api/services/add_service", {

    method: "POST",
    body: formData
  })
    const data = await newProduct.json()
      if (data.message === "Create new service successfully") {
        alert(data.message)
        window.location.replace("/services");
      } else {
        alert(data.message);
      }
}
