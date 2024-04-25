const clock = document.getElementById('clock');
// or
// const clock = document.querySelector('#clock');

setInterval(function(){
    let date = new Date();
    clock.innerHTML = date;
},1000);


