
/* ================= DATA ================= */

let songs = JSON.parse(localStorage.getItem("songs") || "[]");

let teams = ["Team 1", "Team 2"];
let scores = [0, 0];
let currentTeam = 0;

let currentSong = null;
let revealed = false;
let editIndex = null;

/* ================= ELEMENTS ================= */

const player = document.getElementById("player");
const vinyl = document.getElementById("vinyl");

/* ================= HELPERS ================= */

function normalize(url){
    return url.replace("music.apple.com","embed.music.apple.com");
}

/* ================= NAVIGATION ================= */

function switchView(view){
    document.querySelectorAll(".view").forEach(v=>{
        v.classList.remove("active");
    });

    document.getElementById(view).classList.add("active");
}

function startGame(){
    switchView("game");
    nextSong();
}

function openDatabase(){
    switchView("database");
    renderSongs();
}

function goMenu(){
    switchView("menu");
}

/* ================= GAME ================= */

function nextSong(){

    if(!songs.length){
        alert("Keine Songs vorhanden!");
        return;
    }

    const index = Math.floor(Math.random() * songs.length);
    currentSong = songs[index];
    revealed = false;

    player.src = normalize(currentSong.url);
    player.style.opacity = "0";

    vinyl.style.display = "flex";
    vinyl.style.opacity = "1";
    vinyl.style.pointerEvents = "auto";
    vinyl.classList.add("spinning");

    document.getElementById("title").innerText = "🔒 Titel";
    document.getElementById("artist").innerText = "🔒 Interpret";
    document.getElementById("year").innerText = "🔒 Jahr";

    document.querySelectorAll(".point-card").forEach(el=>{
        el.classList.remove("selected");
    });
}

/* START PLAYBACK (User Interaction Trick) */

function startPlayback(){

    if(!currentSong) return;

    player.style.opacity = "1";

    vinyl.classList.remove("spinning");
    vinyl.style.opacity = "0.2";
    vinyl.style.pointerEvents = "none";
}

/* REVEAL */

function reveal(){

    if(!currentSong || revealed) return;

    revealed = true;

    vinyl.style.display = "none";

    player.style.opacity = "1";

    document.getElementById("title").innerText = currentSong.title;
    document.getElementById("artist").innerText = currentSong.artist;
    document.getElementById("year").innerText = currentSong.year;
}

/* ================= POINTS ================= */

document.querySelectorAll(".point-card").forEach(el=>{
    el.onclick = ()=> el.classList.toggle("selected");
});

function bookPoints(){

    if(!revealed) return;

    let pts = 0;

    document.querySelectorAll(".point-card.selected").forEach(el=>{
        pts += parseInt(el.dataset.points);
    });

    scores[currentTeam] += pts;

    currentTeam = (currentTeam + 1) % teams.length;

    updateScore();
}

/* ================= SCOREBOARD ================= */

function updateScore(){

    let html = "";

    teams.forEach((t,i)=>{

        html += `
        <div class="score-item ${i === currentTeam ? 'active-team' : ''}">
            <strong>${t}</strong>
            <span>${scores[i]}</span>

            <div class="score-bar">
                <div class="score-fill" style="width:${scores[i]*5}px"></div>
            </div>
        </div>
        `;
    });

    document.getElementById("scoreboard").innerHTML = html;
}

updateScore();

/* ================= DATABASE ================= */

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

function editSong(i){
    let s = songs[i];

    document.getElementById("db-title").value = s.title;
    document.getElementById("db-artist").value = s.artist;
    document.getElementById("db-year").value = s.year;
    document.getElementById("db-url").value = s.url;

    editIndex = i;
}

function deleteSong(i){
    songs.splice(i,1);
    localStorage.setItem("songs", JSON.stringify(songs));
    renderSongs();
}

function clearForm(){
    document.getElementById("db-title").value = "";
    document.getElementById("db-artist").value = "";
    document.getElementById("db-year").value = "";
    document.getElementById("db-url").value = "";
}

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
