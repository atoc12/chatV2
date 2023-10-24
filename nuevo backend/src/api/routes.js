const express = require('express');
const path = require("path");
const multer = require("multer");
const sharp = require('sharp');
const User = require('../../config/databases/schemas/user/user_schema');
const Publicacion = require('../../config/databases/schemas/post/post_schema');
const errorescatch = require('../../config/databases/errors/errors');
const idGenerator = require('../../config/databases/schemas/functions/tokengenerator');
const Chat = require('../../config/databases/schemas/chat/chat_schema');
const REST = express.Router();
const carpetaPath = path.resolve(__dirname, '../../../carpetas');

REST.use('/carpetas', express.static(carpetaPath));

const storage = multer.memoryStorage();



const upload = multer({ storage: storage });



// ------------------------------------------------------------------USER-----------------------------------------------------------



REST.post('/user/search',async (req,res)=>{ // busca un usuario
    try{
        const {SEARCH,SPECIFY,VALUE,TOKEN,SESSION} = req.body;
        if(SEARCH.session){
            const DATA = await User.findOne({session:SEARCH.session});
            res.json( DATA ? {message:"token valido",type:"succes",data:DATA} : {message:"token invalido",type:"error",data:null} )
        }else{

            let params_not_return = SESSION ? {session:1,name:1,email:1} : {session:0,password:0};
            const DATA =  await User.find(SEARCH,params_not_return);

            if(SESSION){
                if(DATA.length <= 0) throw new Error("Correo o contraseña incorrectos");
                DATA[0].session=idGenerator();
                await DATA[0].save();
            }
            res.json({message:"datos encontrados",type:"succes",data:DATA})
        }

    }catch(err){
        res.json(errorescatch(err));
    }
});

REST.post("/user/create",async(req,res)=>{ // Crea un nuevo usuario
    try{
        const {SEARCH,SPECIFY,VALUE,TOKEN} = req.body;
        const DATA = new User(VALUE);
        DATA.picture="pic-"+DATA._id;
        DATA.session=idGenerator();
        const {_id,session,email,name} = await DATA.save();
        res.json({message:"succes",type:"succes",data:{_id,session,email,name}});
    }catch(err){
        res.json(errorescatch(err));
    }
});

REST.delete("/user/delete",async(req,res)=>{
    try{
        const {SEARCH,SPECIFY,VALUE,TOKEN} = req.body;
        const response = await User.findOneAndDelete(SEARCH);
        if(!response) throw new Error("No se ha encontrado");
        res.json({message:"datos elminados",type:"succes",data:null})
    }catch(err){
        res.json(errorescatch(err));
    }
});

REST.put("/user/update",async(req,res)=>{
    try{
        const {SEARCH,SPECIFY,VALUE,TOKEN} = req.body;
        const RESPONSE = await User.findOneAndUpdate(SEARCH,VALUE,{session:0,password:0});
        if(!RESPONSE) throw new Error("No se ha encontrado");
        res.json({message:"datos actualizados",type:"succes",data:RESPONSE})
    }catch(err){
        res.json(errorescatch(err));
    }
})

// -------------------------------------------POST-----------------------------------------------------





REST.post("/post/search",async(req,res)=>{
    try{
        const {SEARCH,SPECIFY,VALUE,TOKEN} = req.body;
        console.log(SEARCH)
        let DATA =await Publicacion.find(SEARCH)
            .populate('creator',{name:1,email:1,picture:1})
            .populate({
                path:"myresponse",
                populate:{
                    path:"creator",
                    select:"name _id email"
                }
            });
        res.json({message:"datos encontrados",type:"succes",data:DATA})
    }catch(err){
        console.log(err);
        res.json(errorescatch(err));   
    }
})

REST.post("/post/create",async(req,res)=>{
    try{
        const {SEARCH,SPECIFY,VALUE,TOKEN} = req.body;
        const { myResponse , content } = VALUE;
        const USER = await User.findOne(SEARCH);
        let POST = null;
        if(myResponse){
            POST = new Publicacion({creator:USER,content:content});
            POST.myresponse.push(myResponse);
            let publicacionResponse = await Publicacion.findById(myResponse).populate("creator",{_id:1,name:1,email:1,notificaciones:1});
            publicacionResponse.response.push(POST);
            publicacionResponse.creator.notificaciones.push({
                sender:USER,
                content:`te han commentado`

            })

            await publicacionResponse.save();

        }else{
            POST = new Publicacion({creator:USER,...VALUE});
        }
        USER.post.push(POST);
        await POST.save();
        await USER.save();
        let response = await POST.populate('creator',{name:1,email:1,_id:1});
        res.json({message:"Publicacion creada",type:"succes",data:response})
    }catch(err){
        res.json(errorescatch(err));   
    }
})

REST.delete("/post/delete",async(req,res)=>{
    try{
        res.json({message:"datos encontrados",type:"succes",data:null})
    }catch(err){
        res.json(errorescatch(err));   
    }
})

REST.put("/post/update",async(req,res)=>{
    try{
        res.json({message:"datos encontrados",type:"succes",data:null})
    }catch(err){
        res.json(errorescatch(err));   
    }
})


//----------------------------------Chats-------------------------------

REST.post("/chat/search",async(req,res)=>{
    try{
        const {SEARCH,SPECIFY,VALUE,TOKEN} = req.body;

        const RESULT = await Chat.find(SEARCH).populate('participants') ; 

        res.json({message:"exito",type:"succes",data:RESULT});

    }catch(err){
        res.json(errorescatch(err));   
    }
})

REST.put("/chat/update",async(req,res)=>{
    try{
        const {SEARCH,SPECIFY,VALUE,TOKEN} = req.body;

        const RESULT = await Chat.find(SEARCH).populate('participants') ; 

        res.json({message:"exito",type:"succes",data:RESULT});

    }catch(err){
        res.json(errorescatch(err));   
    }
})

REST.delete("/chat/delete",async(req,res)=>{
    try{
        const {SEARCH,SPECIFY,VALUE,TOKEN} = req.body;

        const RESULT = await Chat.find(SEARCH).populate('participants') ; 

        res.json({message:"exito",type:"succes",data:RESULT});

    }catch(err){
        res.json(errorescatch(err));   
    }
})





// -------------------------------FILES---------------------------------

REST.post("/subir/archivo",upload.single('lol'),async (req,res)=>{
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No se ha subido ningún archivo" });
        }

        const imageBuffer = req.file.buffer;
        const imageName = req.file.originalname;

        // Utiliza Sharp para procesar la imagen
        const processedImage = await sharp(imageBuffer)
            .toFormat('jpeg') // Convertir a JPEG
            .jpeg({ quality: 80 }) // Comprimir la imagen
            .toBuffer();

        // Guarda la imagen procesada en la ubicación específica
        const imagePath = path.join(carpetaPath+"/usuario/icon", imageName + '.jpg');
        await sharp(processedImage).toFile(imagePath);

        res.json({ message: "Imagen procesada y guardada correctamente" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

module.exports=REST;