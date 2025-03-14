const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 3,
        required: true,
        unique: true //asegura la creacion de un usuario unico
    },
    name: {
        type: String,
        minLength: 3,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        minLength: 5,
        required: true
    },
    notes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note'
        }
        
    ],
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        delete returnedObject._id.toString()
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
