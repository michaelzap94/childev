var mongoose = require("mongoose");

var optionSchema = new mongoose.Schema({
   value: {type:Number, default: 0},
   label: String,
   color: String
    
});
var Option = mongoose.model("Option", optionSchema);

var pollsSchema = new mongoose.Schema({
   title: String,
   description: String,
   author: {
         id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Nursery"
        },
        username: String,
        label:String,
        dateCreated:{type:Date, default: Date.now},// if date is empty the default is Date.now
       
    }, optionsArray: [optionSchema],
    voters: [{
         id:{
            type:mongoose.Schema.Types.ObjectId,
            },
        username: String
       
    }]
});

module.exports = mongoose.model("Poll", pollsSchema);