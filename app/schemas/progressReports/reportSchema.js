var mongoose = require('mongoose');

// intellectualSchema progress---------------------------------------------------
var intellectualSchema = new mongoose.Schema({
   realValue:Number, //value taking into account the priority weight
   skills:{
       mathematical: Number,
       language: Number,
       attention: Number,
       recognition: Number
   }
   
});
mongoose.model("Intellectual", intellectualSchema);
// socialSchema progress ---------------------------------------------------
var socialSchema = new mongoose.Schema({
   realValue:Number, //value taking into account the priority weight
   skills:{
       respect: Number,
       teamworking: Number,
       independence: Number,
       feelingsexpression: Number
   }
});
mongoose.model("Social", socialSchema);
// physicalSchema progress---------------------------------------------------
var physicalSchema = new mongoose.Schema({
   realValue:Number, //value taking into account the priority weight
   skills:{
       motor: Number,
       manipulative: Number,
       hygiene: Number,
       diet: Number
   }
});
mongoose.model("Physical", physicalSchema);
/****with priorities******************************************************************/

// intellectualSchema progress---------------------------------------------------
var intellectualWithPrioritiesSchema = new mongoose.Schema({
   realValue:Number, //value taking into account the priority weight
   skills:{
       mathematical: Number,
       language: Number,
       attention: Number,
       recognition: Number
   }
   
});
mongoose.model("IntellectualWithPriorities", intellectualSchema);

// socialSchema progress ---------------------------------------------------
var socialWithPrioritiesSchema = new mongoose.Schema({
   realValue:Number, //value taking into account the priority weight
   skills:{
       respect: Number,
       teamworking: Number,
       independence: Number,
       feelingsexpression: Number
   }
});
mongoose.model("SocialWithPriorities", socialSchema);

// physicalSchema progress---------------------------------------------------
var physicalWithPrioritiesSchema = new mongoose.Schema({
   realValue:Number, //value taking into account the priority weight
   skills:{
       motor: Number,
       manipulative: Number,
       hygiene: Number,
       diet: Number
   }
});
mongoose.model("PhysicalWithPriorities", physicalSchema);


// define the schema for our user model
var progressSchema = new mongoose.Schema({
    label: String,
    intellectual:[intellectualSchema],
    social:[socialSchema],
    physical:[physicalSchema],
    intellectualWithPriorities: [intellectualWithPrioritiesSchema],
    socialWithPriorities: [socialWithPrioritiesSchema],
    physicalWithPriorities: [physicalWithPrioritiesSchema],
    avgValue:Number,
    childAge:Number,
    dateCreated:{type:Date, default: Date.now},// if date is empty the default is Date.now
    nursery: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Nursery"
        }
    },
    teacher: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Teacher"
        },
        username: String,
        name:String,
        label:String
    },
    children: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Children"
        }
   }
    
});


// create the model for users and expose it to our app
module.exports = mongoose.model('Report', progressSchema);