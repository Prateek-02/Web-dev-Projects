console.log('welcome to spotify');

// Initialize the variable
let songIndex = 0;
let audioElement = new Audio('/songs/1.mp3')
let masterPlay = document.getElementById('masterPlay')
let myProgressBar = document.getElementById('myProgressBar')
let gif = document.getElementById('gif')
let songItems = Array.from(document.getElementsByClassName('songItem'))
let songItemPlay = Array.from(document.getElementsByClassName('songItemPlay'))
let songTime = document.getElementById('time')
let masterSongName = document.getElementById('masterSongName');
let timeStamp = document.getElementsByClassName('timeStamp')


let songs = [
    {
        songName: "Tum Prem Ho",
        filePath: "songs/1.mp3",
        coverPath: "covers/1.jpg"
    },
    {
        songName: "Dil Se Dil Tak",
        filePath: "/songs/2.mp3",
        coverPath: "/covers/2.jpg"
    },
    {
        songName: "Namo Namo",
        filePath: "/songs/3.mp3",
        coverPath: "/covers/3.jpg"
    },
    {
        songName: "Hardum Humdum",
        filePath: "/songs/4.mp3",
        coverPath: "/covers/4.jpg"
    },
    {
        songName: "Mushkil Hai",
        filePath: "/songs/5.mp3",
        coverPath: "/covers/5.jpg"
    },
    {
        songName: "Main Tumhara",
        filePath: "/songs/6.mp3",
        coverPath: "/covers/6.jpg"
    },
    {
        songName: "Dooron Dooron",
        filePath: "/songs/7.mp3",
        coverPath: "/covers/7.jpg"
    },
    {
        songName: "Kesariya",
        filePath: "/songs/8.mp3",
        coverPath: "/covers/8.jpg"
    },
    {
        songName: "O Maahi",
        filePath: "/songs/9.mp3",
        coverPath: "/covers/9.jpg"
    },
    {
        songName: "Ve Kamleya",
        filePath: "/songs/10.mp3",
        coverPath: "/covers/10.jpg"
    }
]

const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    if (seconds < 10) seconds = '0' + seconds;
    return `${minutes}:${seconds}`;
}

// Set duration for each song dynamically
songItems.forEach((songItem, i) => {
    let audio = new Audio(songs[i].filePath);
    let timestamp = songItem.getElementsByClassName('timestamp')[0];
    let playIcon = timestamp.querySelector('.songItemPlay');

    // Load metadata to get duration
    audio.addEventListener('loadedmetadata', () => {
        // Only update text, leave <i> intact
        playIcon.previousSibling.textContent = formatTime(audio.duration) + ' ';
    });

    // Trigger load
    audio.load();
});



songItems.forEach((e, i) => {
    e.getElementsByTagName('img')[0].src = songs[i].coverPath
    e.getElementsByClassName('songName')[0].innerText = songs[i].songName
})


// Listen to events
audioElement.addEventListener('timeupdate', () => {
    // Update the seekbar value
    // Get current time in seconds
    let currentTime = audioElement.currentTime;

    // Convert to minutes and seconds
    let minutes = Math.floor(currentTime / 60);
    let seconds = Math.floor(currentTime % 60);

    // Optional: add leading zero to seconds
    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    // Update progress bar and songTime
    progress = parseInt((currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress;
    songTime.innerText = `${minutes}:${seconds}`;
});

myProgressBar.addEventListener('input', () => {
    audioElement.currentTime = myProgressBar.value * audioElement.duration / 100
})

const makeAllPlays = () => {
    songItemPlay.forEach((e) => {
        e.classList.add('fa-play')
        e.classList.remove('fa-pause')
    })
}

const playSongAtIndex = (index) => {
    // Reset all songItemPlay buttons
    makeAllPlays();

    // Update current song index
    songIndex = index;

    // Update audio source and play
    audioElement.src = songs[songIndex].filePath;
    audioElement.currentTime = 0;
    audioElement.play();

    // Update song names
    masterSongName.innerText = songs[songIndex].songName;

    // Update master play button
    masterPlay.classList.remove('fa-play');
    masterPlay.classList.add('fa-pause');

    // Update the clicked song button
    songItemPlay[songIndex].classList.remove('fa-play');
    songItemPlay[songIndex].classList.add('fa-pause');

    // Show GIF
    gif.style.opacity = 1;
};

audioElement.addEventListener('ended', () => {
    let nextIndex = (songIndex + 1) % songs.length;
    playSongAtIndex(nextIndex);
});


songItemPlay.forEach((element, i) => {
    element.addEventListener('click', () => {
        // If the same song is clicked while playing → pause
        if (songIndex === i && !audioElement.paused) {
            audioElement.pause();
            element.classList.remove('fa-pause');
            element.classList.add('fa-play');
            masterPlay.classList.remove('fa-pause');
            masterPlay.classList.add('fa-play');
            gif.style.opacity = 0;
        } else {
            playSongAtIndex(i);
        }
    });
});


document.getElementById('next').addEventListener('click', () => {
    let nextIndex = (songIndex + 1) % songs.length;
    playSongAtIndex(nextIndex);
});

document.getElementById('previous').addEventListener('click', () => {
    let prevIndex = (songIndex - 1 + songs.length) % songs.length;
    playSongAtIndex(prevIndex);
});


masterPlay.addEventListener('click', () => {
    if (audioElement.paused) {
        // Resume current song
        audioElement.play();
        masterPlay.classList.remove('fa-play');
        masterPlay.classList.add('fa-pause');

        // Update current songItemPlay button
        songItemPlay[songIndex].classList.remove('fa-play');
        songItemPlay[songIndex].classList.add('fa-pause');

        gif.style.opacity = 1;
    } 
    else {
        // Pause current song
        audioElement.pause();
        masterPlay.classList.remove('fa-pause');
        masterPlay.classList.add('fa-play');

        songItemPlay[songIndex].classList.remove('fa-pause');
        songItemPlay[songIndex].classList.add('fa-play');

        gif.style.opacity = 0;
    }
});


