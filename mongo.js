const mongoose = require('mongoose');

if(process.argv.length < 3){
    console.log('give password as argument');
    process.exit(1);
};

const password = process.argv[2]


const url = `mongodb+srv://aressgarrido:${password}@cluster0.rk8zc.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const noteSchema  = new mongoose.Schema({
    content: String,
    important: Boolean,
});

//ELEMINANDO ID UNICO DE CADA OBJETO Y CONTROL DE VERSIONES DE MONGO.DB
noteSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})

const Note = mongoose.model('Note', noteSchema);

const note = new Note({
    content: 'Callback-functions suck',
    important: true,
});

//CREA UNA NUEVA NOTA
/*note.save().then(result =>{
    console.log('note saved!');
    mongoose.connection.close();
});*/


//IMPRIME TODAS LAS NOTAS ALMACENADAS EN LA DB
Note.find({}).then(result =>{
    result.forEach(note =>{
        console.log(note);
    })
    mongoose.connection.close();
});

//RESTRINGIENDO BUSQUEDA
/*Note.find({important: false}).then(result =>{
    result.forEach(note => {
        console.log(note);
    })
    mongoose.connection.close();
})*/