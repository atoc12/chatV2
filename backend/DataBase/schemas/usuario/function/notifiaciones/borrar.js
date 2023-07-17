const User = require("../../usuario");
const BorrarNotificacion = async(req,res=null)=>{
    try{
        let {search,value} = req.body;
        let usuario = await User.findOne(search);
        if(!usuario) return ;
        if(value){
            let noti =usuario.notificaciones.findIndex((notificaciones)=> notificaciones._id.toString() === value._id.toString());
            if(noti === -1) return {message:"contacto no existente"};
            usuario.notificaciones.splice(noti,1);
        }else{
            usuario.notificaciones = [];
        }
        await usuario.save()
    }catch(err){console.log(err)}
}
module.exports = BorrarNotificacion;