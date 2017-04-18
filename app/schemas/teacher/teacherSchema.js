var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var passportLocalMongoose = require("passport-local-mongoose");

/**
 * This Object defines the schema of the user's details.
 * @namespace
 * @property {string}  firstname - The firstname of the teacher.
 * @property {string}  lastname - The lastname of the teacher.
 * @property {Integer} contactnumber - The contact number of the teacher.
 * @property {Integer} worker id - The worker id number of the teacher.
 * @property {object}  address - The address of the teacher.
 * @property {string}  address.address1 - The first line of the address of the teacher.
 * @property {string}  address.address2 - The second line of the address of the teacher.
 * @property {string}  address.city - The city of the address of the teacher.
 * @property {string}  address.country - The country of the address of the teacher.
 * @property {string}  address.postcode - The postcode of the teacher.
 */
var TeacherDetailsSchema = new mongoose.Schema({
    firstname:String,
    lastname:String,
    contactnumber:Number,
    worker_id:Number,
    address: {
        address1:String,
        address2:String,
        city:String,
        country:String,
        postcode:String
    }
});
mongoose.model("TeacherDetails", TeacherDetailsSchema);
//----------------------------------------------------------------


/**
 * This Object defines the teacher Schema
 * @namespace
 * @property {string}  username - The teacher's email.
 * @property {string}  password - The teacher's password.
 * @property {string}  label - A label with value 'teacher'.
 * @property {string}  activationhash - A hash code of the nursery where this parent is registered at.
 * @property {Integer} resetPasswordToken - A token that can be used to register the password of the parent's account.
 * @property {object}  dateCreated - The date the account was created.
 * @property {object}  details - The 'TeacherDetailsSchema' schema object.
 * @property {object}  children -  The 'Children' schema object.
 * @property {object}  nursery -  The 'Nursery' where this teacher is registered at.
 */
 
 var teacherSchema = new mongoose.Schema({
    username:String,
    password:String,
    resetPasswordToken: Number,
    activationhash:String,
    label: String,
    dateCreated:{type:Date, default: Date.now},// if date is empty the default is Date.now
    details: [TeacherDetailsSchema],
    nursery: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Nursery"
        },
        username: String
    },
    children: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Children"
    }]
    
});

teacherSchema.pre('remove', function (next) {
    this.model('Nursery').update(
        { teacher:  this._id }, 
        { $pull: { teacher: this._id } }, 
        { multi: true }, 
        next);
   
});

/**
 * This function hashes the password.
 * @param {string} password - the password to be checked.
 */
teacherSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * Checks if password is valid
 * @param {string} password - the password to be checked.
 */
 teacherSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


///////////////IMPORTANT
teacherSchema.plugin(passportLocalMongoose);
///////////////
/**
* Creates the Parent Schema to be saved in the database.
* @module app/schemas/teacher/teacherSchema
*/
module.exports = mongoose.model('Teacher', teacherSchema);