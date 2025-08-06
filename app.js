const express = require("express");
const app = express();
const {Server} = require("socket.io")
const http = require("http")
const path = require("path");
const { on } = require("events");

const server = http.createServer(app); // create HTTP server
const io = new Server(server); 

io.on("connection", function(socket) {
    socket.on("send-location", function(data){
        io.emit("received-location", {id: socket.id, ...data})
    })
        socket.on("disconnect", function(){
            io.emit("user-disconnected", server.id);
        })
})

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
    res.render("index")
})
server.listen(1000);