const regForm = document.getElementById('form1');
const fullname = document.getElementById('regFullname');
const password = document.getElementById('regPassword');
const username = document.getElementById('regUsername');

regForm.addEventListener('submit', e => {
    e.preventDefault();
    checkInputs();
});

function checkInputs(){
    const usernameValue = username.value.trim();
    const fullnameValue = fullname.value.trim();
    const passwordValue = password.value.trim();

    if(usernameValue === ''){
        setErrorFor(username, 'No puede dejar el usuario en blanco.')
    } else {
        setSuccessFor(username);
    }
}

function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    formControl.className = 'form-control error';
    small.innerText = message;
}

function setSuccessFor(input){
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

function isEmail(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/
}


document.addEventListener("click", myFunction1);
document.addEventListener("click", myFunction2);

function myFunction1() {
  document.getElementById("demo").innerHTML += "First function was executed! "
}

function myFunction2() {
  document.getElementById("demo").innerHTML += "Second function was executed! "
}
