const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');


const PORT = process.env.PORT || 3001;

const notes = require('./db/db.json');

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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
    // read the current data in db.json
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if(err){
            console.error(err);
            return;
        } else {
            // if no errors, parse the data
            console.log(`Retreiving db.json`);
            const returnedData = JSON.parse(data);
            res.json(returnedData);
        }
        
    });
});

// POST route to add new notes into db.json
app.post('/api/notes', (req, res) => {
    console.log(`${req.method} request received`);
    
    // deconstruct the object to add
    const {title, text} = req.body;
    
    // if that object contains a property for title AND text...
    if(title && text) {
        // then create a new object named newNote with the passed data
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        // read the current contents of db.json
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            err
                ? console.error(err)
                : console.log(`note titled ${newNote.title} has been written to JSON file`);
        
            // parse the data from db.json
            const returnedData = JSON.parse(data);
            // push the newly created note into db.json array
            returnedData.push(newNote);
            
            // write a new db.json file with the new data
            fs.writeFile('./db/db.json', JSON.stringify(returnedData, null, 4), (err) => 
                err
                    ? console.error(err)
                    : console.log(`new note titled ${newNote.title} added to db.json`));
        });

        const response = {
            status: 'success',
            body: newNote,
          };
      
          console.log(response);
          res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting review');
    }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
