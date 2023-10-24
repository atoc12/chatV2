const {Schema,model} = require("mongoose");
const { Add } = require("../functions/crud");
const User = require("../user/user_schema");
const errorescatch = require("../../errors/errors");

const publicacionSchema = new Schema({
    creator:{
        type:Schema.Types.ObjectId,
        ref:"usuarios",
        required:true
    },
    picture:{
        type:String,
    },
    like:[
        {
            type:Schema.Types.ObjectId,
            ref:"usuarios",
            required:true,
        }
    ],
    content:{
        type:String,
        required:true,
    },
    myresponse:[
        {
            type:Schema.Types.ObjectId,
            ref:'post',
        }
    ],
    response:[
        {
            type:Schema.Types.ObjectId,
            ref:'post',
        }
    ],
    categories:[],
    channels:[
        {   
            _id:false,
            name:String,
        }
    ],
    status:{
        type:Boolean,
        default:true,
    },
    timestamp: {
        type: String,
        default: Date
    }
})

publicacionSchema.path('like').validate(function (likes) {
    const uniqueUserIds = new Set();
    for (const like of likes) {
        if (uniqueUserIds.has(like._id.toString())) {
            return false;
        }
        uniqueUserIds.add(like._id.toString());
    }
    return true;
}, 'Likes must be unique within the same publication.');

publicacionSchema.methods.addLike=async function(like,userLike){
    let user = await User.findById(userLike);
    let creator = await User.findById(this.creator);
    try{

        if(!user) throw new Error("usuario no encontrado");
        this.like.push(userLike);
        user.post_like.push(this._id);
        creator.notificaciones.push({sender:user._id,name:user.name,content:user.name+" le ha dado like a una de tus publicaciones"});
        await user.save();
        await this.save();
        await creator.save();
    }catch(err){
        if(err.errors["post_like"]){
            this.like.pull(userLike);
            user.post_like.pull(this._id);
            await user.save();
            await this.save();
        }else{
            errorescatch(err);
        }

    }finally{
        const rest = this.populate("creator",{name:1,email:1});
        return rest;
    }

};

publicacionSchema.method.addComment = async function (comment,creator){
    try{

        let userCreator = await User.find({_id:creator}); // se busca el usuario que ha creado este comentario
        let postComment = new Publicacion({creator:creator,content:comment}); //se crea el comentraio
        userCreator.myresponse.push(postComment);// una vez creado el comentario se almacena en el campo de myresponse haciendo referencia a sus respuestas
        this.response.push(postComment); // una vez creado el comentario se almacena dentro de response haciendo referencia a las publicaciones q reponden a esta publicacion

        // ya terminado la etapa de almacenamiento se debe guardar los cambios
        await userCreator.save();
        await this.save();

    }catch(err){
        console.log("error al responder");
    }
}


const Publicacion = model('post',publicacionSchema);
module.exports = Publicacion;