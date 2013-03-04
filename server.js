// Generated by CoffeeScript 1.5.0-pre
var app, crypto, fs, handler, io;

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

crypto = require("crypto");

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
    var md5sum;
    md5sum = crypto.createHash("md5");
    md5sum.update(socket.id);
    return io.sockets["in"]("room").emit("chat", {
      sender: md5sum.digest("hex"),
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
