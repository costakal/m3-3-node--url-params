"use strict";
const morgan = require("morgan");

const { top50 } = require("./data/top50");

const PORT = process.env.PORT || 8000;

const express = require("express");
const app = express();

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// endpoints here
app.get("/top50", (req, res) => {
  res.render("pages/top50", {
    title: "Top 50 Songs Streamed on Spotify",
    top50,
  });
});

app.get("/top50/song/:id", (req, res) => {
  let currentSong = {};
  const id = req.params.id;
  top50.forEach((song) => {
    if (song.rank == id) {
      currentSong = song;
    }
  });
  res.render("pages/song-page", {
    title: `Song ${currentSong.rank}`,
    song: currentSong,
  });
});

// handle 404s
app.get("/", (req, res) => {
  res.status(404);
  res.render("pages/fourOhFour", {
    title: "I got nothing",
    path: req.originalUrl,
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
