let rand = Math.random()
let first,second,third;

//First Word
if(rand<0.33){
    first = "Crazy"
}
else if(rand<0.66 && rand>= 0.33){
    first = "Amazing"
}
else{
    first = "Fire"
}

//Second Word
rand = Math.random()
if(rand<0.33){
    second = "Engine"
}
else if(rand<0.66 && rand>= 0.33){
    second = "Foods"
}
else{
    second = "Garments"
}
 
//Third Word
rand = Math.random()
if(rand<0.33){
    third = "Bros"
}
else if(rand<0.66 && rand>= 0.33){
    third = "Limited"
}
else{
    third = "Hub"
}

const res = document.querySelector("p");

res.innerHTML = (`${first} ${second} ${third}`)
