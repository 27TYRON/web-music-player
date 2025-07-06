const musicData = [
  {
    backgroundImage: "./assets/images/poster-1.jpg",
    posterUrl: "./assets/images/poster-1.jpg",
    title: "Happy Moments (Master)",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit x Tonion",
    musicPath: "./assets/music/music-1.mp3",
    duration: "1:00"
  },
  {
    backgroundImage: "./assets/images/poster-2.jpg",
    posterUrl: "./assets/images/poster-2.jpg",
    title: "We Are Going To Be Ok (Master)",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit x Jhove",
    musicPath: "./assets/music/music-2.mp3",
    duration: "1:00"
  },
  {
    backgroundImage: "./assets/images/poster-3.jpg",
    posterUrl: "./assets/images/poster-3.jpg",
    title: "Winter Meadow",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit x juniorodeo",
    musicPath: "./assets/music/music-3.mp3",
    duration: "1:00"
  },
  {
    backgroundImage: "./assets/images/poster-4.jpg",
    posterUrl: "./assets/images/poster-4.jpg",
    title: "From Where We Started",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit",
    musicPath: "./assets/music/music-4.mp3",
    duration: "1:00"
  },
  {
    backgroundImage: "./assets/images/poster-5.jpg",
    posterUrl: "./assets/images/poster-5.jpg",
    title: "Where I Found You",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit",
    musicPath: "./assets/music/music-5.mp3",
    duration: "1:00"
  }
];

// Utility to add event listeners to multiple elements
const addEventonElements = function (elements, event, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(event, callback);
  }
};

// Render playlist
const playlist = document.querySelector("[data-music-list]");
playlist.innerHTML = "";
for (let i = 0, len = musicData.length; i < len; i++) {
  playlist.innerHTML += `
    <li>
      <button class="music-item${i === 0 ? " playing" : ""}" data-playlist-toggler data-playlist-item="${i}" aria-label="Play ${musicData[i].title}">
        <img src="${musicData[i].posterUrl}" width="800" height="800" alt="${musicData[i].title} Album Poster" class="img-cover">
        <div class="item-info">
          <span class="song-title">${musicData[i].title}</span>
          <span class="song-artist">${musicData[i].artist}</span>
          <span class="song-duration">${musicData[i].duration}</span>
        </div>
        <div class="item-icon">
          <span class="material-symbols-rounded" aria-hidden="true">equalizer</span>
        </div>
      </button>
    </li>`;
}

// Playlist toggle
const playlistSideModel = document.querySelector("[data-playlist]");
const playlistTogglers = document.querySelectorAll("[data-playlist-toggler]");
const overlay = document.querySelector("[data-overlay]");

const togglePlaylist = function () {
  playlistSideModel.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("modalActive");
};
addEventonElements(playlistTogglers, "click", togglePlaylist);
if (overlay) overlay.addEventListener("click", togglePlaylist);

// Playlist item selection
const playlistItems = document.querySelectorAll("[data-playlist-item]");
let currentMusic = 0;
let lastPlayedMusic = 0;

const changePlaylistItem = function () {
  playlistItems[lastPlayedMusic].classList.remove("playing");
  playlistItems[currentMusic].classList.add("playing");
  lastPlayedMusic = currentMusic;
};

// Player info
const playerBanner = document.querySelector("[data-player-banner]");
const playerTitle = document.querySelector("[data-title]");
const playerAlbum = document.querySelector("[data-album]");
const playerYear = document.querySelector("[data-year]");
const playerArtist = document.querySelector("[data-artist]");

// Audio
let audioSource = new Audio(musicData[currentMusic].musicPath);

// Update player info
const changePlayerInfo = function () {
  playerBanner.src = musicData[currentMusic].posterUrl;
  playerBanner.setAttribute("alt", `${musicData[currentMusic].title} Album Poster`);
  document.body.style.backgroundImage = `url('${musicData[currentMusic].backgroundImage}')`;
  playerTitle.textContent = musicData[currentMusic].title;
  if (playerAlbum) playerAlbum.textContent = musicData[currentMusic].album;
  if (playerYear) playerYear.textContent = musicData[currentMusic].year;
  if (playerArtist) playerArtist.textContent = musicData[currentMusic].artist;
  audioSource.src = musicData[currentMusic].musicPath;
  updatePlayerDuration();
};

// Playlist item click
addEventonElements(playlistItems, "click", function () {
  if (currentMusic !== Number(this.dataset.playlistItem)) {
    lastPlayedMusic = currentMusic;
    currentMusic = Number(this.dataset.playlistItem);
    changePlaylistItem();
    changePlayerInfo();
    audioSource.currentTime = 0;
    if (!audioSource.paused) {
      audioSource.play();
    }
  }
  togglePlaylist();
});

