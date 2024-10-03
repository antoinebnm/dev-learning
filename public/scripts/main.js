function checkWord(typedWord, wordToType) {
    if (typedWord == wordToType) {
        return true;
    }

    return false;
}

function shuffle(array) {
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

let timeZone = document.getElementById("time");
function updateTimer (startTime) {
    timeZone.textContent = Math.floor((new Date().getTime() - startTime) / 1000);
}

let scoreZone = document.getElementById("scoreZone");
function scoreManager (userScore, action) {
    switch (action) {
        case "add":
            userScore++;
            break;
        case "update":
            scoreLog.push(userScore);
            break;
        default:
            break;
    }
}

function restart () {
    document.getElementById("startGameButton").hidden = false;
}

let ranNums = Array.from({length: 10}, () => Math.floor(Math.random() * 1372));
let zoneToType = document.getElementById("zoneToType");
let wordToType = document.getElementById("wordToType");

function main() {
    document.getElementById("startGameButton").hidden = true;

    let userScore = 0;
    let userInput = '';
    let i = 0;

    ranNums = shuffle(ranNums);
    wordToType.textContent = wordList[ranNums[i]];
    var startTime = new Date().getTime();
    updateTimer(startTime);

    zoneToType.addEventListener('input', () => {
        
        userInput = zoneToType.value;

        if (checkWord(userInput, wordList[ranNums[i]])){
            i++;

            if (i === 5) {

                zoneToType.hidden = true;
                document.getElementById("label").textContent = 'Game End';
                scoreManager(userScore, "update");
            } else {

                wordToType.textContent = wordList[ranNums[i]];
                zoneToType.value = '';
                scoreManager(userScore, 'add');
            }
            updateTimer(startTime);
        }
    });
}

function run () {
    main();
}