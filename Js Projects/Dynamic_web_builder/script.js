function createCard(title,cName,views,monthsOld,duration,thumbnail){
    let viewStr;
    if(views<1000){
        viewStr = views;
    }
    else if(views>1000000){
        viewStr = views/1000000 + "M";
    }
    else{
        viewStr = views/1000 + "K"
    }
    let html = `<div class="card">
    <div class="image">
        <img src="${thumbnail}" alt="">
        <div class = "capsule">${duration}</div>
    </div>
    <div class="text">
        <h1>${title}</h1>
        <p>${cName} . ${viewStr} views . ${monthsOld} months ago</p>
    </div>
</div>`

document.querySelector(".container").innerHTML = document.querySelector(".container").innerHTML + html
}


createCard("Introduction to Backend | Sigma Web Dev Course", "CodWithHarry",560000,2,"28:31","https://i.ytimg.com/vi/kJEsTjH5mVg/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLBTa4i6NuryzZhcPo7BkCK1G6PqGg")
