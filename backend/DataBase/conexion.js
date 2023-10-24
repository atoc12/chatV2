const { Mongoose , connect} = require('mongoose');

(async ()=>{
    try{
        await connect('mongodb://localhost/test');
        console.log("conexion exitosa");
    }catch(err){console.log(err)}
})()