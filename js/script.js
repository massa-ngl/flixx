const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    API_KEY: "dcec2d9c0fcddd5332b5c20e8d21f06a",
    API_URL: "https://api.themoviedb.org/3/",
  },
};

// Highlight active link
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach(function (link) {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.toggle("active");
    }
  });
}

// Alert function
function showAlert(message, className = "error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
}

async function fetchAPIData(endpoint) {
  showSpinner();
  const response = await fetch(
    `${global.api.API_URL}${endpoint}?api_key=${global.api.API_KEY}&language=en-US`,
  );

  const data = await response.json();

  hideSpinner();
  return data;
}

// display popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");

  results.forEach(function (movie) {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <div class="card border-4 border-[#04376b]  hover:scale-105 hover:bg-[#0a4b8f] transition-all duration-600 ease-in-out">
        <a href="/movie-details.html?id=${movie.id}" class="cursor-pointer">
          ${
            movie.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="w-full">`
              : `<img src="/images/no-image.jpg" alt="${movie.title}" class="w-full">`
          }
        </a>
        <div class="bg-[#04376b] p-2">
          <h3 class="font-bold text-white-text-xl capitalize">${movie.title}</h3>
          <p class="capitalize">Release: <span>${movie.release_date}</span></p>
        </div>
      </div>`;

    document.querySelector("#popular-movies").appendChild(div);
  });
}

