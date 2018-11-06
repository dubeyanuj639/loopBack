
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
        console.log(imageB64)
        cloudinary.v2.uploader.upload(imageB64, (err, result) => {
            console.log("===>>>>in cloudinary function =====>>>", err, result);
            callback(result.url);
        })
    },



    exports.crypt = function (divPass) {
        console.log("calling function divPass====", divPass)
        const secret = 'Mobiloitte1';
        const hash = crypto.createHmac('sha256', secret)
            .update(divPass)
            .digest('hex');
        return hash;

    };

exports.bcrypt = function (divPass, cb) {
    // console.log("calling bcrypt funciton ====")
    bcrypt.genSalt(saltRounds, function (err, salt) {
        // console.log("calling bcrypt funciton 2 ====")
        bcrypt.hash(divPass, salt, function (err, hashPassword) {
              console.log("errrr   hash  ==>>",err,hashPassword)
            cb(null, hashPassword)
            // return hashPassword;
        });
    });


};

exports.bcryptVerify = (password, dbPassword, cb) => {
    console.log("=======in bcypt verify", password, dbPassword)
    bcrypt.compare(password, dbPassword, (err, res) => {
        if (err) {
            return commonFile.responseHandler(res, 400, "Invalid Credentials.")
        }
        else {
            console.log("null , response======== verify  password by bcrypt function =====>>>>", null, res)
            cb(null, res)
        }
    });
}


exports.jwt = function (body, cb) {
    console.log("calling jwt function ====", body)
    let token = jwt.sign(body, config.jwtSecretKey)
    console.log("token====", token)
    cb(null, token)

};

exports.jwtVerify = (req, res, next) => {
    console.log("req.headers========", req.headers)
    if (req.headers.jwt == "null" || req.headers.jwt == "" || req.headers.jwt == "undefined" || req.headers.jwt == null || req.headers.jwt == undefined) {
        console.log("token missing")
        return commonFile.responseHandler(res, 400, "Token Missing")
    }

    jwt.verify(req.headers.jwt, config.jwtSecretKey, function (err, decoded) {
        if (err) {
            console.log("Invalid token")
            return commonFile.responseHandler(res, 400, "Token Invalid", err)
        } else {
            console.log("decode", decoded)

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
            user: '******',
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
        console.log("in send mail second console-----", err, info)
        if (err) {
            console.log("Error occured", err)
            callback(null);
        } else {
            console.log("Mail sent")
            callback(null, info)
        }
    })
}

exports.balanceCal = async (contract, ownerAddress) => {
    try {
        var balance = await contract.methods.balanceOf(ownerAddress).call();
        console.log("@@@@@@@@@@@@@", balance);
        return balance;
    } catch (err) {
        throw err;
    }

}


