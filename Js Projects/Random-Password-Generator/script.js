const passBox = document.getElementById("password");
const length  = 8;

const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerCase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "@#$%^&*()_+|{}[]<>/-=";

const allChars = upperCase+lowerCase+numbers+symbols;



function generatePassword(){
    let password = "";
    password += upperCase[Math.floor(Math.random() * upperCase.length)];
    password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    while(length > password.length){
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    passBox.value = password;
}

function copyPassword(){
    // passBox.select();
    // passBox.setSelectionRange(0,99999);
    // document.execCommand('copy');

    // or

    navigator.clipboard.writeText(passBox.value)
        .then(() =>{
            alert("Password copied to clipboard!");
        })
        .catch(err =>{
            alert("Failed to copy");
        })

    
}

const button = document.querySelector("button");
const copy = document.getElementById("copy-icon");

button.addEventListener('click',generatePassword);

copy.addEventListener('click',copyPassword);
