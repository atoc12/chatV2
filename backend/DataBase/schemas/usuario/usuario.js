const {Schema, model} = require("mongoose");
const userSchema = new Schema({
    name:{
        type:String,
        minlength:3,
        required:true,
    },
    password:{
        type:String,
        minlength:8,
        required:true,
    },
    picture:{
        type:String,
        default:null
    },
    age:Number,
    email:{
        type:String,
        required:true,
        unique:true,
    },
    solicitud:[
        {
            _id:{
                type:Schema.Types.ObjectId,
                ref:"usuarios",
            },
            name:String
        }
    ],
    contactos:[
        {
            _id:{
                type:Schema.Types.ObjectId,
                ref:"usuarios",
            },
            chat_id:{
                type:Schema.Types.ObjectId,
                ref:"chats",
            },
            name:String,
            age:Number,
            socket_id:{
                type:String,
                default:null
            },
            conexion:{
                type:Boolean,
                default:false,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            }
        }
    ],
    notificaciones:[
        {
            sender:String,
            name:String,
            content:String,
            timestamp: {
                type: Date,
                default: Date.now,
            }
        }
    ],
    mis_publicaciones:[
        {
            name:String,
            content:String,
            timestamp: {
                type: Date,
                default: Date.now,
            }
        }
    ],
    conexion:{
        type:Boolean,
        default:false
    },
    session:{
        type:String,
        default:null
    },
    socket_id:{
        type:String,
        default:null
    }
});

const User = model('usuarios',userSchema);

module.exports = User;