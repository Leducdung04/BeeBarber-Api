// Animations
const registerButton = document.getElementById("register");
const loginButton = document.getElementById("login");
const container = document.getElementById("container");
const titleElement = document.querySelector("title");
registerButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
  titleElement.textContent = 'Register';
});

loginButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
  titleElement.textContent = 'Login';
});


// Check Register Error
const form = document.querySelector('form')
const username = document.getElementById('username')
const usernameError = document.querySelector("#username-error")
const email = document.getElementById('email')
const emailError = document.querySelector("#email-error")
const phone = document.getElementById('phone')
const phoneError = document.querySelector("#phone-error")
const password = document.getElementById('password')
const passwordError = document.querySelector("#password-error")
const repassword = document.getElementById('repassword')
const repasswordError = document.querySelector("#repassword-error")

   
     
// Show input error message
function showError(input, message) {
    const formControl = input.parentElement
    formControl.className = 'form-control error'
    const small = formControl.querySelector('small')
    small.innerText = message
}

// Show success outline
function showSuccess(input) {
    const formControl = input.parentElement
    formControl.className = 'form-control success'
    const small = formControl.querySelector('small')
    small.innerText = ''
}

// Check email is valid
function checkEmail(email) {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
}

email.addEventListener("input", function(){
    if (!checkEmail(email.value)) {
        emailError.textContent = "*Email is not valid"
    }else {
        emailError.textContent = "";
    }
})

// Check length input user name
username.addEventListener("input", function(){
    if (username.value.length < 6) {
        usernameError.textContent = "*Username phải lớn hơn 6  kí tự"
    }else if(username.value.length > 20){
        usernameError.textContent = "*Username phải nhỏ hơn 20 kí tự";
    }else {
        usernameError.textContent = "";
    }
})
// check username
function checkUsername(username){
    return username.value.length >=8 && username.value.length <=20;
}

//check phone
phone.addEventListener("input", function(){
    const phoneRegex = /^0\d{9}$/;
    if(!phoneRegex.test(phone.value)){
      phoneError.textContent="Số điện thoại không hợp lệ";
    }else{
        phoneError.textContent = "";
    }
})
function checkPhoneNumber(phone) {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone.value);
}
// Check length input password
password.addEventListener("input", function(){
    const uppercaseRegex = /[A-Z]/;
    const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    if (password.value.length < 6) {
        passwordError.textContent = "*Mật khẩu phải lớn hơn 6 kí tự"
    }else if(password.value.length > 20){
        passwordError.textContent = "*Mật khẩu phải nhỏ hơn 20 kí tự."
    }else if (!uppercaseRegex.test(password.value)) {
        passwordError.textContent = "*Mật khẩu phải chứa ít nhất 1 chữ in hoa."
    } else if (!specialCharRegex.test(password.value)) {
        passwordError.textContent = "*Mật khẩu phải chứa kí tự đặc biệt."
    } else {
        passwordError.textContent = "";
    }
})
function checkPassword(password){
    const uppercaseRegex = /[A-Z]/;
    const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    return password.value.length >=6 && password.value.length <=20 && uppercaseRegex.test(password.value) && specialCharRegex.test(password.value);
}
repassword.addEventListener("input", function(){
    if(repassword.value.length<8){
        repasswordError.textContent = "*Xác nhận mật khẩu phải lớn hơn 8 kí tự."
    }else if(repassword.value.length > 20){
        repasswordError.textContent = "Xác nhận mật khẩu* phải nhỏ hơn 20 kí tự."
    }else if (repassword.value !== password.value) {
        repasswordError.textContent = "*Xác nhận mật khẩu không trùng khớp.";
    } else {
        repasswordError.textContent = "";
    }
})
function checkRePassword(repassword){
    return repassword.value.length >=8 && repassword.value.length <=20 && repassword.value ==password.value;
}
// Check required fields
function checkRequired(inputArr) {
    let isRequired = false
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
    return input.id.charAt(0).toUpperCase() + input.id.slice(1)
}

// Event listeners

