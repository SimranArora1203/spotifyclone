console.log("let's write some javascript code");
let currentSong = new Audio();
let songs;
let currFolder;
console.log(currentSong.src);
function convertSecondsToMinutesAndSeconds(seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;
  return minutes + " : " + Math.floor(remainingSeconds);
}

const playmusic = (track, pause = false) => {
  currentSong.src = `/songs/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00/00:00";

  console.log(currentSong.src);
};
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/songs/${folder}`);
  let response = await a.text();
  console.log("response is :");
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  // console.log(div);
  let as = div.getElementsByTagName("a");
  console.log(as);
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  console.log("songs are" + songs);
  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  console.log("songUL : " + songUL);
  for (const song of songs) {
    let inputString = song;
    // console.log(inputString);

    songUL.innerHTML =
      songUL.innerHTML +
      `<li>

                            <i class="fa-solid fa-music hey"></i>
                            <div class="info">
                                <div> ${song}</div>

                                <div>Harry</div>
                            </div>
                            <div class="playNow">
                                <span class="playspan">Play Now</span>
                                <i class="fa-solid fa-play"></i>
                            </div>

      </li>`;
  }

  // Convert HTMLCollection to array
  let songListItems = Array.from(songUL.getElementsByTagName("li"));

  // Loop through each song list item
  songListItems.forEach((li) => {
    // console.log(li.getElementsByTagName("div")[0]);
    console.log(li.getElementsByTagName("div")[0]);
  });

  // attach an event listener with each song
  songListItems.forEach((li) => {
    li.addEventListener("click", (element) => {
      console.log(li.querySelector(".info").firstElementChild.innerHTML);
      playmusic(li.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
}
async function displayAlbum() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  console.log("display album");
  console.log(anchors);
  for (let index = 0; index < anchors.length; index++) {
    if (anchors[index].href.includes("/songs/")) {
      // console.log(anchors[index].href);
      let folder = anchors[index].href.split("/songs/")[1];
      console.log(folder);
      //get the meta data of folder
      let b = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await b.json();
      console.log(response);
      document.querySelector(".card-container").innerHTML =
        document.querySelector(".card-container").innerHTML +
        `
   <div class="card" data-folder="${folder}">
                        <div class="play-btn">
                            <i class="fa-solid fa-play play-icon"></i>
                        </div>
                        <img src="http://127.0.0.1:5500/songs/${folder}/cover.jpeg" class="card-img"
                            alt="no img found" />
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>
  
  `;
    }
  }
  //load the playlist whenver a card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    console.log("clicking on a card");
    console.log(e);
    e.addEventListener("click", async (item) => {
      console.log(item.currentTarget, item.currentTarget.dataset);
      songs = await getSongs(`${item.currentTarget.dataset.folder}`);
      playmusic(songs[0]);
    });
  });
}
async function main() {
  await getSongs("ncs");
  // console.log("songs are::");
  // console.log(songs);
  playmusic(songs[0], true);
  console.log(songs);
  // playmusic(songs[0], true);
  //play the first song
  // var audio = new Audio(songs[0]);
  //   audio.play();
  displayAlbum();
  //add event listener on play image
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });
  //listen for time Update Event
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(
      ".songtime"
    ).innerHTML = `${convertSecondsToMinutesAndSeconds(
      currentSong.currentTime
    )}/${convertSecondsToMinutesAndSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    // console.log(e.target, e.offsetX);
    console.log(e.target.getBoundingClientRect().width, e.offsetX);
    console.log((e.offsetX / e.target.getBoundingClientRect().width) * 100);
    let percent = e.offsetX / e.target.getBoundingClientRect().width;
    console.log(percent * 100);
    console.log(currentSong.duration);
    document.querySelector(".circle").style.left = percent * 100 + "%";
    console.log("t" + (currentSong.duration * (percent * 100)) / 100);
    currentSong.currentTime = (currentSong.duration * (percent * 100)) / 100;
    console.log(convertSecondsToMinutesAndSeconds(97.630053496372));
  });
  //add an event listener for hamburger menu
  document.querySelector(".hamburgerdiv").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  //add an event listener for close button
  document.querySelector(".closediv").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-122%";
  });

  //add an event listener to prev and next
  next.addEventListener("click", () => {
    currentSong.pause();
    console.log("Next Clicked");
    console.log(currentSong.src);
    console.log(currentSong.src.split("/songs/")[1]);
    let index = songs.indexOf(
      currentSong.src.split(`/songs/${currFolder}/`)[1]
    );
    // let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    console.log(index);
    if (index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });

  previous.addEventListener("click", () => {
    currentSong.pause();
    console.log("previous called");
    // let index = songs.indexOf(currentSong.src.split("/songs/")[1]);
    // let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    let index = songs.indexOf(
      currentSong.src.split(`/songs/${currFolder}/`)[1]
    );
    console.log(index);
    if (index - 1 >= 0) {
      playmusic(songs[index - 1]);
    }
  });
  //add a event listener to volume

  document.querySelector(".timeVol").addEventListener("click", () => {
    let volsElement = document.querySelector("#vols");
    volsElement.style.display =
      volsElement.style.display === "block" ? "none" : "block";
  });
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log(e, e.target, e.target.value);
      console.log(parseInt(e.target.value) / 100);
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  // event listener to mute the track
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    console.log(e.target);
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentSong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentSong.volume = 0.9;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  });
}
main();
