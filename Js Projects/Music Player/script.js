let songs = [
    {
        title: "Namo Namo",
        artist: "Amit Trivedi",
        src: "media/Namo-Namo-Ji-Shankara(PagalWorld).mp3",
        img: "media/468-thumbnail.png"
    },
    {
        title: "Kesariya",
        artist: "Arijit Singh",
        src: "media/Kesariya_192(Ghantalele.com).mp3",
        img: "media/468-thumbnail.png"
    },
    {
        title: "Ve kamleya",
        artist: "Arijit Singh",
        src: "media/Ve Kamleya(PagalWorld.com.cm).mp3",
        img: "media/468-thumbnail.png"
    },
    {
        title: "O Mahi",
        artist: "xyz",
        src: "media/O Mahi O Mahi(PagalWorld.com.cm).mp3",
        img: "media/468-thumbnail.png"
    },
    {
        title: "Tum Prem Ho",
        artist: "xyz",
        src: "media/Tum Prem Ho Tum Preet Ho_128-(PagalWorld).mp3",
        img: "media/468-thumbnail.png"
    },
    {
        title: "Dil se Dil Tak",
        artist: "xyz",
        src: "media/Dil Se Dil Tak(PagalWorld.com.cm).mp3",
        img: "media/468-thumbnail.png"
    }
];


let currentSongIndex = 0;
let progess = document.getElementById("progress");
let song = document.getElementById("song");
let ctrlIcon = document.getElementById("ctrlIcon");
let songTitle = document.querySelector("h1");
let songArtist = document.querySelector("p");
let songImg = document.querySelector(".song-img");

function loadSong(index) {
    song.src = songs[index].src;
    songTitle.innerText = songs[index].title;
    songArtist.innerText = songs[index].artist;
    songImg.src = songs[index].img;
    song.load();
}

song.onloadedmetadata = function(){
    progess.max = song.duration;
    progess.value = song.currentTime;

}

function playPause(){
    if(ctrlIcon.classList.contains("fa-pause")){
        song.pause();
        ctrlIcon.classList.remove("fa-pause");
        ctrlIcon.classList.add("fa-play");

    }
    else{
        song.play();
        ctrlIcon.classList.add("fa-pause");
        ctrlIcon.classList.remove("fa-play");
    }
}

if(song.play()){
    setInterval(() => {
        progess.value = song.currentTime;
    }, 500);
}

progess.onchange = function(){
    song.play();
    song.currentTime = progess.value;
    ctrlIcon.classList.add("fa-pause");
    ctrlIcon.classList.remove("fa-play");
}

document.querySelector(".fa-forward").addEventListener("click", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length; // Loop to first song after the last
    loadSong(currentSongIndex);
    song.play();
    ctrlIcon.classList.add("fa-pause");
    ctrlIcon.classList.remove("fa-play");
});

document.querySelector(".fa-backward").addEventListener("click", () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length; // Loop to last song if at the first
    loadSong(currentSongIndex);
    song.play();
    ctrlIcon.classList.add("fa-pause");
    ctrlIcon.classList.remove("fa-play");
});

// Load the initial song
loadSong(currentSongIndex);