const apiKey = "7d1af272"; // Korvaa käytössäsi olevalla avaimella.
const movieSearch = document.getElementById("movieSearch");
const searchButton = document.getElementById("searchButton");
const movies = document.getElementById("movies");

searchButton.addEventListener("click", async function () {
  console.log("button clicked");
  const movieName = movieSearch.value;
  if (movieName.trim() === "") {
    movies.textContent = "Kirjoita elokuvan nimi.";
    return;
}
  console.log(movieName);
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(movieName)}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  if (data.Response === "False") {
    movies.textContent = "Elokuva ei löytynyt. Yrtitä uudelleen.";
    return;
  }
  movies.innerHTML = "";

  data.Search.forEach(function (movie) {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
        <img src="${movie.Poster}" alt="${movie.Title}">
    `;

    movies.appendChild(movieCard);
  });
});
