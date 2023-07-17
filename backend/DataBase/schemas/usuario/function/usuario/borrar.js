const User = require("../../usuario");
const BorrarUsuarios=async (req,res)=>{// funcion que elimina registros de usuarios
    try{
        let datos = req.body;
        let resultado =await User.findByIdAndDelete({_id:datos._id})
        if(!resultado) return res.json({message:"registro no existente"});
        res.json({message:"datos eliminado con exito"});
    }catch(err){
        for(let campos in err.error){
            if(err.error[campos].kind === "ObjectId") return res.json({message:"identificadro necesario"});
        }
        console.log(err);
    }
}

module.exports = BorrarUsuarios;