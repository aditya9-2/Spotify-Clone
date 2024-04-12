

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

const handleSongs = async () => {

    const songList = await getSongs();
    console.log(songList);

    const UlList = document.querySelector('.songLists').getElementsByTagName('ul')[0];

    for (const song of songList) {

        UlList.innerHTML = UlList.innerHTML + `

        
         <li>

            <img src="svg/music.svg" alt="music-svg">
            <div class="song-info">
                <p>${song.replaceAll('%20', ' ')}</p>
            </div>

            <div class="library-play-icon">
                <img src="svg/song-play.svg" alt="song-play">
            </div>

        </li>
        
        `;

    }

    const audio = new Audio(songList[0]);
    // audio.play();

};

handleSongs();