const { Mongoose , connect} = require('mongoose');

(async ()=>{
    try{
        await connect('mongodb://34.151.204.251:27017/test');
        console.log("conexion exitosa");
    }catch(err){console.log(err)}
})()