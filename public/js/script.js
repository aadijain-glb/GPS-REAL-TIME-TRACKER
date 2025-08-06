// Firstly start the Server-------------------------------->
// npm install -g nodemon
// nodemon app
 
//  https://dashboard.ngrok.com/get-started/your-authtoken visit this website
// then open ngrok site and dashboard to find my authtoken and bash commands  in cmd after that use your link----------------------------->
// ngrok config add-authtoken 30v0EwoWiZGcKNINh2mopbVTgxu_4MQuTcgbwejonpMkzaJ2C 
// ngrok http 1000

const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const{latitude, longitude} = position.coords;
        socket.emit("send-location", {latitude, longitude});
    },(error)=>{
        console.error(error);
    },
    {
        enableHighAccuracy: true,
        maximumAge:0,
        timeout: 5000,

    }

    );
}
const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "aadijain",
}).addTo(map);

const marker = {};
socket.on("received-location", (data) =>{
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude]);

    if(marker[id]){
        marker[id].setLatLng([latitude, longitude]);
    }
    else{
        marker[id] = L.marker([latitude, longitude]).addTo(map);
    }
})

socket.on("user-disconnected" ,(id) =>{
    if(marker[id]){
        marker.removeLayer(marker[id]);
        delete marker[id];
    }
} )