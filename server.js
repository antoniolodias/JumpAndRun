const express = require("express");
const app = express();
const server = require("http").Server(app);

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
// app.get("/level01", (req, res) => {
//     res.sendFile(__dirname + "/level01.html");
// });
//
// app.get("/level02", (req, res) => {
//     res.sendFile(__dirname + "/index_level02.html");
// });

server.listen(8080, () => {
    console.log("Listening on 8080");
});
