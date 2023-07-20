const ObtenerUsuarios = require("../../DataBase/schemas/usuario/function/usuario/obtener");

const ValidarToken =async (datos,socket)=>{
    try{
        let resultado = await ObtenerUsuarios({
            body:{
                search:{session:datos},
                value:['session']
        }},null);
        socket.emit("resultado-token",resultado);
    }catch(err){
        console.log(err);
    }
}

module.exports = ValidarToken;