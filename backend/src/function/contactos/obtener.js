const ObtenerContacto = require("../../../DataBase/schemas/usuario/function/contactos/obtener");
const ObtenerContactos =async (datos,socket)=>{
    try{
        let res = await ObtenerContacto({body:{search:{_id:datos._id}}})
        if(res && res.length>0){
            res=res.map(contacto=>{ // se reorganiza el array 
                socket.leave(contacto._id.toString());
                socket.join(contacto._id.toString()); // se une al canal de cada contacto para poder comunicarse
                socket.to(contacto._id.toString()).emit("conexion-contacto",{message:`${datos.name} se ha conectado`});//envia un mensaje a cada usuario
                return{
                    _id:contacto._id,
                    name:contacto.name,
                    email:contacto.email,
                    picture:contacto.picture,
                    conexion:contacto.conexion,
                    chat_id:contacto.contactos[0].chat_id.toString()
                }
            })
        }
        socket.emit("recibir-contactos",await res);
    }catch(err){
        console.log(err);
    }
}

module.exports = ObtenerContactos;