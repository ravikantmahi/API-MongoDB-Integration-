const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// 1. Connect to MongoDB 
// (This URL looks for a database named 'notedb' on your local machine)
mongoose.connect('mongodb://127.0.0.1:27017/notedb')
    .then(() => console.log('Successfully connected to MongoDB!'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// 2. Create the Blueprint (Schema) and Model
const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: String,
    createdAt: { type: Date, default: Date.now } // Automatically saves the current date
});

// This creates a 'Note' toolkit we can use to interact with the database
const Note = mongoose.model('Note', noteSchema);


// 3. POST Route: Save a new note permanently
app.post('/api/notes', async (req, res) => {
    try {
        // Build the note using our Mongoose model
        const newNote = new Note({
            title: req.body.title,
            content: req.body.content
        });

        // Tell MongoDB to save it, and WAIT for it to finish
        const savedNote = await newNote.save(); 
        
        res.status(201).json(savedNote);
    } catch (error) {
        res.status(400).json({ error: "Failed to save note. Did you include a title?" });
    }
});


// 4. GET Route: Fetch all notes from the database
app.get('/api/notes', async (req, res) => {
    try {
        // Tell MongoDB to find ALL notes, and WAIT for the results
        const notes = await Note.find(); 
        
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch notes" });
    }
});

app.listen(5000, () => console.log('Note Taker API running on port 5000'));
