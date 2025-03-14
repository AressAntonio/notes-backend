//CONEXION CON MONGO.DB
require('dotenv').config() //importando variable de entorno
const usersRouter = require('./controllers/users');
const notesRouter = require('./controllers/notes');
const loginRouter = require('./controllers/login');
const Note = require('./models/note'); //importando DB


//middleware controlador de peticiones a endPoints en consola
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
};

//CREANDO SERVIDOR WEB CON EXPRESS
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(requestLogger);
app.use(express.static('dist'));
app.use(cors());
app.use('/api/users', usersRouter);
app.use('/api/notes', notesRouter);
app.use('/api/login', loginRouter);

//middleware controlador de solicitudes de endPoint desconocidos
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
};

//middleware controlador de errores
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if(error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    } else if(error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')){
        return response.status(400).json({error: 'expected `ùsername` to be unique' });
    } else if(error.name === 'JsonWebTokenError'){
        return response.status(401).json({error: 'token invalid' });
    } else if(error.name === 'TokenExpiredError'){
        return response.status(401).json({error: 'token expired' });
    }
  
    next(error)
};


//Traer ruta principal de la API
app.get('/', (request, response)=>{

    response.send('<h1>Hello World!</h1><br><a href="http://localhost:3001/api/notes">NOTES..</a>');
});



//TRAER TODAS LAS NOTAS
app.get('/api/notes', (request, response, next)=>{
    Note.find({}).then(notes =>{

        if(notes){
            response.json(notes);
        }else{
            response.status(404).end();
        };
        
    })
    .catch(error => next(error));
});

//TRAER NOTA ESPECIFICA POR ID 
app.get('/api/notes/:id', (request, response, next)=>{
    Note.findById(request.params.id).then(note =>{

        if(note){
            response.json(note);
        }else{
            response.status(404).end();
        }
        
    })
    .catch(error => next(error));
});


//CREANDO NUEVO OBJETO
/*const generateId = ()=>{

    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0;
    
    return maxId + 1;
}*/
/*app.post('/api/notes', (request, response, next)=>{

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
    .catch(error => next(error));
    
});*/


//BORRAR RECURSO
app.delete('/api/notes/:id', (request, response, next)=>{
    
    Note.deleteOne({ _id: request.params.id })
        .then(() => {
            // Obtén todas las notas restantes
            Note.find()
                .then(notes => {
                    // Filtra la lista de notas para eliminar la que se eliminó
                    const filteredNotes = notes.filter(note => note._id.toString() !== request.params.id);

                    // Envía la lista filtrada al frontend
                    response.status(200).json(filteredNotes);
                })
                .catch(error => next(error));
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ error: 'Error al eliminar la nota' });
        });
    
    
});

//UPDATE RECURSO
app.put('/api/notes/:id', (request, response, next)=>{

    const {content, important} = request.body;

    /*const note ={
        content: body.content,
        important: body.important,
    };*/

    Note.findByIdAndUpdate(request.params.id, {content, important}, {new: true, runValidators: true, context: 'query'})
        .then(updateNote =>{
            response.json(updateNote);
        })
        .catch(error => next(error));
})



app.use(unknownEndpoint);
app.use(errorHandler);

//definicion de puerto para levantar servidor web
// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT);
console.log(`Server runnig on port http://localhost:${PORT}`);





