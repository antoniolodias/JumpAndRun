const express = require("express");
const app = express();
const server = require("http").Server(app);

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
server.listen(8080, () => {
    console.log("Listening on 8080");
});