document.getElementById('registrationForm').addEventListener('submit',function(event){
event.preventDefault();
    if (checkRequired([username, email,phone, password,repassword])) {
         return;
    } 
    if(!checkEmail(email.value)){
        showError(email, "Email không hợp lệ!")
        return;
    }
    if(!checkPhoneNumber(phone)){
        showError(phone, "Số điện thoại không hợp lệ!")
        return;
    }
    if(!checkPassword(password)){
        showError(password, "Mật khẩu phải từ 8 đến 20 kí tự chứa chữ in hoa và kí tự đặc biệt!");
        return;
    }
    if(!checkRePassword(repassword)){
        showError(repassword, "Xác nhận mật khẩu không khớp!")
        return;
    }
  

    if(!checkUsername(username)){
        showError(username, "Username phải từ 8 đến 20 kí tự")
    }
    fetch("/api/post/sign_up", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
            name: username.value,
            email: email.value,
            phone: phone.value,
            password: password.value,
        
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message==="Email already exists") {
            alert("Email đã tồn tại");
           return;
        } else if(data.message==="Đăng ký thành công") {
            alert("Đã tạo mới người dùng thành công.");
            container.classList.remove("right-panel-active");
            titleElement.textContent = 'Login';
             username.value = '';
            email.value = '';
            phone.value = '';
            password.value = '';
            repassword.value = '';
        }else{
            alert("Tạo tài khoản thất bại");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Vui lòng thử lại sau");
    });
});

// Check Login Error

let lgForm = document.querySelector('.form-lg')
let lgEmail = document.querySelector('.email-2')
let lgEmailError = document.querySelector(".email-error-2")
let lgPassword = document.querySelector('.password-2')
let lgPasswordError = document.querySelector(".password-error-2")

function showError2(input, message) {
    const formControl2 = input.parentElement
    formControl2.className = 'form-control2 error'
    const small2 = formControl2.querySelector('small')
    small2.innerText = message
}

function showSuccess2(input) {
    const formControl2 = input.parentElement
    formControl2.className = 'form-control2 success'
    const small2 = formControl2.querySelector('small')
    small2.innerText = '';
}

// Check email is valid
function checkPhone2(lgPhone) {
    const phoneRegex = /^(\+84|0)\d{9}$/;
    return phoneRegex.test(lgPhone);
}
function checkPassword(lgPassword){
    return lgPassword.value.length>=6 && lgPassword.value.length <=20;
}
lgEmail.addEventListener("input", function(){
    if (!checkPhone2(lgEmail.value)) {
        lgEmailError.textContent = "*Số điện thoại không hợp lệ"
    }else {
        lgEmailError.textContent = "";
    }
})

// Check length input passwrod
lgPassword.addEventListener("input", function(){
    if (lgPassword.value.length < 6) {
        lgPasswordError.textContent = "*Mật khẩu phải lớn hơn 6 kí tự."
    }else if (lgPassword.value.length > 20){
        lgPasswordError.textContent = "*Mật khẩu phải nhỏ hơn 20 kí tự."
    }else {
        lgPasswordError.textContent = "";
    }
})

function checkRequiredLg(inputArr2) {
    let isRequiredLg = false
    inputArr2.forEach(function(input){
        if (input.value.trim() === '') {
            showError2(input, `*${getFieldNameLg(input)} Vui lòng nhập thông tin của bạn vào trường này`)
            isRequiredLg = true
        }else {
            showSuccess2(input)
        }
    })

    return isRequiredLg
}

function getFieldNameLg(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1)
}

lgForm.addEventListener('submit', function (e){
    e.preventDefault();

    if (checkRequiredLg([lgEmail, lgPassword])) {
        return;
    }
    if (!checkPhone2(lgEmail.value)) {
        showError2(lgEmail, "*Số điện thoại không hợp lệ");
        return;
    }
    if (!checkPassword(lgPassword)) {
        showError2(lgPassword, "*Mật khẩu phải từ 6 đến 20 kí tự");
        return; 
    }
    fetch("/api/loginPhone", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
            phone: lgEmail.value,
            password: lgPassword.value,
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Số điện thoại không tồn tại") {
            alert(data.message);
        } else if (data.message === "Mật khẩu không chính xác!") {
            alert(data.message);
        } else {
            if(data.data.role == "admin"){
                window.location.href = "/home";
            }else {
               alert('Bạn không có quyền truy cập vào trang này.');
            }
        }
    })
    .catch(error => {
        console.error('Lỗi:', error);
        alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    });
});