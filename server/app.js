const request = require("request");
const express = require("express");
const app = express();

var port = process.env.PORT || 5000;

var key = "60de1139";
// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=60de1139
//example: http://www.omdbapi.com/?apikey=60de1139&t=Mr+Nobody -> info
//example: http://img.omdbapi.com/?apikey=[yourkey]& -> poster

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded());
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index", { movieResult: null, error: null });
});

app.post("/movieSearch", (req, res) => {
  let movie = req.body.movieName;
  let stringToSearch = movie.replace(" ", "+");
  let url = `http://www.omdbapi.com/?apikey=${key}&s=${stringToSearch}`; //URL

  request(url, (err, response, body) => {
    if (err) {
      res.render("index", {
        movieResult: null,
        error: "Error, please try another movie name again!",
      });
    } else {
      let movieJSON = JSON.parse(body);
      console.log("movieJSON :", movieJSON[0]);
      let movieTitles = [];

      movieJSON.Search.forEach((movie) => {
        movieTitles.push({
          Title: movie.Title,
          Poster: movie.Poster,
          Year: movie.Year,
        });
      });
      console.log("movieTitles :", movieTitles);
      res.render("movie", { movieResult: movieTitles, error: null }); //if you change to movie, it will go to movie.ejs
    }
  });
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server started on ${port}`);
});
