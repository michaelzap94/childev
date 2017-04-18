// imported packages
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var passportLocalMongoose = require("passport-local-mongoose");

/**
 * This Object defines the schema of the user's details.
 * @namespace
 * @property {string}  firstname - The firstname of the parent.
 * @property {string}  lastname - The lastname of the parent.
 * @property {Integer} contactnumber - The contact number of the parent.
 * @property {object}  address - The address of the parent.
 * @property {string}  address.address1 - The first line of the address of the parent.
 * @property {string}  address.address2 - The second line of the address of the parent.
 * @property {string}  address.city - The city of the address of the parent.
 * @property {string}  address.country - The country of the address of the parent.
 * @property {string}  address.postcode - The postcode of the parent.
 */
 
 var ParentDetailsSchema = new mongoose.Schema({
    firstname:String,
    lastname:String,
    contactnumber:Number,
    address: {
        address1:String,
        address2:String,
        city:String,
        country:String,
        postcode:String
    }
});
mongoose.model("ParentDetails", ParentDetailsSchema);
//---------

/**
 * This Object defines the parent Schema
 * @namespace
 * @property {string}  username - The parent's email.
 * @property {string}  password - The parent's password.
 * @property {string}  label - A label with value 'teacher'.
 * @property {string}  carertype - A label that indicates which type of parent this user is. It can be 'father', 'mother', 'guardian'.
 * @property {string}  activationhash - A hash code of the nursery where this parent is registered at.
 * @property {Integer} resetPasswordToken - A token that can be used to register the password of the parent's account.
 * @property {object}  dateCreated - The date the account was created.
 * @property {object}  details - The 'ParentDetailsSchema' schema object.
 * @property {object}  children -  The 'Children' schema object.
 * @property {object}  nursery -  The 'Nursery' where this parent is registered at.
 */
 var parentSchema = new mongoose.Schema({
    username:String,
    password:String,
    resetPasswordToken: Number,
    activationhash:String,
    label: String,
    carertype:String,
    dateCreated:{type:Date, default: Date.now},// if date is empty the default is Date.now
    details: [ParentDetailsSchema],
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



// Remove all the parents references this object has with other objects.
parentSchema.pre('remove', function (next) {
   var parentObject = this;
                parentObject.model('Children').update(
                    { parent:  parentObject._id }, 
                    { $pull: { parent: parentObject._id } }, 
                    { multi: true },
                    next);

});


/**
 * This function hashes the password.
 * @param {string} password - the password to be checked.
 */
 parentSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * Checks if password is valid
 * @param {string} password - the password to be checked.
 */
 parentSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


///////IMPORTANT
parentSchema.plugin(passportLocalMongoose);
///////////////
/**
* Creates the Parent Schema to be saved in the database.
* @module app/schemas/parent/parentSchema
*/
module.exports = mongoose.model('Parent', parentSchema);