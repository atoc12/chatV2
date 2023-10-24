const {connect} = require("mongoose");
async function Conexion (URL){
    try{
        await connect(URL);
        console.log("conexion exitosa");
    }catch(err){
        console.log(err)
    }
}

module.exports = Conexion