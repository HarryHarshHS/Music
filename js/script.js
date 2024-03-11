console.log("Spotify clone !!!!!!!!")

let currentSong = new Audio();
let currentFolder;
let currentVolume;


//time conversion function is here---------------------------------------------------------------------
function convertTimeToMinutesSeconds(totalSeconds) {
if (isNaN(totalSeconds) || totalSeconds<0) {
    return "00:00";
}
    totalSeconds = Math.floor(totalSeconds);
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
}




// GetSongs function is here-----------------------------------------------------------------------------
async function getSongs(folder){
    currentFolder=folder;
    let a= await fetch(`${folder}/`);
    //~`D:\webd\code with harry\Spotify_Clone` 
    let response =await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    songs=[];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".m4a")) {
            songs.push(element.href.split(`/${currentFolder}/`)[1].split(".m4a")[0]);
        }
        
    }
  
let songUl= document.querySelector(".songList").getElementsByTagName("ul")[0];
songUl.innerHTML="";
for (const song of songs) {
    songUl.innerHTML=songUl.innerHTML+`
    
    <li>
                        <img src="images/music.svg" alt="music">
                        <div class="infoOriginal" >
                        <div> ${song.replaceAll("%20"," ")}</div>
                       
                        </div>
                        <div class="info">
                        <div>${song.replaceAll("%20"," ").replaceAll("_"," ").replaceAll("%2C"," ")}</div>
                        </div>
                        <img src="images/play.svg" alt="play">
                    </li>
    `;
}


Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{

    e.addEventListener("click",element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML);
        playMusic(e.querySelector(".infoOriginal").firstElementChild.innerHTML.trim());
    })
});
return songs;
}




// PlayMusic function is here--------------------------------------------------------------------
const playMusic=(track,pause=false)=>{
    currentSong.src=`/${currentFolder}/`+track+".m4a";
    if (!pause) {
        currentSong.play();
        play.src="images/pause.svg";
    }
    document.querySelector(".songInfo").innerHTML=decodeURI(track).replaceAll("_"," ").replaceAll("%2C","");
    document.querySelector(".songTime").innerHTML="00:00/00:00";
    
}




//display albums function is here--------------------------------------------------------------------

 async function displayAlbums(){
    let a= await fetch(`songs/`);
    let response =await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let anchors=div.getElementsByTagName("a");
    let cardContainer=document.querySelector(".cardContainer");

    let array=Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        
      if (e.href.includes("/Playlist")) {
        let folder=e.href.split('/').slice(-2)[1];
        let folder2=folder.split("Playlist_")[1];
        let a= await fetch(`songs/${folder}/info.json`);
        let response =await a.json();
        console.log(response);
        cardContainer.innerHTML=cardContainer.innerHTML+` <div data-folder="${folder2}" class="card flex flexDirection">

        <div class="playBox"><button class="playBtn flex alignItems justify"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="black" d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
            </button>
            </div>
        <img src="songs/${folder}/cover.jpeg" alt="img">
        <div class="heading"> ${response.title}</div>
       <div class="para"> ${response.description} </div>
        
        </div>`
       }
    };
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click",async item=>{
            songs=await getSongs(`songs/playlist_${item.currentTarget.dataset.folder}`)
            playMusic(songs[0]);
        })
    });
   
}

displayAlbums();



// main function is here---------------------------------------------------------------------------
async function main(){

await getSongs("songs/Playlist_Bassick");
playMusic(songs[0],true);

play.addEventListener("click",()=>{
    if (currentSong.paused) {
        currentSong.play();
        play.src="images/pause.svg";
    } else {
        currentSong.pause();
        play.src="images/play.svg";
    }
});



//-------------this is for updating the time inside the seekbar--------------------------------------------
currentSong.addEventListener("timeupdate",()=>{
    document.querySelector(".songTime").innerHTML=`${convertTimeToMinutesSeconds(currentSong.currentTime)}/${convertTimeToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";
});




//------------this is for the making the functioning of the seekbar-------------------------------------------
document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left=percent+"%";
    currentSong.currentTime=(currentSong.duration*percent)/100;
})




//----------Hamburger working is here--------------------------------------------------
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left=0;
})

//-----------cross button to remove the left pannel-----------------------------------------------------
document.querySelector(".cross").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-133%";
})




//------------------for playing the previous song---------------------------------------------------
previous.addEventListener("click",()=>{
    console.log("Previouos clicked");
    let index=songs.indexOf( currentSong.src.split("/").slice(-1)[0].split(".m4a")[0]);
    console.log(index);
    if (index-1>=0) {
        playMusic(songs[index-1]);
    }
})



//------------------for playing the next song---------------------------------------------------
next.addEventListener("click",()=>{
    console.log("Next clicked");
    let index=songs.indexOf( currentSong.src.split("/").slice(-1)[0].split(".m4a")[0]);
    console.log(index);
    if (index+1<songs.length) {
        playMusic(songs[index+1]);
    }
})



//this is to adjust the volume of song with range---------------------------------------------------------
document.querySelector(".volumeBtn").addEventListener("change",(e)=>{
    currentSong.volume=parseInt(e.target.value)/100;
})



//this is for mute button-------------------------------------------------------------------------------------
document.querySelector(".volumeImg").addEventListener("click",(e)=>{

if (e.target.src.includes("volume.svg")) {
    e.target.src=e.target.src.replace("volume.svg","mute.svg");
    currentVolume=currentSong.volume;
    currentSong.volume=0;
    document.querySelector(".volumeBtn").value=0;
}
else{
    e.target.src=e.target.src.replace("mute.svg","volume.svg");
    currentSong.volume=currentVolume;
    document.querySelector(".volumeBtn").value=currentVolume*100; 
}

})


}

main()


