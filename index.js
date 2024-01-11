const search = document.querySelector(".search-bar");
const searchTerm = document.querySelector("#search-term");
const starter = document.querySelector(".starter");
const watchlist = document.querySelector(".watchlist");
const noSuccess = document.querySelector(".no-success");
const apikey = "423295d6";

async function searchMovie(e) {
  e.preventDefault();
  const res = await fetch(
    `http://omdbapi.com/?apikey=${apikey}&s=${searchTerm.value}&type=movie`
  );
  const data = await res.json();
  let movieArray = data.Search;
  if (movieArray) {
    starter.classList.add("hidden");
    noSuccess.classList.add("hidden");
    movieArray.forEach(async (movie) => {
      const movieIMDB = await getMovieDetails(movie.imdbID);
      console.log(movieIMDB);
      const div = document.createElement("div");
      div.classList.add("movie", "grid");
      div.innerHTML = `
      <img src="${movieIMDB.Poster}" class="poster" alt="${movieIMDB.Title}" />
          <div class="movie-card">
            <div class="movie-top">
              <h2 class="title">${movieIMDB.Title}</h2>
              <p>
                <i class="fa-solid fa-star"></i>
                <span class="rating">${movieIMDB.imdbRating}</span>
              </p>
            </div>
            <div class="movie-middle">
              <p><span class="duration">${movieIMDB.Runtime}</span> min</p>
              <p class="genre">${movieIMDB.Genre}</p>
              <button class="add-remove add">
                <img src="./img/add_icon.svg" alt="" /> Watchlist
              </button>
            </div>

            <p class="description">
              ${movieIMDB.Plot}
            </p>
          </div>
      `;
      document.querySelector(".movie-list").appendChild(div);
    });
  } else {
    starter.classList.add("hidden");
    noSuccess.classList.remove("hidden");
    document.querySelector(".movie-list").innerHTML = "";
  }
}

async function getMovieDetails(id) {
  const res = await fetch(`http://www.omdbapi.com/?apikey=${apikey}&i=${id}`);
  const data = await res.json();
  return data;
}

search.addEventListener("submit", searchMovie);
