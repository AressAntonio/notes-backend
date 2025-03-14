/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const notesRouter = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');

const getTokenFrom = request =>{
    const authorization = request.get('authorization');

    if(authorization && authorization.startsWith('Bearer ')){
        return authorization.replace('Bearer ', '');
    }
    return null
}


//EndPoint para crear nueva nota segun usuario en DB
notesRouter.post('/', async(request, response) =>{

    const body = request.body
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);

    if(!decodedToken.id){
        return response.status(401).json({error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id);
    //const user = await User.findById(body.userId);

    const note = new Note({
        content: body.content,
        important: body.important === undefined ? false : body.important,
        user: user.id
    });

    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save()
    response.status(201).json(savedNote);
});


module.exports = notesRouter