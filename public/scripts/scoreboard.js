let tbody = document.querySelector("tbody");

function addRow (ncol, args) {
    let row = document.createElement("tr");
    for (let i=0; i<ncol; i++) {
        var cell = document.createElement("td");
        cell.textContent = args[i];
        row.appendChild(cell);
    }
    tbody.appendChild(row);
    console.log("body",tbody);
}

function sort (arr) {
    return arr.sort().reverse();
}

function main () {
    for (let i = 0; i<scoreLog.length; i++) {
        addRow(2, [scoreLog[i][0], scoreLog[i][1]]);
    }
}

main();