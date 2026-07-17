let songs = [];
let currentSong = null;

let score1 = 0;
let score2 = 0;


async function loadSongs() {

    try {

        const response =
            await fetch("songs.json");

        songs =
            await response.json();

        nextSong();

    }
    catch(error){

        alert(
            "songs.json konnte nicht geladen werden."
        );

        console.error(error);
    }
}


function addPoint(player){

    if(player === 1){

        score1++;

        document.getElementById("score1")
            .textContent = score1;
    }

    if(player === 2){

        score2++;

        document.getElementById("score2")
            .textContent = score2;
    }
}


function nextSong(){

    if(songs.length === 0){
        return;
    }

    const index =
        Math.floor(
            Math.random() * songs.length
        );

    currentSong = songs[index];

    document.getElementById("cardNumber")
        .textContent =
        "Karte #" + (index + 1);

    document.getElementById("songDisplay")
        .innerHTML =
        "🎵 Unbekannter Song";
}


function revealSong(){

    if(!currentSong){
        return;
    }

    document.getElementById("songDisplay")
        .innerHTML =
        `
        <div>
            <h2>${currentSong.artist}</h2>
            <p>${currentSong.title}</p>
            <h3>${currentSong.year}</h3>
        </div>
        `;
}


function searchSong(){

    if(!currentSong){
        return;
    }

    const searchText =
        encodeURIComponent(
            currentSong.artist +
            " " +
            currentSong.title
        );

    window.open(
        `https://music.apple.com/de/search?term=${searchText}`,
        "_blank"
    );
}


document
.getElementById("playButton")
.addEventListener(
    "click",
    searchSong
);

document
.getElementById("revealButton")
.addEventListener(
    "click",
    revealSong
);

document
.getElementById("nextButton")
.addEventListener(
    "click",
    nextSong
);

loadSongs();