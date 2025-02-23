//creando servidor web simple

//const http = require('http');

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ];

/*const app = http.createServer((request, response)=>{

    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(notes));
});*/

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
app.use(requestLogger);
app.use(cors());

//Traer ruta principal de la API
app.get('/', (request, response)=>{

    response.send('<h1>Hello World!</h1><br><a href="http://localhost:3001/api/notes">NOTES..</a>');
});

//TRAER TODAS LAS NOTAS
app.get('/api/notes', (request, response)=>{
    response.json(notes);
});

//TRAER NOTA ESPECIFICA POR ID 
app.get('/api/notes/:id', (request, response)=>{
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);

    if(note){
        response.json(note);
    }else{
        response.status(404).end();
    };
    console.log(note);
    response.json(note);
});

//CREANDO NUEVO OBJETO
const generateId = ()=>{

    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0;
    
    return maxId + 1;
}
app.post('/api/notes', (request, response)=>{

    const body = request.body;

    if(!body.content){
        return response.status(400).json({
            error: 'content missing'
        })
    };

    const note ={

        id: generateId(),
        content: body.content,
        important: Boolean(body.important) || false,
        
    };

    notes = notes.concat(note);
    response.json(note)
    
});

//BORRAR RECURSO
app.delete('/api/notes/:id', (request, response)=>{
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);

    response.status(204).end();
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

//definicion de puerto para levantar servidor web
const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server runnig on port http://localhost:${PORT}`);