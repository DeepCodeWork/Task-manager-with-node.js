const sgMail = require('@sendgrid/mail')
const senderMail = 'cu.15bcs1109@gmail.com'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const welcomeMail = (email,name)=>{
    sgMail.send({
        to:email,
        from:senderMail,
        subject:'Welcome to Task Manager app',
        text:`Dear ${name} welcome to Gay world. You are officially declared as gay now`
    })
}

const cancelMail = (email,name)=>{
    sgMail.send({
        to:email,
        from:senderMail,
        subject:'Feedback',
        text:`Dear ${name}, we apologise about you not liking our product. we request you to reply us the reason of leaving`
    })
}

module.exports = {welcomeMail,cancelMail}