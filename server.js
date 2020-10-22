require("dotenv").config();
const express = require("express");
const app = express();
const spotifyApiController = require("./controllers/spotify-api");

const port = process.env.PORT || 3000;
app.use(express.static("public", { extensions: ["html"] }));

app.get("/api/search/songs", spotifyApiController.searchTracks);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
