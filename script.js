const movieTitleElement = document.getElementById('movie-title');
const posterElement = document.getElementById('poster');
const runtimeElement = document.getElementById('runtime');
const showtimeElement = document.getElementById('showtime');
const availableTicketsElement = document.getElementById('available-tickets');
const descriptionElement = document.getElementById('description');
const buyTicketBtnElement = document.getElementById('buy-ticket-btn');

let currentFilmId = null;
let currentFilmData = null;

// Get the films and display them in the movie list
fetch("http://localhost:3000/films")
  .then(response => response.json())
  .then(films => {
    const filmsListElement = document.getElementById('films');
    films.forEach(film => {
      const filmItemElement = document.createElement('li');
      filmItemElement.textContent = film.title;
      filmItemElement.classList.add('film', 'item');
      filmItemElement.addEventListener('click', () => displayFilm(film.id));
      filmsListElement.appendChild(filmItemElement);
    });

    // Display the first film by default
    if (films.length > 0) {
      displayFilm(films[0].id);
    }
  });

// Display the film with the given ID
function displayFilm(id) {
  // Check if the clicked film is already being displayed
  if (currentFilmId === id) {
    return;
  }

  // Get the film 
  fetch(`${"http://localhost:3000/films"}/${id}`)
    .then(response => response.json())
    .then(film => {
      // Update the movie details with the film information
      movieTitleElement.textContent = film.title;
      posterElement.src = film.poster;
      runtimeElement.textContent = `${film.runtime} min`;
      showtimeElement.textContent = film.showtime;
      availableTicketsElement.textContent = film.capacity - film.tickets_sold;
      descriptionElement.textContent = film.description;
      currentFilmId = film.id;
      currentFilmData = film;
    });
}

// Buy a ticket for the current film
buyTicketBtnElement.addEventListener('click', () => {
  // Check if there are any available tickets
  const availableTickets = parseInt(availableTicketsElement.textContent);
  if (availableTickets > 0) {
    // Update the number of tickets sold in the API
    const ticketsSold = currentFilmData.tickets_sold + 1;
    fetch(`${"http://localhost:3000/films"}/${currentFilmId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tickets_sold: ticketsSold })
    })
      .then(response => response.json())
      .then(film => {
        // Update the number of available tickets on the frontend
        availableTicketsElement.textContent = film.capacity - film.tickets_sold;
        currentFilmData = film;
        location.reload();
      });
  } else {
    // Show an error message if there are no available tickets
    alert('Sorry, this showing is sold out.');
  }
});

