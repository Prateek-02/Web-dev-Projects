// let boxes = document.getElementsByClassName("box");

let boxes = document.querySelectorAll('.box')

function getRandomColor(){
    let v1 = Math.ceil(Math.random()*255)
    let v2 = Math.ceil(Math.random()*255)
    let v3 = Math.ceil(Math.random()*255)

    return `rgb(${v1},${v2},${v3})`
}

function changeColors(){
    boxes.forEach(e=>{
        e.style.backgroundColor = getRandomColor()
        e.style.color = getRandomColor()
    })
}

document.getElementById("colorBtn").addEventListener("click", changeColors)