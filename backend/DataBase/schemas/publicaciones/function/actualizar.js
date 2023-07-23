const Publicacion = require("../publicaciones");

const ActualizarPublicacion = async (req,res=null)=>{
    try{    
        const {search,update,user} = req.body;
        console.log("lol");
        // console.log(search,update);

        let res = await Publicacion.findOne(search);
        if(res.creator.toString() == user._id){
            console.log("tiene permisos");
            await res.updateOne(update,{new:true});
            await res.save();
        }else{
            console.log("este usuarios no tiene permisos para actualizar estos datos");
        }


        
    }catch(err){    
        console.log(err);
    }
}

module.exports = ActualizarPublicacion;