const express = require("express");
const serverless = require("serverless-http");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const port = process.env.PORT || 3001;
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://ash-chess-game.netlify.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    let joineeNumber = 0;
    if (
      !(
        io.sockets.adapter.rooms.get(data) !== undefined &&
        io.sockets.adapter.rooms.get(data).size > 2
      )
    ) {
      socket.join(data);
      joineeNumber = io.sockets.adapter.rooms.get(data).size;
      socket.to(data).emit("no_of_users", {
        joinee: socket.id,
        color: joineeNumber == 1 ? "w" : "b",
        roomsize: io.sockets.adapter.rooms.get(data).size,
      });
    }
  });

  socket.on("peice_move", (data) => {
    socket.to(data.room).emit("move", data.fen);
  });
});

app.get("/api", (req, res) => {
  res.json({
    hello: "hi!",
  });
});

server.listen(port, () => {
  console.log("listening on port " + port);
});
