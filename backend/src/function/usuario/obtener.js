const ObtenerUsuarios = require("../../../DataBase/schemas/usuario/function/usuario/obtener");
const ObtenerUsuario =async (datas,socket)=>{
    try{
        const {datos,user} =datas;
        let res = await ObtenerUsuarios({
            body:{
                search:{
                    name:datos
                },
                value:['_id',"email","conexion","picture","name",'contactos']
            }
        });
        // console.log(res);
        let resultado ={ 
            _id:res.data._id.toString(),
            name:res.data.name,
            email:res.data.email,
            picture:res.data.picture,
            conexion:res.data.conexion,
            incontact:res.data.contactos.filter(contactos => contactos._id.toString() === user._id).length >0 ? false : true
        }
        socket.emit("recibir-informacion-usuario",resultado);
    }catch(err){
        console.log(err);
    }
}

module.exports = ObtenerUsuario;