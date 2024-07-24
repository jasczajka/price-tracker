const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passwordHash: String,
    links: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Link'
        }
    ]
        
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()

        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User