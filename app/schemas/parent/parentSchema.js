var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var passportLocalMongoose = require("passport-local-mongoose");

// managerDetails Schema ---------------------------------------------------
var ParentDetailsSchema = new mongoose.Schema({
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
mongoose.model("ParentDetails", ParentDetailsSchema);
//----------------------------------------------------------------


// define the schema for our user model
var parentSchema = new mongoose.Schema({
    username:String,
    password:String,
    resetPasswordToken: Number,
    activationhash:String,
    active:Number,
    label: String,
    details: [ParentDetailsSchema],
    nursery: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Nursery"
        },
        username: String
       
    }
    
});


// generating a hash
parentSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
parentSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
/////////////////////////////////////////IMPORTANT
parentSchema.plugin(passportLocalMongoose);
///////////////////////////////////////////////////////
// create the model for users and expose it to our app
module.exports = mongoose.model('Parent', parentSchema);