// Song list array
const songs = [
    {
        title: "Still Rollin",
        artist: "Shubh",
        album: "Still Rollin Album", // Add album info
        audio: "songs/Still Rollin.mp3",
        image: "images/still-rollin-Flyer.png"
    },
    {
        title: "Music 2",
        artist: "Artist 2",
        album: "Album 2",
        audio: "songs/music-2.mp3",
        image: "images/music-2.jpg"
    },
    {
        title: "Music 3",
        artist: "Artist 3",
        album: "Album 3",
        audio: "songs/music-3.mp3",
        image: "images/music-3.jpg"
    },
    {
        title: "Music 4",
        artist: "Artist 4",
        album: "Album 4",
        audio: "songs/music-4.mp3",
        image: "images/music-4.jpg"
    },
    {
        title: "Music 5",
        artist: "Artist 5",
        album: "Album 5",
        audio: "songs/music-5.mp3",
        image: "images/music-5.jpg"
    },
    {
        title: "Music 6",
        artist: "Artist 6",
        album: "Album 6",
        audio: "songs/music-6.mp3",
        image: "images/music-6.jpg"
    }
];

let currentSong = 0;

// DOM references
let song = document.getElementById("song");
let progress = document.getElementById("progress-bar");
let playbtn = document.getElementById("play");
let heart = document.getElementById("heart");
let repeatBtn = document.getElementById("repeat");
let disc = document.getElementById("disc");
let musicPoster = document.getElementById("musicPoster");
let songTitle = document.getElementById("songTitle");
let songArtist = document.getElementById("songArtist");
let songAlbum = document.getElementById("songAlbum");
let volumeBar = document.getElementById("volume-bar");
let playlistEl = document.getElementById("playlist");

let selectedPlaylistIndex = null;

// Load song details
function loadSong(index) {
    const s = songs[index];
    song.src = s.audio;
    musicPoster.src = s.image;
    songTitle.textContent = s.title;
    songArtist.textContent = s.artist;
    songAlbum.textContent = s.album || ""; // Show album info if available
    progress.value = 0;
    setTimeout(() => {
        progress.max = song.duration;
    }, 200);
    renderPlaylist();
}

// Update playlist rendering to support selection
function renderPlaylist() {
    playlistEl.innerHTML = "";
    songs.forEach((s, idx) => {
        const li = document.createElement('li');
        li.textContent = `${s.title} - ${s.artist}`;
        li.onclick = () => {
            currentSong = idx;
            loadSong(currentSong);
            playSong();
            // Highlight selected
            Array.from(playlistEl.children).forEach(child => child.classList.remove("selected"));
            li.classList.add("selected");
            selectedPlaylistIndex = idx;
        };
        if (idx === currentSong) li.classList.add("selected");
        playlistEl.appendChild(li);
    });
}

// Populate playlist
songs.forEach((s, idx) => {
    const li = document.createElement('li');
    li.textContent = `${s.title} - ${s.artist}`;
    li.onclick = () => {
        currentSong = idx;
        loadSong(currentSong);
        playSong();
    };
    playlistEl.appendChild(li);
});

// Play current song
function playSong() {
    song.play();
    playbtn.className = "fa-solid fa-pause";
    document.querySelector("#playBox").style.boxShadow = "inset 7px 7px 14px #b5b5b5 , inset -7px -7px 14px #ffffff";
    disc.className = "discImg spin";
}

// Pause current song
function pauseSong() {
    song.pause();
    playbtn.className = "fa-solid fa-play";
    document.querySelector("#playBox").style.boxShadow = "8px 8px 16px #c3c3c3 ,-8px -8px 16px #fdfdfd";
    disc.className = "discImg";
}

// Play/Pause toggle
function playPause() {
    if (playbtn.classList.contains("fa-pause")) {
        pauseSong();
    } else {
        playSong();
    }
}

// Next/Prev controls
document.querySelector('.next').onclick = function() {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    playSong();
};
document.querySelector('.prev').onclick = function() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
    playSong();
};

song.onloadedmetadata = function () {
    progress.max = song.duration;
    progress.value = song.currentTime;
};

if (song.play) {
    setInterval(() => {
        progress.value = song.currentTime;
    }, 500);
}

progress.onchange = function(){
    song.currentTime = progress.value;
    playSong();
};

heartBtn = document.querySelector(".heart");
heartBtn.onclick = function() {
    if (heart.classList.contains("fa-regular")) {
        heart.className ="fa-sharp fa-solid fa-heart";
    } else {
        heart.className ="fa-sharp fa-regular fa-heart";
    }
};

// Volume control
volumeBar.addEventListener("input", function() {
    song.volume = this.value;
});

// Set initial volume
song.volume = volumeBar.value;

// Add Song functionality
document.getElementById("addSongBtn").onclick = function() {
    const title = document.getElementById("newSongTitle").value.trim();
    const artist = document.getElementById("newSongArtist").value.trim();
    const album = document.getElementById("newSongAlbum").value.trim();
    const audioFile = document.getElementById("newSongAudio").files[0];
    const imageFile = document.getElementById("newSongImage").files[0];

    if (!title || !artist || !audioFile) {
        alert("Please provide at least a title, artist, and audio file.");
        return;
    }

    const audioURL = URL.createObjectURL(audioFile);
    let imageURL = "images/music-6.jpg"; // fallback image
    if (imageFile) {
        imageURL = URL.createObjectURL(imageFile);
    }

    songs.push({
        title,
        artist,
        album,
        audio: audioURL,
        image: imageURL
    });
    renderPlaylist();
    // Optionally clear inputs
    document.getElementById("newSongTitle").value = "";
    document.getElementById("newSongArtist").value = "";
    document.getElementById("newSongAlbum").value = "";
    document.getElementById("newSongAudio").value = "";
    document.getElementById("newSongImage").value = "";
};

// Remove Song functionality
document.getElementById("removeSongBtn").onclick = function() {
    if (selectedPlaylistIndex === null) {
        alert("Please select a song from the playlist to remove.");
        return;
    }
    // Prevent removing the last song
    if (songs.length === 1) {
        alert("Cannot remove the last song.");
        return;
    }
    songs.splice(selectedPlaylistIndex, 1);
    // Adjust currentSong if needed
    if (currentSong >= songs.length) currentSong = songs.length - 1;
    loadSong(currentSong);
    playSong();
    selectedPlaylistIndex = null;
    renderPlaylist();
};

// Initial load
loadSong(currentSong);



