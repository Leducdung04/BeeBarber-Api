const nameInputPro = document.getElementById("product-name");
const importPriceInput = document.getElementById("product-import_price");
const priceInput = document.getElementById("product-price");
const fileInput = document.getElementById("product-file");
const quantityInput = document.getElementById("product-quantity");
const descriptionInput = document.getElementById("product-description");
const categorySelectPro = document.getElementById("product-category-name"); 
const addButtonPro = document.getElementById("btn-add-product");
const nameErrorPro = document.querySelector("#productname-error");
const brandError = document.querySelector("#import_price-error");
const priceError = document.querySelector("#price-error");
const quantityError = document.querySelector("#quantity-error");
const fileError = document.querySelector("#file-error");
const descErrorProduct = document.querySelector("#description-error");
const imageErrorPro = document.querySelector("#productimage-error");

let idCategoryProduct='';

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
populateCategorySelectPro();
async function loadCategories() {
  try {
    const response = await fetch("/api/categoryProducts/get_list_Category_Product");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading categories:", error);
    return [];
  }
}

async function populateCategorySelectPro() {
  const categories = await loadCategories();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category._id;
    option.textContent = category.name;
    categorySelectPro.appendChild(option);
  });
}
categorySelectPro.addEventListener("change", function() {
  idCategoryProduct = categorySelectPro.options[categorySelectPro.selectedIndex].value;
});

function checkCategorySelectedPro(){
    if(!idCategoryProduct &&categorySelectPro.options.length >0){
      idCategoryProduct = categorySelectPro.options[0].value;
      console.log(idCategoryProduct)
    }
}
//end category
//click
addButtonPro.addEventListener("click", function (e) {
  e.preventDefault();
  checkCategorySelectedPro();
  
  if (checkRequired([nameInputPro, importPriceInput, priceInput, quantityInput, descriptionInput])) {
    return;
  }
  const formData = new FormData();
  formData.append("name", nameInputPro.value)
  formData.append("categoryId", idCategoryProduct)
  formData.append("image", fileInput.files[0])
  formData.append("import_price", importPriceInput.value)
  formData.append("price_selling", priceInput.value)
  formData.append("description", descriptionInput.value)
  formData.append("quantity", quantityInput.value)
  createProduct(formData)
});
async function createProduct(formData){
  const newProduct = await fetch("/api/products/add_product", {

    method: "POST",
    body: formData
  })
    const data = await newProduct.json()
      if (data.message === "Create new product successfully") {
        alert(data.message)
        window.location.replace("/products");
      } else {
        alert(data.message);
      }
}
