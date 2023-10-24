const {Router} = require('express');
const Usuario = require('./usuarios/user');
const Post = require('./publicacion/publicacion');
const rest = Router();
// -----------------------------Usuario-------------------------------------//
rest.get('/user/get',async (req,res)=>{
    const DATA =await new Usuario().read();
    res.json(DATA);
})
rest.post('/user/create',async(req,res)=>{
    const {VALUE,SESSION} = req.body;
    const DATA =await new Usuario({value:VALUE}).create(SESSION);
    res.json(DATA);
})
rest.post('/user/search',async (req,res)=>{
    try{
        const {SEARCH,VALUE,WHERE,SPECIFY,SESSION} = req.body;
        const DATA =await new Usuario({search:SEARCH,value:VALUE,specify:SPECIFY,session:SESSION}).read();
        res.json(DATA);
    }catch(err){
        res.json({message:'error'});
    }
})
rest.put('/user/update',async (req,res)=>{
    const {SEARCH,VALUE,WHERE,SPECIFY} = req.body;
    console.log(req.body);
    const DATA =await new Usuario({search:SEARCH,value:VALUE,specify:SPECIFY}).update();
    res.json(DATA);
})
rest.delete('/user/delete',async(req,res)=>{
    const {SEARCH,VALUE,SPECIFY} = req.body;
    const DATA =await new Usuario({search:SEARCH,value:VALUE,specify:SPECIFY}).delete();
    res.json(DATA);

})
// ----------------------------------------------------------------------------//
//------------------------------------Publicaciones----------------------------//
rest.get('/publication/get',async (req,res)=>{
    try{
        const DATA =await new Post().read();
        res.json(DATA);
    }catch(err){
        console.log(err);
    }
})
rest.post('/publication/search',async (req,res)=>{
    try{
        const {SEARCH,VALUE,RESPONSE} = req.body;
        const DATA =await new Post({search:SEARCH,value:VALUE,response:RESPONSE}).read();
        res.json(DATA);
    }catch(err){
        console.log(err);
    }
})
rest.post('/publication/create',async (req,res)=>{
    try{
        const {VALUE} = req.body;
        const DATA =await new Post({value:VALUE}).create();
        res.json(DATA);
    }catch(err){
        console.log(err);
    }
})
rest.put('/publication/update',async (req,res)=>{
    try{
        const {SEARCH,VALUE,SPECIFY} = req.body;
        const DATA =await new Post({search:SEARCH,value:VALUE,specify:SPECIFY}).update();
        res.json(DATA);
    }catch(err){
        console.log(err);
    }
})
rest.delete('/publication/delete',async (req,res)=>{
    try{
        const {SEARCH,VALUE,SPECIFY} = req.body;
        const DATA =await new Post({search:SEARCH,value:VALUE,specify:SPECIFY}).delete();
        res.json(DATA);
    }catch(err){
        console.log(err);
    }
})













module.exports = rest;