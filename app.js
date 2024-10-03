const express = require('express');
const path = require('path');

const app = express();

app.use(express.static("public"));

app.get('/', (req, res) => {
    //res.setHeader('content-type', 'text/html');
    res.sendFile(path.join(__dirname, 'public/static/index.html'));
});

app.get('/scoreboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/static/scoreboard.html'));
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});