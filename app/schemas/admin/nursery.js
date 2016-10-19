var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var passportLocalMongoose = require("passport-local-mongoose");

// nursaryDetails Schema ---------------------------------------------------
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
//----------------------------------------------------------------


// define the schema for our user model
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
    waitingRegistrationParents: [{email:String,childId:String}]

    
});


// generating a hash
nurserySchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
nurserySchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
/////////////////////////////////////////IMPORTANT
nurserySchema.plugin(passportLocalMongoose);
///////////////////////////////////////////////////////
// create the model for users and expose it to our app
module.exports = mongoose.model('Nursery', nurserySchema);
