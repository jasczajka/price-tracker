const nodemailer = require('nodemailer')
const logger = require('./logger')

const username = process.env.MAIL_APP_USERNAME
const password = process.env.MAIL_APP_PASSWORD


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: username,
        pass: password
    }
})

async function send(recipient, subject, text) {
    const result = await transporter.sendMail({
        from: `Price Tracker <${username}>`,
        to: recipient,
        subject: subject,
        text: text
    })

    logger.info('message sent: ', JSON.stringify(result))
}

module.exports = { send }