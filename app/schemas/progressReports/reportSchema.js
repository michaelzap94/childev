var mongoose = require('mongoose');

// intellectualSchema progress
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
// socialSchema progress 
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
// physicalSchema progress
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


// define the schema for our user model
var progressSchema = new mongoose.Schema({
    label: String,
    intellectual:[intellectualSchema],
    social:[socialSchema],
    physical:[physicalSchema],
    avgValue:Number,
    childAge:Number,
    dateCreated:{type:Date, default: Date.now},// if date is empty the default is Date.now
    comments:{type:String, default: "No comments for this report."},
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