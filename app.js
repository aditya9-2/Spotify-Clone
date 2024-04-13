let currentSong = new Audio();
let songList;
let currentFolder;


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
const volumeRange = document.querySelector('.range');
const card = document.getElementsByClassName('card');


getSongs = async (folder) => {

    currentFolder = folder;
    const songs = await fetch(`http://127.0.0.1:5500/${folder}`);
    const response = await songs.text();

    const div = document.createElement('div');
    div.innerHTML = response;

    const as = div.getElementsByTagName('a');

    songList = [];

    for (let index = 0; index < as.length; index++) {

        const element = as[index];

        if (element.href.endsWith('.mp3')) {

            songList.push(element.href.split(`/${folder}/`)[1]);
        }
    }


    const UlList = document.querySelector('.songLists').getElementsByTagName('ul')[0];
    UlList.innerHTML = "";

    for (const song of songList) {

        UlList.innerHTML = UlList.innerHTML + `

         <li>

            <img class="music-icon" src="svg/music.svg" alt="music-svg">
            <div class="song-info">
                <div>${song.replaceAll('%20', ' ')}</div>
                
            </div>

            <div class="library-play-icon">
                <img class="library-play" src="svg/play-button.svg" alt="song-play">
            </div>

        </li> `;

    }



    const liSong = document.querySelector('.songLists');

    Array.from(liSong.getElementsByTagName('li')).forEach((e) => {

        e.addEventListener('click', () => {

            const play = e.querySelector('.song-info').firstElementChild.innerHTML.trim();
            playMusic(play);

        });
    });


    return songList;
};


playMusic = (audioTrack, pause = false) => {

    currentSong.src = `/${currentFolder}/` + audioTrack;

    if (!pause) {

        currentSong.play();
        togglePlay.src = "svg/song-pause.svg";
    }

    songInformation.innerHTML = decodeURI(audioTrack);

    songTime.innerHTML = '00:00 / 00:00';


};


handlePlayPause = () => {

    if (currentSong.paused) {

        currentSong.play();
        togglePlay.src = "svg/song-pause.svg";
    }
    else {

        currentSong.pause();
        togglePlay.src = "svg/song-play.svg";
    }

};


handlePreviousSong = () => {

    let index = songList.indexOf(currentSong.src.split('/').slice(-1)[0]);

    if ((index - 1) >= 0) {

        playMusic(songList[index - 1])
    }

};


handleNextSong = () => {

    currentSong.pause();
    let index = songList.indexOf(currentSong.src.split('/').slice(-1)[0]);

    if ((index + 1) < songList.length) {

        playMusic(songList[index + 1])
    }


};


secondsToMinutesSeconds = (seconds) => {

    if (isNaN(seconds) || seconds < 0) {

        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
};


updateSongTime = () => {

    songTime.innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}
    / ${secondsToMinutesSeconds(currentSong.duration)}`;

    seekbarCircle.style.left = (currentSong.currentTime / currentSong.duration) * 99 + "%";

};


moveSeekbar = (cursor) => {

    let percent = (cursor.offsetX / cursor.target.getBoundingClientRect().width) * 99;

    seekbarCircle.style.left = percent + "%";

    currentSong.currentTime = ((currentSong.duration) * percent) / 100;

};


handleHamburger = () => {

    leftSide.style.left = '0';
    leftSide.style.backgroundColor = "black";
};


handleCloseButton = () => {

    leftSide.style.left = '-110%'

};


handleVolume = (event) => {

    currentSong.volume = parseInt(event.target.value) / 100;

};


loadPalyList = () => {

    Array.from(card).forEach((e) => {

        e.addEventListener('click', async (item) => {

            songList = await getSongs(`songs/${item.currentTarget.dataset.folder}`);

        });

    });

};



handleSongs = async () => {


    await getSongs('songs/ArijitSingh');
    playMusic(songList[0], true);



    togglePlay.addEventListener('click', handlePlayPause);
    togglePrevious.addEventListener('click', handlePreviousSong);
    toggleNext.addEventListener('click', handleNextSong);
    currentSong.addEventListener('timeupdate', updateSongTime);
    seekbar.addEventListener('click', moveSeekbar);
    hamburger.addEventListener('click', handleHamburger);
    closeBtn.addEventListener('click', handleCloseButton);
    volumeRange.getElementsByTagName('input')[0].addEventListener('change', handleVolume);

    loadPalyList();
};

handleSongs();