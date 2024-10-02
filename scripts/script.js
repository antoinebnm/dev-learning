let userScore = 0;
let ranNums = Array.from({length: 10}, () => Math.floor(Math.random() * 1372));
let zoneToType = document.getElementById("zoneToType");
let wordToType = document.getElementById("wordToType");
let i = 0;

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

function main() {
    let time = document.getElementById("time");
    let userInput = '';
    const startTime = new Date().getTime();

    ranNums = shuffle(ranNums);
    wordToType.textContent = wordList[ranNums[i]];
    time.textContent = Math.floor((new Date().getTime() - startTime) / 1000);

    zoneToType.addEventListener('input', () => {
        
        userInput = zoneToType.value;

        if (checkWord(userInput, wordList[ranNums[i]])){
            i++;

            if (i === 5) {
                zoneToType.hidden = true;
                time.textContent = "Total time: " + Math.floor((new Date().getTime() - startTime) / 1000);
                document.getElementById("label").textContent = 'Game End';
            } else {

                wordToType.textContent = wordList[ranNums[i]];
                zoneToType.value = '';
                time.textContent = Math.floor((new Date().getTime() - startTime) / 1000);
            }
        }
    });
}

main();