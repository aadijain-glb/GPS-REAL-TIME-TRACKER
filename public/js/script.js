const socket = io();

let map;
let userMarker;

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      if (!map) {
        map = L.map("map").setView([latitude, longitude], 16);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "aadijain",
        }).addTo(map);

        userMarker = L.marker([latitude, longitude]).addTo(map);
      } else {
        userMarker.setLatLng([latitude, longitude]);
        map.setView([latitude, longitude]);
      }

      socket.emit("send-location", { latitude, longitude });
    },
    (error) => console.error(error),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
}

const markers = {};
socket.on("received-location", (data) => {
  const { id, latitude, longitude } = data;

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
