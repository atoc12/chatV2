const {Schema, model} = require("mongoose");
const userSchema = new Schema({
    name:{
        type:String,
        minlength:3,
        required:true,
        unique:true,
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
            type:Schema.Types.ObjectId,
            ref:"usuarios",
        }
    ],
    contactos:[
        {
            type:Schema.Types.ObjectId,
            ref:"usuarios",
        }
    ],
    notificaciones:[
        {
            sender:String,
            name:String,
            content:String,
            reason:String,
            see:{
                type:Boolean,
                default:false,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            }
        }
    ],
    post:[
        {
            type:Schema.Types.ObjectId,
            ref:"publicacion",
        }
    ],
    post_like:[
        {
            type:Schema.Types.ObjectId,
            ref:"publicacion",
        }
    ],
    post_save:[
        {
            type:Schema.Types.ObjectId,
            ref:"publicacion",
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
    },
    permissions:[
        
    ]
});
userSchema.path('solicitud').validate(function (solicitudes) {
    const uniqueUserIds = new Set();
    for (const solicitud of solicitudes) {
        if (uniqueUserIds.has(solicitud._id.toString())) {
            return false;
        }
        uniqueUserIds.add(solicitud._id.toString());
    }
    return true;
}, 'Ya se ha enviado una solicitud.');

userSchema.index({ name: "text" });
const User = model('usuarios',userSchema);

module.exports = User;