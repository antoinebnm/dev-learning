let tbody = document.querySelector("tbody");
let thead = document.querySelector("thead");

var header = `
    <tr>
        <th>Name</th>
        <th>Played</th>
        <th>Score</th>
        <th>Duration</th>
    </tr>
    `;
thead.innerHTML = header;

function updateTable(players, gameType) {
  let row = ``;
  players.forEach((element) => {
    element.gamesPlayed.forEach((game) => {
      if (game.type == gameType) {
        row += `
          <tr>
              <td>${element.displayName}</td>
              <td>${new Date(game.dateOfEntry).toLocaleDateString()}</td>
              <td>${game.score}</td>
              <td>${game.time}</td>
          </tr>`;
      }
    });
  });
  tbody.innerHTML = row;
}

// Appelle la fonction pour récupérer les données et mettre à jour le tableau (à chaque chargement de la page scoreboard)
fetchData("api/users/read/all").then((data) => {
  updateTable(data, "chrono"); // Json to array
});
