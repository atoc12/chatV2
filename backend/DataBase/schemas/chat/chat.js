const {Schema, model} = require("mongoose");
//-------------------------------------------------------------------------------------------------Esquema----------------------------------------------
const chatSchema =new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'usuario'
    }],
    messages: [{
        content: String,
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'usuario'
        },
        name:{
            type:String
        },
        timestamp: {
            type: String,
            default: Date
        }
    }]
})
const Chat = model("chat",chatSchema);
module.exports = Chat;