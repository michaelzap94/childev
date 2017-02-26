var mongoose = require('mongoose');
/*var bcrypt   = require('bcrypt-nodejs');
var passportLocalMongoose = require("passport-local-mongoose");*/

/**
 * This Object defines the schema of the user's medical information.
 * @namespace
 * @property {string}  firstname - The firstname of the child.
 * @property {string}  lastname - The lastname of the child.
 * @property {Integer} student_id - The student ID of the child.
 * @property {string}  gender - The gender of the child.
 * @property {string}  dob - The date of birth of the child.
 * @property {string}  maincareremail - The main carer's email of the child.
 * @property {string}  maincarerfirstname - The main carer's firstname of the child.
 * @property {string}  maincarerlastname - The main carer's lastname of the child.
 * @property {string}  maincarercontactnumber - The main carer's contact number of the child.
 * @property {string}  maincarertype - The main carer's type of parenting.
 * @property {object}  address - The address of the child.
 * @property {string}  address.address1 - The first line of the address of the child.
 * @property {string}  address.address2 - The second line of the address of the child.
 * @property {string}  address.city - The city of the address of the child.
 * @property {string}  address.country - The country of the address of the child.
 * @property {string}  address.postcode - The postcode of the child.
  */
 var ChildrenMedicalSchema = new mongoose.Schema({
   medications:{type:String, default: ''},
   illnesses:{type:String, default: ''},
   allergies:{type:String, default: ''},
   foodNotAllowed:{type:String, default: ''},
   specialSupport:{type:String, default: ''},
   disabilities:{type:String, default: ''},
   doctorName:{type:String, default: ''},
   doctorAddress:{type:String, default: ''},
   doctorContactnumber:{type:String, default: ''}
   
   
});
mongoose.model("ChildrenMedical", ChildrenMedicalSchema);
//----------------------------------------------------------------


/**
 * This Object defines the schema of the user's details.
 * @namespace
 * @property {string}  firstname - The firstname of the child.
 * @property {string}  lastname - The lastname of the child.
 * @property {Integer} student_id - The student ID of the child.
 * @property {string}  gender - The gender of the child.
 * @property {string}  dob - The date of birth of the child.
 * @property {string}  maincareremail - The main carer's email of the child.
 * @property {string}  maincarerfirstname - The main carer's firstname of the child.
 * @property {string}  maincarerlastname - The main carer's lastname of the child.
 * @property {string}  maincarercontactnumber - The main carer's contact number of the child.
 * @property {string}  maincarertype - The main carer's type of parenting.
 * @property {object}  address - The address of the child.
 * @property {string}  address.address1 - The first line of the address of the child.
 * @property {string}  address.address2 - The second line of the address of the child.
 * @property {string}  address.city - The city of the address of the child.
 * @property {string}  address.country - The country of the address of the child.
 * @property {string}  address.postcode - The postcode of the child.
  */
 var ChildrenDetailsSchema = new mongoose.Schema({
    firstname:String,
    lastname:String,
    student_id:Number,
    gender:String,
    dob:String,
    maincareremail:String,
    maincarerfirstname:String,
    maincarerlastname:String,
    maincarercontactnumber:Number,
    maincarertype:String,
    address: {
        address1:String,
        address2:String,
        city:String,
        country:String,
        postcode:String
    }
});
mongoose.model("ChildrenDetails", ChildrenDetailsSchema);
//----------------------------------------------------------------


/**
 * This Object defines the parent Schema
 * @namespace
 * @property {string}  label - A label with value 'children'.
 * @property {object}  dateCreated - The date the account was created.
 * @property {object}  details - The 'ChildrenDetailsSchema' schema object.
 * @property {object}  parent -  The 'Parent' schema object that this child is related to.
 * @property {object}  teacher -  The 'Teacher' schema object that this child is related to.
 * @property {object}  nursery -  The 'Nursery' where this child is registered at.
 */
 var childrenSchema = new mongoose.Schema({
    label: String,
    dateCreated:{type:Date, default: Date.now},// if date is empty the default is Date.now
    details: [ChildrenDetailsSchema],
    medicalInfo: [ChildrenMedicalSchema],
    parentsemails: [{type: String}],
    nursery: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Nursery"
        },
        username: String
    },
    parent:[{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Parent"
        }],
        
    report:[{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Report"
        }]
    
});

/**
 * Remove this child reference from his parent schema
 *
 */
childrenSchema.pre('remove', function (next) {
    this.model('Parent').update(
        { children:  this._id }, 
        { $pull: { children: this._id } }, 
        { multi: true }, 
        next);
   
});

/**
* Creates the Parent Schema to be saved in the database.
* @module app/schemas/children/childrenSchema
*/
module.exports = mongoose.model('Children', childrenSchema);