// Seek and duration
const playerDuration = document.querySelector("[data-duration]");
const playerSeekRange = document.querySelector("[data-seek]");
const playerRunningTime = document.querySelector("[data-running-time]");

const getTimecode = function (time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const updatePlayerDuration = function () {
  if (audioSource.duration) {
    playerSeekRange.max = Math.floor(audioSource.duration);
    playerDuration.textContent = getTimecode(audioSource.duration);
  } else {
    playerSeekRange.max = 100;
    playerDuration.textContent = musicData[currentMusic].duration || "0:00";
  }
};
audioSource.addEventListener("loadedmetadata", updatePlayerDuration);

// Play/Pause
const playBtn = document.querySelector("[data-play-btn]");
let playInterval;

const updateRunningTime = function () {
  playerSeekRange.value = audioSource.currentTime;
  playerRunningTime.textContent = getTimecode(audioSource.currentTime);
  updateRangeFill(playerSeekRange);
  if (audioSource.ended) {
    playBtn.classList.remove("active");
    clearInterval(playInterval);
  }
};

const playMusic = function () {
  if (audioSource.paused) {
    audioSource.play();
    playBtn.classList.add("active");
    playInterval = setInterval(updateRunningTime, 500);
  } else {
    audioSource.pause();
    playBtn.classList.remove("active");
    clearInterval(playInterval);
  }
};
if (playBtn) playBtn.addEventListener("click", playMusic);

// Seek bar
if (playerSeekRange) {
  playerSeekRange.addEventListener("input", function () {
    audioSource.currentTime = this.value;
    updateRunningTime();
  });
}

// Range fill
const updateRangeFill = function (range) {
  if (!range) return;
  const fill = range.nextElementSibling;
  const percent = (range.value / range.max) * 100;
  if (fill) fill.style.width = `${percent}%`;
};
if (playerSeekRange) {
  playerSeekRange.addEventListener("input", function () {
    updateRangeFill(this);
  });
}

// Next/Prev
const playerSkipNextBtn = document.querySelector("[data-skip-next]");
const playerSkipPrevBtn = document.querySelector("[data-skip-prev]");

const skipNext = function () {
  lastPlayedMusic = currentMusic;
  currentMusic = (currentMusic + 1) % musicData.length;
  changePlaylistItem();
  changePlayerInfo();
  audioSource.currentTime = 0;
  if (!audioSource.paused) audioSource.play();
};
if (playerSkipNextBtn) playerSkipNextBtn.addEventListener("click", skipNext);

const skipPrev = function () {
  lastPlayedMusic = currentMusic;
  currentMusic = (currentMusic - 1 + musicData.length) % musicData.length;
  changePlaylistItem();
  changePlayerInfo();
  audioSource.currentTime = 0;
  if (!audioSource.paused) audioSource.play();
};
if (playerSkipPrevBtn) playerSkipPrevBtn.addEventListener("click", skipPrev);

// Shuffle
const playerShuffleBtn = document.querySelector("[data-shuffle]");
let isShuffle = false;
const shuffle = function () {
  isShuffle = !isShuffle;
  playerShuffleBtn.classList.toggle("active");
};
if (playerShuffleBtn) playerShuffleBtn.addEventListener("click", shuffle);

// Repeat
const playerRepeatBtn = document.querySelector("[data-repeat]");
const repeat = function () {
  audioSource.loop = !audioSource.loop;
  this.classList.toggle("active", audioSource.loop);
};
if (playerRepeatBtn) playerRepeatBtn.addEventListener("click", repeat);

// Volume
const playervolumeRange = document.querySelector("[data-volume]");
const playervolumeBtn = document.querySelector("[data-volume-btn]");
const changeVolume = function () {
  audioSource.volume = playervolumeRange.value / 100;
  audioSource.muted = false;
  if (audioSource.volume === 0) {
    playervolumeBtn.children[0].textContent = "volume_off";
  } else if (audioSource.volume <= 0.5) {
    playervolumeBtn.children[0].textContent = "volume_down";
  } else {
    playervolumeBtn.children[0].textContent = "volume_up";
  }
};
if (playervolumeRange) playervolumeRange.addEventListener("input", changeVolume);

const muteVolume = function () {
  if (!audioSource.muted) {
    audioSource.muted = true;
    playervolumeBtn.children[0].textContent = "volume_off";
  } else {
    audioSource.muted = false;
    changeVolume();
  }
};
if (playervolumeBtn) playervolumeBtn.addEventListener("click", muteVolume);

// Initialize player info and UI
