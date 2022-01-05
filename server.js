const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('./db/db.json');

const PORT = process.env.port || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notespage
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for render all notes on notespage
app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/db/db.json'))
);

// POST Route for a new note
app.post('/api/notes', (req, res) =>{
  if(req.body) {
    const { title, text } = req.body;
    const newNote = {
      title,
      text, 
      id: uuidv4() 
    };
    // newNote.id = uuid.v4();
    let notes = JSON.parse(fs.readFileSync('./db/db.json'));
    // console.log(notes);
    notes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json('New note has been added!');
  } else {
    res.error(`Can't add the new note in db!`);
  }
});

// DELETE Route for a existing note
app.delete('/api/notes/:id', (req, res) =>{
  const id = req.params.id;
  let notes = JSON.parse(fs.readFileSync('./db/db.json'));
  for (let i=0; i<notes.length; i++){
    if (notes[i].id === id){
      notes.splice(i, 1);
    } 
  }
  console.log(notes);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes));
  res.json('Item has been deleted!');
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
