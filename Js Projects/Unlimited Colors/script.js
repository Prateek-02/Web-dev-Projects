const body = document.querySelector('body');

function getRandomColor(){
    let v1 = Math.ceil(Math.random()*255)
    let v2 = Math.ceil(Math.random()*255)
    let v3 = Math.ceil(Math.random()*255)

    return `rgb(${v1},${v2},${v3})`
}

let changeIt;
function changeColors(){
    changeIt = setInterval(function(){
        body.style.backgroundColor = getRandomColor(); 
    },1000)
}

document.querySelector('#start').addEventListener('click',changeColors);

document.querySelector('#stop').addEventListener('click',function(){
    clearInterval(changeIt);
});