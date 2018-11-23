
let nodemailer = require('nodemailer')
let crypto = require('crypto')
var bcrypt = require('bcryptjs');
let saltRounds = 10;
let myPlaintextPassword = 's0/\/\P4$$w0rD'
let jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary')
var http = require('http');

cloudinary.config({
    cloud_name: "dvflctxao",
    api_key: "919719749694857",
    api_secret: "sNEdqOvT0Dpo8PSsJsctRrLCJxg"
});


exports.responseHandler = (res, responseCode, responseMessage, data) => {
    res.send({
        responseCode: responseCode,
        responseMessage: responseMessage,
        data: data
    })
},

    exports.imageUploadToCloudinary = (imageB64, callback) => {
        cloudinary.v2.uploader.upload(imageB64, (err, result) => {
            callback(result.url);
        })
    },



    exports.crypt = function (divPass) {
        const secret = 'Mobiloitte1';
        const hash = crypto.createHmac('sha256', secret)
            .update(divPass)
            .digest('hex');
        return hash;

    };

exports.bcrypt = function (divPass, cb) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(divPass, salt, function (err, hashPassword) {
              console.log("errrr   hash  ==>>",err,hashPassword)
            cb(null, hashPassword)
        });
    });


};

exports.bcryptVerify = (password, dbPassword, cb) => {
    bcrypt.compare(password, dbPassword, (err, res) => {
        if (err) {
            return commonFile.responseHandler(res, 400, "Invalid Credentials.")
        }
        else {
            cb(null, res)
        }
    });
}


exports.jwt = function (body, cb) {
    let token = jwt.sign(body, config.jwtSecretKey)
    cb(null, token)

};

exports.jwtVerify = (req, res, next) => {
    if (req.headers.jwt == "null" || req.headers.jwt == "" || req.headers.jwt == "undefined" || req.headers.jwt == null || req.headers.jwt == undefined) {
        return commonFile.responseHandler(res, 400, "Token Missing")
    }

    jwt.verify(req.headers.jwt, config.jwtSecretKey, function (err, decoded) {
        if (err) {
            return commonFile.responseHandler(res, 400, "Token Invalid", err)
        } else {
            next();
        }
    });


}


/*  Allow less secure apps: ON  from your gmail for sending gmail*/

exports.sendEmail = (email, subject, message, link, cc, bcc, callback) => {
    console.log("in send email for forgot password ==> ", email, subject, message, link)
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '',
            pass: '******'
        }
    })
    // console.log(message,"\n",link)
    let messageObj = {
        from: 'Noreply<ph-anuj@mobiloitte.com>',
        to: email,
        subject: subject,
        text: message,//"A sentence just to check the nodemailer",
        html: link,//"Click on this link to <a href=" + link + ">reset Password</a>",
        cc: cc,
        bcc: bcc
    }
    transporter.sendMail(messageObj, (err, info) => {
        if (err) {
         
            callback(null);
        } else {
            callback(null, info)
        }
    })
}

exports.balanceCal = async (contract, ownerAddress) => {
    try {
        var balance = await contract.methods.balanceOf(ownerAddress).call();
        return balance;
    } catch (err) {
        throw err;
    }

}


