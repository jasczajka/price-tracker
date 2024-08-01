const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(v){
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v)
            },
            message: props => `${props.value} is not a valid email`
        }
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