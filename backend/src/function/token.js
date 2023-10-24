const ObtenerUsuarios = require("../../DataBase/schemas/usuario/function/usuario/obtener");
const Usuario = require("../../api/usuarios/user");

const ValidarToken =async (datos,socket)=>{
    try{
        let resultado2 = await new Usuario({search:{session:datos},specify:['session']}).read();
        socket.emit("resultado-token",resultado2);
    }catch(err){
        console.log(err);
    }
}

module.exports = ValidarToken;