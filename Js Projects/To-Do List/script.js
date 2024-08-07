const input = document.querySelector("#inp-box");
const listContainer = document.querySelector(".list-container");
const button = document.querySelector("button");

button.addEventListener('click',addTask);

function addTask(){
    if(input.value === ''){
        alert("You must write something");
    }
    else{
        let li = document.createElement("li");
        li.innerHTML = input.value;
        listContainer.appendChild(li);

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
        
    }

    input.value = "";
    saveData();
}

listContainer.addEventListener("click",function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
        saveData();
    }

    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveData();
    }
},false);

function saveData(){
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask(){
    listContainer.innerHTML = localStorage.getItem("data");
}

showTask();


