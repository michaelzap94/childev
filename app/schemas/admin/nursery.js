// imported packages
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var passportLocalMongoose = require("passport-local-mongoose");
var ObjectId = require('mongodb').ObjectID;


// nursaryDetails Schema 


/**
 * This Object defines the schema of the user's details.
 * @namespace
 * @property {string}  name - The name of the nursery.
 * @property {string}  urn - The URN of the nursery.
 * @property {Integer} nurserycontactnumber - The contact number of the nursery.
 * @property {object}  address - The address of the nursery.
 * @property {string}  address.address1 - The first line of the address of the nursery.
 * @property {string}  address.address2 - The second line of the address of the nursery.
 * @property {string}  address.city - The city of the address of the nursery.
 * @property {string}  address.country - The country of the address of the nursery.
 * @property {string}  address.postcode - The postcode of the nursery.
 * @property {string}  firstname - The firstname of the nursery's manager.
 * @property {string}  lastname - The lastname of the nursery's manager
 * @property {Integer} managercontactnumber - The contact number of the manager.
 * @property {string}  managerlabel - A label with value 'manager'.
 */
 
var NurseryDetailsSchema = new mongoose.Schema({
    name:String,
    urn:String,
    nurserycontactnumber:Number,
    address: {
        address1:String,
        address2:String,
        city:String,
        country:String,
        postcode:String
    },
        firstname:String,
        lastname:String,
        managercontactnumber:Number,
        managerlabel: String
    
    
});
mongoose.model("NurseryDetails", NurseryDetailsSchema);
//------------------------



/**
 * This Object defines the nursery Schema
 * @namespace
 * @property {string}  username - The nursery's email.
 * @property {string}  password - The nursery's password.
 * @property {string}  label - A label with value 'nursery'.
 * @property {Integer} active - A label to indicate if nursery has confirmed its email and hence, registerd successfully. Value is 1 (active) or 0 (inactive).
 * @property {string}  activationhash - A hash code used to register other users to this nursery.
 * @property {Integer} resetPasswordToken - A token that can be used to register the password of the nursery's account.
 * @property {object}  dateCreated - The date the account was created.
 * @property {object}  details - The 'NurseryDetailsSchema' schema object.
 * @property {object}  teacher -  The 'Teacher' schema object.
 * @property {object}  parent -  The 'Parent' schema object.
 * @property {object}  children -  The 'Children' schema object.
 * @property {array}  waitingRegistrationTeachers - An array that contains a list of teachers waiting for registration.
 * @property {array}  waitingRegistrationParents - An array that contains a list of parents waiting for registration.
 */

var nurserySchema = new mongoose.Schema({
    username:String,
    password:String,
    label:String,
    active:Number,
    activationhash:String,
    resetPasswordToken: Number,
    dateCreated:{type:Date, default: Date.now},// if date is empty the default is Date.now
    details: [NurseryDetailsSchema],
    teacher: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher"
    }],
    parent: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Parent"
    }],
    children: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Children"
    }],
    waitingRegistrationTeachers: [{type: String}],
    waitingRegistrationParents: [{email:String,childId:String}],
    waitingLinkingParents: [{email:String,childId:String,name:String}]
    

    
});

// Remove all the assignment docs that reference the removed person.
nurserySchema.pre('remove', function(next) {
    var nurseryObject = this;
    nurseryObject.model('Parent').remove({"nursery.id":nurseryObject._id},function(err){
        if(err){
            
        }else{
          nurseryObject.model('Teacher').remove({"nursery.id": nurseryObject._id},function(err){
              if(err){
                
                }else{
                nurseryObject.model('Children').remove({"nursery.id": nurseryObject._id},next);
                }
          });

        }
    });
    
    
});

/**
 * This function hashes the password.
 * @param {string} password - the password to be checked.
 */
nurserySchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * Checks if password is valid
 * @param {string} password - the password to be checked.
 */
nurserySchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
///////////////IMPORTANT
nurserySchema.plugin(passportLocalMongoose);
///////////
// 
/**
* Creates the Nursery Schema to be saved in the database.
* @module app/schemas/admin/nursery
*/
module.exports = mongoose.model('Nursery', nurserySchema);
