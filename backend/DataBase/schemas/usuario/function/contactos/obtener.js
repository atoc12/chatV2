const User = require("../../usuario");
const ObtenerContacto = async (req,res=null)=>{
    try{
        let datos= req.body; // obtiene todos los datos 
        let datos_search= datos.search;//obtiene los datos de busqueda
        let resultado=await User.findOne(datos_search,`contactos`);//se hace una consulta en busca de los contactos
        let contactos = resultado.contactos.map((contact)=>contact._id);//se almacena el identificador de cada contacto 
        let todoloscontactos =await User.find({_id:{$in:contactos}}).select(`_id name email contactos conexion picture`);// se busca cada contacto con su respectivo id
        let resu = todoloscontactos.flatMap(datos => { // se aplana el array de forma q se pueda organizar y se alamacena un nuevo array
            return {
                _id:datos._id.toString(),// convierte el objeto id en un string 
                email:datos.email,
                name:datos.name,
                picture:datos.picture,
                conexion:datos.conexion,
                contactos:datos.contactos.filter(data => data._id.toString() === datos_search._id)// se filtra por identificado en busca de coincidencia con el usuario
            };
        });
        if(res)return res.json(resu);
        return resu;
    }catch(err){console.log(err)}
}
module.exports = ObtenerContacto;