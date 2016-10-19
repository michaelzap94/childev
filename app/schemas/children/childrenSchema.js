var mongoose = require('mongoose');
/*var bcrypt   = require('bcrypt-nodejs');
var passportLocalMongoose = require("passport-local-mongoose");*/

// children Details Schema ---------------------------------------------------
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
    },
    medicalInfo:{
        
    }
});
mongoose.model("ChildrenDetails", ChildrenDetailsSchema);
//----------------------------------------------------------------


// define the schema for our user model
var childrenSchema = new mongoose.Schema({
    label: String,
    dateCreated:{type:Date, default: Date.now},// if date is empty the default is Date.now
    details: [ChildrenDetailsSchema],
    parentsemails: [{type: String}],
    nursery: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Nursery"
        },
        username: String
    },
    teacher: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Teacher"
        },
        username: String
    },
    parent:[{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Parent"
        }]
    
});

childrenSchema.pre('update',function(next) {
    this.model('Nursery').update(
        { },
        { "$pull": { "children": this._id } },
        { "multi": true },
        next
    );
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Children', childrenSchema);