const User = require("../../usuario");
const ActualizarUsuario = async (req,res=null)=>{// funcion que permite actualizar los registros de un usuario
    try{
        let datos = req.body;
        let datos_search=datos.search;
        let datos_update=datos.update;
        let update_user = await User.findByIdAndUpdate(datos_search,datos_update,{new:true});
        if(!update_user)return res ? res.json({message:"error al actualizar"}) : "error al actualizar";
        if(!res) return {message:"datos almacenados",update:update_user};
        res.json({message:"registro actualizado"});
    }catch(err){
        console.log(err);
    }
}

module.exports = ActualizarUsuario;