// display movie details
async function displayMovieDetails() {
  const movieID = window.location.search.split("=")[1];

  const movie = await fetchAPIData(`/movie/${movieID}`);
  document.querySelector("title").innerHTML = `Flixx | ${movie.title}`;

  // Overlay for background image
  displayBackgroundImage("movie", movie.backdrop_path);

  const section1 = document.createElement("section");
  section1.innerHTML = `
    <div class="container w-full max-w-300 my-0 mx-auto py-0 px-5">
      <a href="/index.html" class="back-btn capitalize px-4.5 py-1 cursor-pointer rounded-[5px] hover:bg-[#f1c40f] hover:text-black border border-[#f1c40f] bg-black text-white transition-all duration-800 ease-in-out">back to movies</a>
    </div>

    <div class="container w-full max-w-300 mt-12 mx-auto py-0 px-5 flex flex-col lg:flex-row justify-center items-center gap-8">
        
      <div class="image_sec flex-1 p-0">
        ${
          movie.poster_path
            ? `<img class="w-full bg-cover rounded-md" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">`
            : `<img class="w-full bg-cover rounded-md" src="/images/no-image.jpg" alt="${movie.title}">`
        }
      </div>

      <div class="text_sec flex-[350px] text-center md:text-left">
        <div class="movie_title mb-4">
          <h3 class="text-center uppercase font-bold text-gray-200 text-2xl">${movie.title}</h3>
        </div>
            
        <div class="rating">
          <i class="fas fa-star text-[#f1c40f]"></i> ${movie.vote_average.toFixed(1)} / 10
        </div>

        <div class="release_date mt-4">Release Date: ${movie.release_date}</div>
            
        <div class="description mt-4">
        ${movie.overview}
        </div>
            
        <div class="genres mt-4 flex justify-center items-center gap-4 md:block">
          <h4>Genres: </h4>
          <ul class="flex items-center justify-center gap-2 md:block">
            ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
          </ul>
        </div>
        <div class="homepage-btn mt-6 flex justify-center items-center md:block">
          <div class="movie_website max-w-fit capitalize px-4.5 py-1 cursor-pointer rounded-[5px] hover:bg-[#f1c40f] hover:text-black border border-[#f1c40f] bg-black text-white transition-all duration-800 ease-in-out">
            <a href="${movie.homepage}" target="_blank">visit movie homepage</a>
          </div>
        </div>
      </div>
    </div>`;

  document.querySelector("#movie-details").appendChild(section1);

  const section2 = document.createElement("section");
  section2.classList.add("mt-12");
  section2.innerHTML = `
      <h3 class="text-center uppercase font-bold text-gray-200 text-2xl">movie info</h3>
      <div class="container w-full max-w-300 my-0 mx-auto py-0 px-5">
        <div class="budget border-b border-gray-500 py-2">
          <span class="text-[#f1c40f]  font-semibold">Budget: </span>$${addCommasToNumber(
            movie.budget,
          )}
        </div>
        <div class="revenue border-b border-gray-500 py-2">
          <span class="text-[#f1c40f]  font-semibold">Revenue: </span>$${addCommasToNumber(
            movie.revenue,
          )}
        </div>
        <div class="runtime border-b border-gray-500 py-2">
          <span class="text-[#f1c40f]  font-semibold">Runtime: </span>${formatTime(movie.runtime)}
        </div>
        <div class="status border-b border-gray-500 py-2">
          <span class="text-[#f1c40f]  font-semibold">Status: </span>${movie.status}
        </div>
        <div class="production_companies pt-2">
          <h4 class="font-semibold">Production Companies</h4>
          ${movie.production_companies
            .map((production_company) => `<p>${production_company.name}</p>`)
            .join("")}
        </div>
      </div>`;

  document.querySelector("#movie-details").appendChild(section2);
}

// display popular shows
async function displayPopularShows() {
  const { results } = await fetchAPIData("tv/popular");
  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <div class="card border-4 border-[#04376b]  hover:scale-105 hover:bg-[#0a4b8f] transition-all duration-600 ease-in-out">
        <a href="/tv-details.html?id=${show.id}" class="cursor-pointer">
          ${
            show.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500/${show.poster_path}" alt="${show.name}" class="w-full">`
              : `<img src="/images/no-image.jpg" alt="${show.name}" class="w-full">`
          }
        </a>
        <div class="bg-[#04376b] p-2">
          <h3 class="font-bold text-white-text-xl capitalize">${show.name}</h3>
          <p class="capitalize">aired: <span>${show.first_air_date}</span></p>
        </div>
      </div>`;

    document.querySelector("#popular-shows").appendChild(div);
  });
}

// display TV details
async function displayTVDetails() {
  const showID = window.location.search.split("=")[1];
  // console.log(showID);

  const show = await fetchAPIData(`tv/${showID}`);
  document.querySelector("title").innerHTML = `Flixx | ${show.name}`;

  // Overlay for background image
  displayBackgroundImage("tv", show.backdrop_path);

  const section1 = document.createElement("section");
  section1.innerHTML = `
    <section>
      <div class="container w-full max-w-300 my-0 mx-auto py-0 px-5">
        <a href="/shows.html" class="back-btn capitalize px-4.5 py-1 cursor-pointer rounded-[5px] hover:bg-[#f1c40f] hover:text-black border border-[#f1c40f] bg-black text-white transition-all duration-800 ease-in-out">
        back to 
        <span class="uppercase">tv</span> shows
        </a>
      </div>

      <div class="container w-full max-w-300 mt-12 mx-auto py-0 px-5 flex flex-col lg:flex-row justify-center items-center gap-8">
        <div class="image_sec flex-1 p-0">
        ${
          show.poster_path
            ? `<img class="w-full bg-cover rounded-md" src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}">`
            : `<img class="w-full bg-cover rounded-md" src="/images/no-image.jpg" alt="${show.name}">`
        }
        </div>

        <div class="text_sec flex-[350px] text-center md:text-left">
          <div class="movie_title mb-4">
            <h3 class="text-center uppercase font-bold text-gray-200 text-2xl">${show.name}</h3>
          </div>
          
          <div class="rating">
            <i class="fas fa-star text-[#f1c40f]"></i> ${show.vote_average.toFixed(1)} / 10
          </div>

          <div class="release_date mt-4">Last Air Date: ${show.last_air_date}</div>
          
          <div class="description mt-4">${show.overview}</div>
          
          <div class="genres mt-4 flex justify-center items-center gap-4 md:block">
            <h4>Genres: </h4>
            <ul class="flex items-center justify-center gap-2 md:block">
              ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            </ul>
          </div>
          <div class="homepage-btn mt-6 flex justify-center items-center md:block">
            <div class="movie_website max-w-fit capitalize px-4.5 py-1 cursor-pointer rounded-[5px] hover:bg-[#f1c40f] hover:text-black border border-[#f1c40f] bg-black text-white transition-all duration-800 ease-in-out">
              <a href="${show.homepage}" target="_blank">visit show homepage</a>
              </div>
          </div>
        </div>
      </div>
    </section>`;

  document.querySelector("#tv-details").appendChild(section1);

  const section2 = document.createElement("section");
  section2.classList.add("mt-12");
  section2.innerHTML = `
    <section>
      <h3 class="text-center uppercase font-bold text-gray-200 text-2xl">movie info</h3>
      <div class="container w-full max-w-300 my-0 mx-auto py-0 px-5">
        <div class="budget border-b border-gray-500 py-2">
          <span class="text-[#f1c40f] capitalize font-semibold">number of episodes: </span>${show.number_of_episodes}
        </div>
        <div class="revenue border-b border-gray-500 py-2">
          <span class="text-[#f1c40f] capitalize font-semibold">last episode to air: </span>${show.last_episode_to_air.name}
        </div>
        <div class="status border-b border-gray-500 py-2">
          <span class="text-[#f1c40f] capitalize font-semibold">Status: </span>${show.status}
        </div>
        <div class="production_companies pt-2">
          <h4 class="font-semibold">Production Companies</h4>
          ${show.production_companies
            .map((production_company) => `<p>${production_company.name}</p>`)
            .join("")}
        </div>
      </div>
    </section>
  `;
  document.querySelector("#tv-details").appendChild(section2);
}

// add commas to numbers
function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// format time to hours:minutes time format
function formatTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}`;
  if (minutes === 0) return `${hours} h`;

  return `${hours}h ${minutes}m`;
}

// display backdrop image
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.2";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#tv-details").appendChild(overlayDiv);
  }
}

