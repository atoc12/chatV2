const ObtenerUsuarios = require("../../../DataBase/schemas/usuario/function/usuario/obtener");
const ObtenerUsuario =async (datas,socket)=>{
    try{
        const {datos,user} =datas;
        let res = await ObtenerUsuarios({
            body:{
                search: !datos._id ?{
                    name:datos
                }:{_id:datos._id},
                value:['_id',"email","conexion","picture","name",'contactos','solicitud']
            }
        });
        if(res && res.data){
            let resultado ={ 
                _id:res.data._id.toString(),
                name:res.data.name,
                email:res.data.email,
                picture:res.data.picture,
                conexion:res.data.conexion,
                incontact:user ? res.data.contactos.filter(contactos => contactos._id.toString() === user._id).length >0 ? false : true : null,
                solicitud: user ? res.data.solicitud.filter(solicitud => solicitud._id.toString() === user._id).length >0 ? true : false : null
            }
            socket.emit("recibir-informacion-usuario",resultado);
        }
    }catch(err){
        console.log(err);
    }
}

module.exports = ObtenerUsuario;