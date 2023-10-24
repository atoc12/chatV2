const errorescatch =(err)=>{
    let errores=err.errors;
    this.message={...this.message,data:null,type:'error'}
    if(errores){
        for(let campos in errores){
            let campoError = errores[campos];
            if(campoError.kind === 'required') return {...this.message,message:`${campos} is required`};
            if(campoError.kind  === 'minlength') return {...this.message,message:`${campos} need min ${campoError.properties.minlength} characters`};
            if(campoError.kind == 'ObjectId') return {...this.message,message:`Id invalida`};
        }
    }else{
        if (err.code === 11000 && err.keyValue) {
            const duplicatedField = Object.keys(err.keyValue)[0];
            if (duplicatedField) {
                if(err.code === 11000) return {...this.message,message:`${duplicatedField} is used`};
            }
        }
    }
    return {...this.message,message:err.message};
}

module.exports = errorescatch;