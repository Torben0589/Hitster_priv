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
let editIndex = null;

/* NAVIGATION */

function openDatabase(){
    document.getElementById("menu").classList.remove("active");
    document.getElementById("database").classList.add("active");
    renderSongs();
}

function goMenu(){
    document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
    document.getElementById("menu").classList.add("active");
}

/* SAVE SONG */

function saveSong(){

    let song = {
        title: document.getElementById("db-title").value,
        artist: document.getElementById("db-artist").value,
        year: document.getElementById("db-year").value,
        url: document.getElementById("db-url").value
    };

    if(editIndex !== null){
        songs[editIndex] = song;
        editIndex = null;
    } else {
        songs.push(song);
    }

    localStorage.setItem("songs", JSON.stringify(songs));

    clearForm();
    renderSongs();
}

/* LISTE */

function renderSongs(){

    let html = "";

    songs.forEach((s,i)=>{

        html += `
        <div class="card" style="margin-top:10px">

            <strong>${s.title}</strong><br>
            ${s.artist} (${s.year})

            <div style="margin-top:10px;">
                <button onclick="editSong(${i})">✏️</button>
                <button onclick="deleteSong(${i})">🗑️</button>
            </div>

        </div>
        `;
    });

    document.getElementById("song-list").innerHTML = html;
}

/* EDIT */

function editSong(i){
    let s = songs[i];

    document.getElementById("db-title").value = s.title;
    document.getElementById("db-artist").value = s.artist;
    document.getElementById("db-year").value = s.year;
    document.getElementById("db-url").value = s.url;

    editIndex = i;
}

/* DELETE */

function deleteSong(i){
    songs.splice(i,1);
    localStorage.setItem("songs", JSON.stringify(songs));
    renderSongs();
}

/* CLEAR */

function clearForm(){
    document.getElementById("db-title").value = "";
    document.getElementById("db-artist").value = "";
    document.getElementById("db-year").value = "";
    document.getElementById("db-url").value = "";
}

/* IMPORT */

function importSongs(){

    try{

        let data = JSON.parse(document.getElementById("import-data").value);

        songs = songs.concat(data);

        localStorage.setItem("songs", JSON.stringify(songs));

        renderSongs();

        alert("Import erfolgreich!");

    } catch(e){
        alert("Fehler im JSON!");
    }
}
function openDatabase(){
    document.getElementById("menu").classList.remove("active");
    document.getElementById("database").classList.add("active");
    renderSongs();
}
