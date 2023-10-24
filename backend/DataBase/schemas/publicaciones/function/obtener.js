const ObtenerUsuarios = require("../../usuario/function/usuario/obtener");
const User = require("../../usuario/usuario");
const Publicacion = require("../publicaciones");

const ObtenerPublicacion =async (req,res=null,response=true)=>{
    try{
        const {search,where,regex,user} = req.body;
        let resultado = null;
        if(where){
            resultado = await Publicacion.find(search ? search : {}).where(where).regex(regex ? regex : 'i');
        }else{
            resultado = await Publicacion.find(search ? search : {});
        }
        let id = resultado.map(publi => publi.creator);
        let creador = await User.find({_id:{$in:id}}).select("_id name picture email");
        
        let estructura = Promise.all(resultado.flatMap(async (data)=>{
            let ind = creador.filter(user => user._id.toString() === data.creator.toString())[0];
            if(ind){
                return {
                    _id:data._id.toString(),
                    creator:data.creator.toString(),
                    name: ind.name,
                    email: ind.email,
                    picture: ind.picture,
                    content:data.content,
                    like:data.like,
                    status:data.status,
                    myresponse:data.myresponse.length >0 && response ? (await ObtenerPublicacion({body:{
                        search:{
                            _id:data.myresponse[0]._id.toString()
                        }
                    }},null,false))[0] : null,
                    channels: data.channels,
                    categories: data.categories,
                    timestamp: data.timestamp,
                    type:"post",
                };
            }
        }))
        return estructura;
    }catch(err){
        console.log(err);
    }
}
module.exports= ObtenerPublicacion;