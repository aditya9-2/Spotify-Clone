let currentSong = new Audio();
let songList;

const leftSide = document.querySelector('.left');
const togglePrevious = document.getElementById('sprevious');
const togglePlay = document.getElementById('splay');
const toggleNext = document.getElementById('snext');
const songInformation = document.querySelector('.song-information');
const songTime = document.querySelector('.song-time');
const seekbar = document.querySelector('.seek-bar');
const seekbarCircle = document.querySelector('.circle');
const hamburger = document.querySelector('#hamburger-img');
const closeBtn = document.querySelector('#close-icon');

const getSongs = async () => {

    const songs = await fetch('http://127.0.0.1:5500/songs/');
    const response = await songs.text();

    const div = document.createElement('div');
    div.innerHTML = response;

    const as = div.getElementsByTagName('a');

    let tracks = [];

    for (let index = 0; index < as.length; index++) {

        const element = as[index];

        if (element.href.endsWith('.mp3')) {

            tracks.push(element.href.split('/songs/')[1]);
        }
    }
    return tracks;
};

const playMusic = (audioTrack, pause = false) => {

    currentSong.src = "/songs/" + audioTrack;

    if (!pause) {

        currentSong.play();
        togglePlay.src = "svg/song-pause.svg";
    }

    songInformation.innerHTML = decodeURI(audioTrack);

    songTime.innerHTML = '00:00 / 00:00';


};

const handlePlayPause = () => {

    if (currentSong.paused) {

        currentSong.play();
        togglePlay.src = "svg/song-pause.svg";
    }
    else {

        currentSong.pause();
        togglePlay.src = "svg/song-play.svg";
    }

};


const handlePreviousSong = () => {

    let index = songList.indexOf(currentSong.src.split('/').slice(-1)[0]);

    if ((index - 1) >= 0) {

        playMusic(songList[index - 1])
    }

};

const handleNextSong = () => {

    currentSong.pause();
    let index = songList.indexOf(currentSong.src.split('/').slice(-1)[0]);

    if ((index + 1) < songList.length) {

        playMusic(songList[index + 1])
    }


};

const secondsToMinutesSeconds = (seconds) => {

    if (isNaN(seconds) || seconds < 0) {

        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
};

const updateSongTime = () => {

    songTime.innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}
    / ${secondsToMinutesSeconds(currentSong.duration)}`;

    seekbarCircle.style.left = (currentSong.currentTime / currentSong.duration) * 99 + "%";

};

const moveSeekbar = (cursor) => {

    let percent = (cursor.offsetX / cursor.target.getBoundingClientRect().width) * 99;

    seekbarCircle.style.left = percent + "%";

    currentSong.currentTime = ((currentSong.duration) * percent) / 100;

};

const handleHamburger = () => {

    leftSide.style.left = '0';
    leftSide.style.backgroundColor = "black";
};

const handleCloseButton = () => {

    leftSide.style.left = '-110%'

};


const handleSongs = async () => {


    songList = await getSongs();

    const UlList = document.querySelector('.songLists').getElementsByTagName('ul')[0];

    for (const song of songList) {

        UlList.innerHTML = UlList.innerHTML + `

         <li>

            <img src="svg/music.svg" alt="music-svg">
            <div class="song-info">
                <div>${song.replaceAll('%20', ' ')}</div>
                
            </div>

            <div class="library-play-icon">
                <img src="svg/song-play.svg" alt="song-play">
            </div>

        </li> `;

    }

    playMusic(songList[0], true);

    const liSong = document.querySelector('.songLists');

    Array.from(liSong.getElementsByTagName('li')).forEach((e) => {

        e.addEventListener('click', () => {

            const play = e.querySelector('.song-info').firstElementChild.innerHTML.trim();
            playMusic(play);

        });
    });

    togglePlay.addEventListener('click', handlePlayPause);
    togglePrevious.addEventListener('click', handlePreviousSong);
    toggleNext.addEventListener('click', handleNextSong);
    currentSong.addEventListener('timeupdate', updateSongTime);
    seekbar.addEventListener('click', moveSeekbar);
    hamburger.addEventListener('click', handleHamburger);
    closeBtn.addEventListener('click', handleCloseButton);

};

handleSongs();