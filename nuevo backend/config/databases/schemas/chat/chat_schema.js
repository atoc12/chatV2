const {Schema, model} = require("mongoose");
const isRepeat = require("../validations/unique/unique");
const { Add } = require("../functions/crud");
//-------------------------------------------------------------------------------------------------Esquema----------------------------------------------
const chatSchema =new Schema({
    participants: [{
            type: Schema.Types.ObjectId,
            ref: 'usuarios',
            require:true,
    }],
    typeChat:{
        type:String,
        default:"private",
    },
    messages: [{
        content: String,
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'usuarios'
        },
        name:{
            type:String
        },
        timestamp: {
            type: String,
            default: Date
        }
    }],
    status:{
        type:Boolean,
        default:true
    }
})

chatSchema.path('participants').validate((contacto)=>isRepeat({elements:contacto}), 'Ya es un participante.');// valida si ya existe ese contacto

chatSchema.methods.addParticipants=async function(participants){return Add({base:this,campo:"participants",elements:participants})};

const Chat = model("chat",chatSchema);

module.exports = Chat;