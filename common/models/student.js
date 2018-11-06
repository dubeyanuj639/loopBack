'use strict';
var service = require('../services/service')
module.exports = function (student) {
    /**
     * this is student registration page after fill this student can access the all features.
     * @param {string} studentName studentName
     * @param {string} fatherName Student's fatherName
     * @param {string} motherName student mother Name
     * @param {string} contact student contact
     * @param {Function(Error, object)} callback
     */

    student.registration = function (studentId, studentName, fatherName, motherName, contact, password, callback) {
        service.bcrypt(password, (errBcr, successBcr) => {
            if (errBcr) console.log(errBcr)
            else {
                var query = { where: { studentId: studentId } };
                var obj = { studentId: studentId, studentName: studentName, fatherName: fatherName, motherName: motherName, contact: contact, password: successBcr }
                student.findOrCreate(query, obj, (err, data) => {
                    console.log("err,result ===>>", err, data)
                    callback(null, data);
                })
            }
        })
    };

    /**
 * This method for student SignIn 
 * @param {number} studentId this is unique SO easily identify which user is to be come.
 * @param {string} password Secure Signature
 * @param {Function(Error)} callback
 */
    student.signIn = function (studentId, password,callback) {
        student.find({ where: { studentId: studentId }}).then(data => {
            console.log("data==>", data)
            callback(null,data)
        }).catch(err => {
            console.log("error =>", err)
            service.responseHandler(400, "Error", err)
        })
    };

    /**
      @ All request in first Parameter
      @ Second Parameter has a result of Api/funciton that is already called before this Remote method
      @ pass the function name in Quotes ''
      */
    student.beforeRemote('', (req, b, next) => {
        console.log("calling before remote function ==>>")
        service.bcrypt("1234567890", (errBcr, successBcr) => {
            console.log("@@@@@@@@@@@@  ====>>>", errBcr, successBcr)
            next();
        })

    })
    /**
     @ All request in first Parameter
     @ Second Parameter has a result of Api/funciton that is already called before this Remote method
     * 
     */
    student.afterRemote('', (req, b, next) => {
        console.log("calling after remote function ==>>")
        next();
    })

};
