const nodemailer = require("nodemailer");

/*let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}*/

const emailService = nodemailer.createTransport({
    service:'gmail',
    
    secure: true,
    auth: {
        user: 'chatboxhere@gmail.com',
        pass: '*Sandrav98',
    },
});

module.exports = emailService;