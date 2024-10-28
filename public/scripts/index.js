function checkWord(typedWord, wordToType) {
    return (typedWord == wordToType);
}

function shuffleWords(array) {
    var i = array.length,
        j = 0,
        temp;

    while (i--) {

        j = Math.floor(Math.random() * (i+1));

        // swap randomly chosen element with current element
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }

    return array;
}

// Sélection des éléments du DOM
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const authPopup = document.getElementById("authPopup");
const closeBtn = document.querySelector(".close-btn");
const authTitle = document.getElementById("authTitle");
const authForm = document.getElementById("authForm");
const accountMenu = document.getElementById('accountMenu');
const userProfil = document.getElementById('userProfil');

function toggleUserProfil(name) {
    loginButton.hidden = true;
    registerButton.hidden = true;

    userProfil.textContent = name;

}

// Fonction pour ouvrir le popup
function openPopup(type) {
    authPopup.style.display = "flex";
    authTitle.textContent = type === "login" ? "Login" : "Register";
}

// Fonction pour fermer le popup
function closePopup() {
    authPopup.style.display = "none";
}

// Événements pour ouvrir et fermer le popup
loginButton.addEventListener("click", () => openPopup("login"));
registerButton.addEventListener("click", () => openPopup("register"));
closeBtn.addEventListener("click", closePopup);

// Fermer le popup si on clique en dehors du contenu
window.addEventListener("click", (event) => {
    if (event.target === authPopup) {
        closePopup();
    }
});

// Soumission du formulaire d'authentification
authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    // Ajouter la logique de connexion/inscription ici
    const action = (authTitle.textContent == 'Login') ? 'read' : 'add';
    try {
        fetchAPI('users', [action, username, password])
        .then((token) => {
            if (token) {
                toggleUserProfil(username);
            }
        });
    } catch (error) {
        myRedirect('/', 'index', 'redirect');
        console.log(error + "Something went wrong!");
    }
    
    // clear fields
    document.getElementById("username").value = '';
    document.getElementById("password").value = '';
    closePopup();
});

function run() {
    const wordToType = document.getElementById("wordToType");
    const zoneToType = document.getElementById("zoneToType");

    const scoreDiv = document.getElementById("scoreDiv");
    const timeDiv = document.getElementById("time");
    const startButton = document.getElementById("startGameButton");

    let _x = 10;
    
    const ranNums = shuffleWords(Array.from({length: _x}, () => Math.floor(Math.random() * 1372)));

    let userScore = 0;
    let userInput = '';
    let i = 0;

    zoneToType.value = '';
    zoneToType.hidden = false;
    document.getElementById("label").textContent = 'Type here:';
    zoneToType.focus();

    const timeLimit = 10000;
    let timeRemaining = timeLimit / 1000;
    timeDiv.textContent = timeRemaining;
    
    startButton.hidden = true;
    wordToType.textContent = wordList[ranNums[i]];
    
    const interval = setInterval(() => {
        timeRemaining--;
        timeDiv.textContent = timeRemaining;
    }, 1000);

    const timeout = setTimeout(() => {
        console.log('Timeout');
        zoneToType.hidden = true;
        document.getElementById("label").textContent = 'Game Ended !';
        clearTimeout(timeout);  // Arrêter le timer
        clearInterval(interval);  // Arrêter la mise à jour du temps
        scoreDiv.textContent = userScore;
        
        startButton.textContent = "Play Again ?";
        startButton.hidden = false;
    }, timeLimit);

    zoneToType.addEventListener('input', () => {
        userInput = zoneToType.value;

        if (checkWord(userInput, wordList[ranNums[i]])){
            i++;
            wordToType.textContent = wordList[ranNums[i]];
            zoneToType.value = '';
            userScore++;
            scoreDiv.textContent = userScore;
            console.log('Score:', userScore);
        }
    });
}