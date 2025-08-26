console.log('welcome to spotify');

// Initialize the variable
let songIndex = 0;
let audioElement = new Audio('/songs/1.mp3')
let masterPlay = document.getElementById('masterPlay')
let myProgressBar = document.getElementById('myProgressBar')
let gif = document.getElementById('gif')
let songItems = Array.from(document.getElementsByClassName('songItem'))
let songItemPlay = Array.from(document.getElementsByClassName('songItemPlay'))




let songs = [
    {
        songName: "Warriyo - Mortals",
        filePath:"songs/1.mp3",
        coverPath:"covers/1.jpg"
    },
    {
        songName: "Cielo - Huma-Huma",
        filePath:"/songs/2.mp3",
        coverPath:"/covers/2.jpg"
    },
    {
        songName: "DEAF KEV - Invincible",
        filePath:"/songs/3.mp3",
        coverPath:"/covers/3.jpg"
    },
    {
        songName: "Different Heaven & EHIDE - My Heart",
        filePath:"/songs/4.mp3",
        coverPath:"/covers/4.jpg"
    },
    {
        songName: "Janji-Heros-Tonight-feat-johnning",
        filePath:"/songs/5.mp3",
        coverPath:"/covers/5.jpg"
    },
    {
        songName: "Tum Ho",
        filePath:"/songs/6.mp3",
        coverPath:"/covers/6.jpg"
    },
    {
        songName: "Dooron Dooron",
        filePath:"/songs/7.mp3",
        coverPath:"/covers/7.jpg"
    },
    {
        songName: "Nandaan Parindey",
        filePath:"/songs/8.mp3",
        coverPath:"/covers/8.jpg"
    },
    {
        songName: "Raabta",
        filePath:"/songs/9.mp3",
        coverPath:"/covers/9.jpg"
    },
    {
        songName: "Channa Mereya",
        filePath:"/songs/10.mp3",
        coverPath:"/covers/10.jpg"
    }
]

// handle play/pause click
masterPlay.addEventListener('click', () =>{
    if(audioElement.paused || audioElement.currentTime <= 0){
        audioElement.play();
        masterPlay.classList.remove('fa-play')
        masterPlay.classList.add('fa-pause')
        gif.style.opacity = 1
    }
    else{
        audioElement.pause();
        masterPlay.classList.remove('fa-pause')
        masterPlay.classList.add('fa-play')
        gif.style.opacity = 0
    }
})

songItems.forEach((e,i) =>{
    e.getElementsByTagName('img')[0].src = songs[i].coverPath
    e.getElementsByClassName('songName')[0].innerText = songs[i].songName
})


// Listen to events
audioElement.addEventListener('timeupdate', () => {
    // Update the seekbar value
    progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress
});

myProgressBar.addEventListener('input', () =>{
    audioElement.currentTime = myProgressBar.value * audioElement.duration/100
})

const makeAllPlays = () =>{
    songItemPlay.forEach((e)=>{
        e.classList.add('fa-play')
        e.classList.remove('fa-pause')
    })
}


songItemPlay.forEach((element) =>{
    element.addEventListener('click', (event) =>{
        makeAllPlays();
        event.target.classList.remove('fa-play')
        event.target.classList.add('fa-pause')
    })
})