// display swiper slider
async function displaySlider() {
  const { results } = await fetchAPIData("movie/now_playing");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = `
      <a href="/movie-details.html?id=${movie.id}">
        <img class="block object-cover h-full w-full" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      </a>
      <h4 class="swiper-rating p-2.5 text-center">
        <i class="fas fa-star text-secondary text-[#f1c40f]"></i> ${movie.vote_average.toFixed(1)} / 10
      </h4>`;

    document.querySelector(".swiper-wrapper").appendChild(div);

    initSwiper();
  });
}
// initalize swiper
function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPeriew: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnIteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

// Search for Movies and TV shows
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  if (global.search.term !== "" && global.search.term !== null) {
    // @todo - make request & display results
    const { results, pages, total_pages, total_results } = await searchAPIData();
    global.search.totalResults = total_results;

    // global.search.page = pages;
    global.search.totalPages = total_pages;

    if (results.length === 0) {
      showAlert("No results found", "alert-success");
    }

    displaySearchResults(results);

    document.querySelector("#search-term").value = "";
  } else {
    showAlert("Please enter a search term");
  }
}

// Display Search Results
function displaySearchResults(results) {
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <div class="border-4 border-[#04376b]  hover:scale-105 hover:bg-[#0a4b8f] transition-all duration-600 ease-in-out">
        <a href="${global.search.type}-details.html?id=${result.id}" class="cursor-pointer">
          ${
            result.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="
            ${
              global.search.type === "movie"
                ? `${result.title}`
                : `${result.name}`
            }" class="w-full">`
              : `<img src="/images/no-image.jpg" alt="
            ${
              global.search.type === "movie"
                ? `${result.title}`
                : `${result.name}`
            }" class="w-full">`
          }
        </a>
        <div class="bg-[#04376b] p-2">
          <h3 class="font-bold text-white-text-xl capitalize">${
            global.search.type === "movie"
              ? `${result.title}`
              : `${result.name}`
          }</h3>
          <p class="capitalize"><span>${
            global.search.type === "movie"
              ? `Released: ${result.release_date}`
              : `Aired: ${result.first_air_date}`
          }</span></p>
        </div>
      </div>`;

    document.querySelector("#search-results").appendChild(div);

    document.querySelector("#search-results-heading").innerHTML = `
      <h2 class="text-center text-2xl mt-14 font-bold uppercase">
        ${results.length} of ${global.search.totalResults} Results for ${global.search.term}
      </h2>`;
  });

  displayPagination();
}

// Search API Data
async function searchAPIData() {
  const API_KEY = global.api.API_KEY;
  const API_URL = global.api.API_URL;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`,
  );

  const data = await response.json();

  hideSpinner();

  return data;
}

// Create & Display Pagination For Search
function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
    <div class="container w-full max-w-300 my-0 mx-auto py-0 px-5 mt-2">
      <div>
        <button id="prev" class="prev capitalize max-w-fit px-4.5 py-1 cursor-pointer rounded-[5px] hover:bg-[#f1c40f] hover:text-black border border-[#f1c40f] bg-black text-white transition-all duration-800 ease-in-out">prev</button>
        <button id="next" class="next capitalize max-w-fit px-4.5 py-1 cursor-pointer rounded-[5px] hover:bg-[#f1c40f] hover:text-black border border-[#f1c40f] bg-black text-white transition-all duration-800 ease-in-out">next</button>
      </div>
      <div class="mt-2">
        Page 
        <span class="active_page_number">${global.search.page}</span> of 
        <span class="total_page_number">${global.search.totalPages}</span>
      </div>
    </div>`;

  document.querySelector("#pagination").appendChild(div);

  // Disable prev button if on first page
  if (global.search.page === 1) {
    // document.querySelector("#prev").disabled = true;
    document.querySelector("#prev").style.pointerEvents = "none";
    document.querySelector("#prev").style.cursor = "not-allowed";
    document.querySelector('#prev').style.backgroundColor = "#c6c6c6a0";
    document.querySelector('#prev').style.color = "#c6c6c6a0";
    document.querySelector('#prev').style.borderColor = "transparent";
  }
  
  // Disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    // document.querySelector("#next").disabled = true;
    document.querySelector("#next").style.pointerEvents = "none";
    document.querySelector("#next").style.cursor = "not-allowed";
    document.querySelector('#next').style.backgroundColor = "#c6c6c6a0";
    document.querySelector('#next').style.color = "#c6c6c6a0";
    document.querySelector('#next').style.borderColor = "transparent";
  }

  // Next Page
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
    console.log(document.querySelector("#pagination"));
  });

  // Previous Page
  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
}

// show spinner loading
function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
  document.querySelector("footer").style.display = "none";
}

// stop spinner loading
function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
  document.querySelector("footer").style.display = "block";
}

// Init App
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displaySlider();
      displayPopularMovies();
      break;
    case "/shows.html":
    case "/shows":
      displayPopularShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayTVDetails();
      break;
    case "/search.html":
      search();
      break;
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
