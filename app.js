

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

    const OlList = document.querySelector('.songLists').getElementsByTagName('ol')[0];

    for (const song of songList) {

        OlList.innerHTML = OlList.innerHTML + `<li>${song}</li>`;

    }

    const audio = new Audio(songList[0]);
    // audio.play();

};

handleSongs();