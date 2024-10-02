let word = "Test";

function testWord(typedWord) {
    if (typedWord === word) {
        return true;
    }
    return false;
}

console.log(testWord(prompt("Type : " + word)))