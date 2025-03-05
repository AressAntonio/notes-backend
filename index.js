//CONEXION CON MONGO.DB
require('dotenv').config()

const Note = require('./models/note');

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

//CREANDO SERVIDOR WEB CON EXPRESS
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.static('dist'));
app.use(requestLogger);
app.use(cors());

//Traer ruta principal de la API
app.get('/', (request, response)=>{

    response.send('<h1>Hello World!</h1><br><a href="http://localhost:3001/api/notes">NOTES..</a>');
});

//TRAER TODAS LAS NOTAS
app.get('/api/notes', (request, response)=>{
    Note.find({}).then(notes =>{
        response.json(notes);
    })
});

//TRAER NOTA ESPECIFICA POR ID 
app.get('/api/notes/:id', (request, response)=>{
    Note.findById(request.params.id).then(note =>{
        response.json(note);
    })
});

//CREANDO NUEVO OBJETO
/*const generateId = ()=>{

    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0;
    
    return maxId + 1;
}*/
app.post('/api/notes', (request, response)=>{

    const body = request.body;

    if(!body.content){
        return response.status(400).json({
            error: 'content missing'
        })
    };

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save().then(savedNote =>{
        response.json(savedNote);
    })
    
});

//BORRAR RECURSO
app.delete('/api/notes/:id', (request, response)=>{

    
    const id = Number(request.params.id);
    Note = notes.filter(note => note.id !== id);

    response.status(204).end();
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

//definicion de puerto para levantar servidor web
const PORT = process.env.PORT
app.listen(PORT);
console.log(`Server runnig on port http://localhost:${PORT}`);





