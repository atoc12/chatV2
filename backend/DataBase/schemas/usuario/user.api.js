const {Router} = require('express');
const cookieParser = require('cookie-parser');
const ObtenerUsuarios = require('./function/usuario/obtener');
const cookie = require('cookie');
const CrearUsuario = require('./function/usuario/crear');
const session = require('express-session');

const userApi = Router();
userApi.use(cookieParser());

userApi.post("/",async(req,res)=>{
    try{
        let resultado =await ObtenerUsuarios(req.body.session ? 
            {
                body:{
                    search:{
                        email:req.body.search.email,
                        password:req.body.search.password
                    },
                    session:true
                }
            }
            :
            req,
            res
        );
        // res.json(resultado);
    }catch(err){console.log(err)}
});
userApi.post("/add",async(req,res)=>{
    try{
        let resultado = await CrearUsuario(req,res);
        res.json(resultado.message);
    }catch(err){console.log(err)}
});

module.exports = userApi;