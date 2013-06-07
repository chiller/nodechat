// Generated by CoffeeScript 1.6.2
var app, fs, handler, io;

handler = function(req, res) {
  return fs.readFile(__dirname + "/index.html", function(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading index.html");
    }
    res.writeHead(200);
    return res.end(data);
  });
};

app = require("http").createServer(handler);

io = require("socket.io").listen(app);

fs = require("fs");

app.listen(8080);

io.sockets.on("connection", function(socket) {
  socket.join("room");
  io.sockets["in"]("room").emit("chat", {
    sender: "system",
    hello: "Client connected"
  });
  socket.emit("news", {
    sender: "system",
    hello: "Hello world"
  });
  socket.on("chat", function(data) {
    return io.sockets["in"]("room").emit("chat", {
      sender: "chat",
      hello: data.hello
    });
  });
  return socket.on("disconnect", function() {
    return io.sockets["in"]("room").emit("chat", {
      sender: "system",
      hello: "Client disconnect"
    });
  });
});
