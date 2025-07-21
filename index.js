require('dotenv').config()
console.log('>>> MONGODB_URI loaded as:', process.env.MONGODB_URI);
const express = require('express')
const app = express()
const Note = require('./models/note')

app.use(express.static('dist'));

app.use(express.json())

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id))) : 0

  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    if (!note) {
      return response.status(404).json({ error: 'Notatka nie znaleziona' });
    }
    response.json(note)
  }).catch(error => {
    if (error.name === 'CastError') {
      return response.status(400).json({ error: 'Bledne id' });
    }

    console.log(error);
    response.status(500).json({ error: 'Cos poszlo nie tak...' });
  })
})

app.delete('/api/notes/:id', (req, res) => {
  Note.findByIdAndDelete(req.params.id)
    .then(deleted => {
      if (!deleted) {
        return res.status(404).json({ error: 'Notatka nie znaleziona' });
      }
      res.status(204).end();
    }).catch(error => {
    if (error.name === 'CastError') {
      return response.status(400).json({ error: 'Bledne id' });
    }

    console.log(error);
    response.status(500).json({ error: 'Cos poszlo nie tak...' });
  })
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})