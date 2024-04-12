let currentSong;

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

const playMusic = (audioTrack) => {
    const audio = new Audio("/songs/" + audioTrack);
    // audio.play();

};

const handleSongs = async () => {


    const songList = await getSongs();
    console.log(songList);

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

    const liSong = document.querySelector('.songLists');
    Array.from(liSong.getElementsByTagName('li')).forEach((e) => {

        e.addEventListener('click', (element) => {
            const play = e.querySelector('.song-info').firstElementChild.innerHTML.trim();
            playMusic(play);
        });
    });

};

handleSongs();