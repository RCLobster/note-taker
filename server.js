const express = require('express');
const path = require('path');
const fs = require('fs');
//const api = require('./routes/index.js');


const PORT = 3001;

const notes = require('./db/db.json');

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use('/api', api);

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


// GET Route for feedback page
app.get('/notes', (req, res) =>
res.sendFile(path.join(__dirname, '/public/notes.html'))
);


// GET route to return data in db.json
app.get('/api/notes', (req, res) => {
    console.log(`${req.method} request received`);
    //fs.readFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
    return res.json(notes);
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
