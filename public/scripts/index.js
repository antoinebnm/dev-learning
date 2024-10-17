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

const getUsername = document.getElementById('getUsername');
getUsername.addEventListener("submit", (event) => {

    event.preventDefault();
    const userNameField = document.getElementById('userNameField');
    if (userNameField.value == '') {
        alert("Username Field can't be empty!")
        return;
    }
    userNameField.disabled = true;
    registerButton.hidden = true;
})

function run() {
    const wordToType = document.getElementById("wordToType");
    const zoneToType = document.getElementById("zoneToType");

    const scoreDiv = document.getElementById("scoreDiv");
    const timeDiv = document.getElementById("time");
    const startButton = document.getElementById("startGameButton");
    
    const ranNums = shuffleWords(Array.from({length: 10}, () => Math.floor(Math.random() * 1372)));

    const userName = userNameField.value;
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
        myRedirect('/api/users/add/' + userName + '/' + userScore, 'userDB', 'add');
        //=> window.location.replace('/user/create/' + userName + '/' + userScore);
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