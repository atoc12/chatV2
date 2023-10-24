const {Schema, model} = require("mongoose");
const errorescatch = require("../../errors/errors");
const isRepeat = require("../validations/unique/unique");
const { Remove, Add } = require("../functions/crud");
const Chat = require("../chat/chat_schema");
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
        default:null,
        require:true
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
            sender:{
                type:Schema.Types.ObjectId,
                ref:"usuarios",
            },
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
            ref:"post",
        }
    ],
    post_response:[
        {
            type:Schema.Types.ObjectId,
            ref:"post",
        }
    ],
    post_like:[
        {
            type:Schema.Types.ObjectId,
            ref:"post",
        }
    ],
    post_save:[
        {
            type:Schema.Types.ObjectId,
            ref:"post",
        }
    ],
    chats:[
        {
            type:Schema.Types.ObjectId,
            ref:"chat",
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
// -----------------------------------------------------Validations-----------------------------------------------------------------------
userSchema.path('solicitud').validate(function (solicitud){return isRepeat({elements:solicitud,body:this,autoRemove:true,campo:"solicitud"})},"Se ha removido");
userSchema.path('contactos').validate((contacto)=>isRepeat({elements:contacto}), 'Ya es un contacto.');// valida si ya existe ese contacto
userSchema.path('post_save').validate((post_save)=>isRepeat({elements:post_save}), 'Ya se ha guardado.');// valida si ya está almacenado esa publicacion
userSchema.path('post_like').validate((post_like)=>isRepeat({elements:post_like}), 'Ya se ha likeado');// valida si ya está almacenado esa publicacion|

// -----------------------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------READ-----------------------------------------------------------------------------

userSchema.methods.readPost =function(post=null){
    return this.populate('post');
}

//----------------------------------------------------------Add-----------------------------------------------------------------------------

userSchema.methods.addNotiications =async function(notificacion){return await Add({base:this,campo:"notificaciones",elements:notificacion})}
userSchema.methods.addPost=async function(post){return Add({base:this,campo:"post",elements:post})};
userSchema.methods.addPost_response=async function(post_response){return await Add({base:this,campo:"post_response",elements:post_response})};
userSchema.methods.addPost_like=async function(post_like){return await Add({base:this,campo:"post_like",elements:post_like})};
userSchema.methods.addPost_save=async function(post_save){return await Add({base:this,campo:"post_save",elements:post_save})};
userSchema.methods.addRequest = async function (solicitud) {  
    let res =  await Add({base:this,campo:'solicitud',elements:solicitud});
    let solicitudRes = await User.findById(solicitud);
    this.notificaciones.push(
        {
            sender:solicitud,
            name:solicitudRes.name,
            content:`${solicitudRes.name} te ha enviado una solicitud`
        }
    )
    await this.save();
    return  res;
};
userSchema.methods.addContact= async function (solicitud){
    try{
        if(!this.solicitud.includes(solicitud._id)) throw new Error("No se te ha enviado esa solicitud");
        this.contactos.push(solicitud._id);
        this.solicitud.pull(solicitud._id);
        let otherUser = await User.findOne({_id:solicitud._id});
        otherUser.contactos.push(this._id);

        let chat_search =await Chat.findOne({typeChat:"private", participants: { $all: [this._id, solicitud._id], $size: 2 }})

        if(!chat_search){
            let chat = new Chat({
                participants:[this._id,otherUser._id]
            });
            this.chats.push(chat._id);
            otherUser.chats.push(chat._id);
            await chat.save();
        }else{
            chat_search.status = true;
            await chat_search.save();
        }
        
        await otherUser.save();
        return await this.save();
    }catch(err){
        console.log(err);
        return errorescatch(err)
    }
}
//------------------------------------------------------Remove---------------------------------------------------------------------------------
userSchema.methods.removeRequest=async function (request) {return await Remove({base:this,campo:'solicitud',elements:request._id})};
userSchema.methods.removeContact=async function (contacto) {
    try{
        console.log(contacto)
        if(!this.contactos.includes(contacto._id)) throw new Error("No tienes ese contacto");
        let otherUser = await User.findOne({_id:contacto._id});
        otherUser.contactos.pull(this._id);
        this.contactos.pull(contacto._id);
        await otherUser.save();
        return await this.save();
    }catch(err){
        return errorescatch(err)
    }

    
};
userSchema.methods.removePost=async function (post) {return await Remove({base:this,campo:'post',elements:post._id})};
userSchema.methods.removePost_save=async function (post_response) {return await Remove({base:this,campo:'post_response',elements:post_response._id})};
userSchema.methods.removePost_like=async function (post_like) {console.log("borrar"); return await Remove({base:this,campo:'post_like',elements:post_like._id})};
userSchema.methods.removePost_save=async function (post_save) {return await Remove({base:this,campo:'post_save',elements:post_save._id})};
//---------------------------------------------------------------------------------------------------------------------------------------------
const User = model('usuarios',userSchema);
module.exports = User;