var mongoose = require('mongoose');
/**
 * This Object defines the Message Schema
 * @namespace
 * @property {string}  label - A label of the type of user.
 * @property {object}  dateCreated - The date the account was created.
 * @property {object}  from - Object containing information of the user that sent the message.
 * @property {object}  to -  Object containing information of the user that the messsage was sent to.
 * @property {object}  message -  The message.
 * @property {object}  nursery -  The 'Nursery' object this message belongs to.
 */
 var messageSchema = new mongoose.Schema({
    nursery: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Nursery"
        }
    },
     from: {
         id:{
            type:mongoose.Schema.Types.ObjectId
        },
        username: String,
        name:String,
        label:String,
        deleted:{type:Boolean, default: false}
     },
     to: {
         id:{
            type:mongoose.Schema.Types.ObjectId,
        },
        username: String,
        name:String,
        label:String,
        deleted:{type:Boolean, default: false},
        read:{type:Boolean, default: false}
     },
     message: String,
     dateCreated:{type:Date, default: Date.now}// if date is empty the default is Date.now

     
    
});



/**
* Creates the Parent Schema to be saved in the database.
* @module app/schemas/children/childrenSchema
*/
module.exports = mongoose.model('Message', messageSchema);