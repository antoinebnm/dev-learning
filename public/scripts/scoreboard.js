function test (arr) {
    arr.forEach(element => {
        console.log(element);
    });
}

let player = {'id':0,'name':'test','score':1};

let tbody = document.querySelector("tbody");
function main () {
    let row = `
    <tr>
        <td>${player.id}.</td>
        <td>${player.name}</td>
        <td>${player.score}</td>
    </tr>
    `;
    tbody.innerHTML = row;
}

main();