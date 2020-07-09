"use strict";
const morgan = require("morgan");

const { top50 } = require("./data/top50");
const { books } = require("./data/books");

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
      res.render("pages/song-page", {
        title: `Song ${currentSong.rank}`,
        song: currentSong,
      });
    } else if (id > 50 || id < 1) {
      res.status(404);
      res.render("pages/fourOhFour", {
        title: "I got nothing",
        path: req.originalUrl,
      });
    }
  });
});

// Book Functions

const handleBooks = (req, res) => {
  res.status(200).render("pages/books", { title: "List of Classics", books });
};

const handleBookPage = (req, res) => {
  const id = req.params.id;
  let currentBook = {};
  books.forEach((book) => {
    if (book.id == id) {
      currentBook = book;
      res.render("pages/book-page", {
        title: `${currentBook.title} `,
        book: currentBook,
      });
    }
  });
};

// Book endpoint
app.get("/books", handleBooks);
app.get("/book-page/:id", handleBookPage);

// handle 404s
app.get("/", (req, res) => {
  res.status(404);
  res.render("pages/fourOhFour", {
    title: "I got nothing",
    path: req.originalUrl,
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
