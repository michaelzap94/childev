var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var passportLocalMongoose = require("passport-local-mongoose");

// nursaryDetails Schema ---------------------------------------------------
var NurseryDetailsSchema = new mongoose.Schema({
    name:String,
    urn:String,
    contactnumber:Number,
    email:String,
    label: String,
    address: {
        address1:String,
        address2:String,
        city:String,
        country:String,
        postcode:String
    }
    
});
mongoose.model("NurseryDetails", NurseryDetailsSchema);
//----------------------------------------------------------------
// managerDetails Schema ---------------------------------------------------
var ManagerDetailsSchema = new mongoose.Schema({
    firstname:String,
    lastname:String,
    contactnumber:Number,
    email:String,
    label: String,
    address: {
        address1:String,
        address2:String,
        city:String,
        country:String,
        postcode:String
    }
});
mongoose.model("ManagerDetails", ManagerDetailsSchema);
//----------------------------------------------------------------


// define the schema for our user model
var userSchema = mongoose.Schema({
    username:String,
    password:String,
    label:String,
    resetPasswordToken: Number,
    details: [NurseryDetailsSchema],
    managerDetails: [ManagerDetailsSchema],
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
    }]
    
});


// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
/////////////////////////////////////////IMPORTANT
userSchema.plugin(passportLocalMongoose);
///////////////////////////////////////////////////////
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
