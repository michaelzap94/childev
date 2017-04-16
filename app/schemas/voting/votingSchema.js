var mongoose = require("mongoose");
//This is the Schema that defines the values of each option
var optionSchema = new mongoose.Schema({
   value: {type:Number, default: 0},
   label: String,
   color: String
    
});
var Option = mongoose.model("Option", optionSchema);

//This is the Schema that defines the values of each Poll
var pollsSchema = new mongoose.Schema({
   title: String,
   description: String,
   author: {
         id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Nursery"
        },
        username: String,
        label:String
    }, optionsArray: [optionSchema],
    voters: [{
         id:{
            type:mongoose.Schema.Types.ObjectId,
            },
        username: String
       
    }],
    dateCreated:{type:Date, default: Date.now},// if date is empty the default is Date.now
});

module.exports = mongoose.model("Poll", pollsSchema);