const Publicacion = require("../publicaciones");

const CrearPublicacion = async(req,res=null)=>{
    try{
        const data = req.body;
        if(data.content.length > 1){
            let nueva_publicacion = await new Publicacion(data).save();
            return {message:"publicacion creada",datos:nueva_publicacion};
        }else{
            return {message:"debe ser mayor de un caracter"};
        }
    }catch(err){
        let errores=err.errors;
            this.message={...this.message,data:null,type:'error'}
            if(errores){
                for(let campos in errores){
                    let campoError = errores[campos];
                    if(campoError.kind === 'required') return {...this.message,content:`${campos} is required`};
                    if(campoError.kind  === 'minlength') return {...this.message,content:`${campos} need min ${campoError.properties.minlength} characters`};
                    if(campoError.kind == 'ObjectId') return {...this.message,content:`Id invalida`};
                }
            }else{
                if (err.code === 11000 && err.keyValue) {
                    const duplicatedField = Object.keys(err.keyValue)[0];
                    if (duplicatedField) {
                        if(err.code === 11000) return {...this.message,content:`${duplicatedField} is used`};
                    }
                }
            }
            return {...this.message,content:err.message};
    }
}

module.exports=CrearPublicacion;