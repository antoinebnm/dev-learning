let tbody = document.querySelector("tbody");

async function fetchPlayers() {
    try {
        const response = await fetch("/api/scoreboard");
        if (!response.ok) {
            throw new Error(response);
        }
        const players = await response.json();
        updateTable(players);
    } catch (error) {
        console.error("Error :", error);
    }
}

function updateTable(players) {
    let row = ``;
    players.forEach(element => {
        row += `
        <tr>
            <td>${element.userName}</td>
            <td>${element.userScore}</td>
            <td>${new Date(element.dateOfEntry).toLocaleDateString()}</td>
        </tr>
        `;
    });
    tbody.innerHTML = row;
}

// Appelle la fonction pour récupérer les données et mettre à jour le tableau
fetchPlayers();