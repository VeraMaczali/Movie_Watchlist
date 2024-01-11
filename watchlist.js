const apikey = "423295d6";
const movieContainer = document.querySelector("#movie-container");
let myWatchlist = JSON.parse(localStorage.getItem("myWatchlist")) || [];

if (myWatchlist.length > 0) {
  document.querySelector(".watchlist").classList.add("hidden");
  movieContainer.classList.remove("flex");
  renderWatchlist();
} else {
  document.querySelector(".watchlist").classList.remove("hidden");
}
function renderWatchlist() {
  myWatchlist.forEach(async (id) => {
    let movie = await getMoviesFromLocalStorage(id);
    const div = document.createElement("div");
    div.classList.add("movie", "grid");
    div.setAttribute("data-filmid", movie.imdbID);
    div.innerHTML = `
          <img src="${movie.Poster}" class="poster" alt="${movie.Title}" />
              <div class="movie-card">
                <div class="movie-top">
                  <h2 class="title">${movie.Title}</h2>
                  <p>
                    <i class="fa-solid fa-star"></i>
                    <span class="rating">${movie.imdbRating}</span>
                  </p>
                </div>
                <div class="movie-middle">
                  <p><span class="duration">${movie.Runtime}</span> min</p>
                  <p class="genre">${movie.Genre}</p>
                  <button class="add-remove add remove" data-filmid=${movie.imdbID}>
                    <img src="./img/remove_icon.svg" alt="" /> Remove
                  </button>
                </div>
                <p class="description">
                  ${movie.Plot}
                </p>
              </div>
          `;
    movieContainer.appendChild(div);
  });
}

async function getMoviesFromLocalStorage(id) {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${apikey}&i=${id}`);
  const data = await res.json();
  return data;
}

movieContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove")) {
    e.target.parentElement.parentElement.parentElement.remove();
    myWatchlist = myWatchlist.filter(
      (item) => item !== e.target.dataset.filmid
    );
    localStorage.setItem("myWatchlist", JSON.stringify(myWatchlist));
    if (myWatchlist.length === 0) {
      document.querySelector(".watchlist").classList.remove("hidden");
      movieContainer.classList.add("flex");
    }
  }
});
