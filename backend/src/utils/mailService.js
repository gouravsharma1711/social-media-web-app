const nodeMailer = require('nodemailer');
const ApiError = require("../utils/ApiError")

const transpoter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.NODEMAILER_GMAIL_APP_PASSWORD
    }
})


const sendMail = async(
    to,
    otp,
    emailFor = "Verification",
    subject = "socialMediaApp : Otp for "
) => {

    const sub = `${subject} ${emailFor}`;
    const text = `Your Otp for ${emailFor} is ${otp} and This Otp will Expires in 60 Seconds`;

    try {
        await transpoter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject:sub,
            text
        })
    } catch (error) {
        throw new ApiError(
            500,
            "Unable to send email",
            error.stack
        );
    }

}

module.exports = sendMail;