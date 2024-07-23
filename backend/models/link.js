const mongoose = require('mongoose')

const linkSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        link: {
            type: String,
            required: true
        },
        regularSelector: {
            type: String,
            required: true
        },
        discountSelector: {
            type: String,
            required: true
        },
        latestPrice: {
            type: Number,
            default: null
        },
        isPriceSeen: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true
    }
)

linkSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()

        delete returnedObject._id
        delete returnedObject.__v

    }
})


const Link = mongoose.model('link', linkSchema)

module.exports = Link