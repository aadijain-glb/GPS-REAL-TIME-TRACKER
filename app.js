const express = require("express");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");

const server = http.createServer(app);

// socket.io with CORS fix
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// socket.io events
io.on("connection", (socket) => {

    socket.on("send-location", (data) => {
        io.emit("received-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);  // FIXED
    });
});

// view engine
app.set("view engine", "ejs");

// static files
app.use(express.static(path.join(__dirname, "public")));

// routes
app.get("/", (req, res) => {
    res.render("index");
});

// start server
server.listen(1000, () => {
    console.log("Server running on http://localhost:1000");
});
