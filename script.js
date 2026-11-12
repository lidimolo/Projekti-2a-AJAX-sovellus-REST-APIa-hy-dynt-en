const apiKey = "7d1af272"; // Tässä käytetään avainta. OMDb API:n avain
const movieSearch = document.getElementById("movieSearch");
const searchButton = document.getElementById("searchButton");
const movies = document.getElementById("movies");
const resultsTitle = document.getElementById("resultsTitle");

//Tässä painetaan painiketta
searchButton.addEventListener("click", async function () {
  console.log("button clicked");
  const movieName = movieSearch.value;
  resultsTitle.hidden = true;
  
  //Tarkistamme trim-funktiolla, lähettääkö käyttäjä tyhjän kentän 
  if (movieName.trim() === "") {
    movies.textContent = "Kirjoita elokuvan nimi.";
    return;
  }

  //Tiedot tallennetaan sivun päivittämisen jälkeen
  localStorage.setItem("lastMovie", movieName);
  console.log(movieName);
  //Luodaan API-pyyntöosoite
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(movieName)}`;
  //Tämä on AJAX-pyyntö, fetch lähettää pyynnön Omdb:lle
  const response = await fetch(url);
  // Lukee vastauksen ja muuttaa tiedot JavaScriptiksi
  const data = await response.json();
  console.log(data);
  //Tulokset tarkistetaan; jos haku ei tuottanut tulosta, näytetään teksti
  if (data.Response === "False") {
    movies.textContent = "Elokuvia ei löytynyt. Yritä uudelleen.";
    return;
  }
    //Otsikko tulee näkyviin
  resultsTitle.hidden = false;
  //Näytetään, kuinka monta elokuvaa löytyi
  resultsTitle.textContent = `Tulokset (${data.Search.length})`;
  movies.innerHTML = "";
  //Täällä luodaan elokuvien kortteja
  data.Search.forEach(function (movie) {
    const movieCard = document.createElement("div");
    //Lisätään elementtiin CSS
    movieCard.classList.add("movie-card");
    //Lisätään CLICK-tapahtuma, ja kun sitä napsautetaan, siirrytään IMDB:n verkkosivustolle
    movieCard.addEventListener("click", function () {
    window.open(
        `https://www.imdb.com/title/${movie.imdbID}/`,
        "_blank",
        "noopener,noreferrer"
    );
});
  //Lisätään kortin sisältö sekä alt-teksti
    movieCard.innerHTML = `
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
        <img src="${movie.Poster}" alt="${movie.Title}">
    `;
    // Luodaan elokuvan arviointialue
  const ratingDiv = document.createElement("div");
  ratingDiv.classList.add("rating");

    // Haetaan käyttäjän aikaisempi arvio
  const savedRating = localStorage.getItem(`rating_${movie.imdbID}`);

  ratingDiv.innerHTML = `
    <p>Oma arvio</p>
    <div class="stars">
        ${[1, 2, 3, 4, 5].map(function (star) {
            return `<button class="star ${star <= Number(savedRating) ? "selected" : ""}" data-rating="${star}" type="button">★</button>`;
        }).join("")}
    </div>
`;

  movieCard.appendChild(ratingDiv);

  // Tallennetaan käyttäjän antama arvio
ratingDiv.querySelectorAll(".star").forEach(function (starButton) {
    starButton.addEventListener("click", function (event) {
        event.stopPropagation();

        const rating = Number(starButton.dataset.rating);

        localStorage.setItem(`rating_${movie.imdbID}`, rating);

        ratingDiv.querySelectorAll(".star").forEach(function (button) {
            button.classList.toggle(
                "selected",
                Number(button.dataset.rating) <= rating
            );
        });
    });
});

//Luotu kortti lisätään HTML-koodiin 
    movies.appendChild(movieCard);
  });
});
//Haku käynnistyy, kun painat ENTER-näppäintä
movieSearch.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchButton.click();
    }
});
//Näyttää viimeisimmät hakutulokset, kun sivu päivitetään

const lastMovie = localStorage.getItem("lastMovie");

if (lastMovie) {
    movieSearch.value = lastMovie;
    searchButton.click();
}
