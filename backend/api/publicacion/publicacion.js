const Publicacion = require("../../DataBase/schemas/publicaciones/publicaciones");
const User = require("../../DataBase/schemas/usuario/usuario");
const errorescatch = require("../error/error");

class Post {
    constructor(data={search:null,value:null,specify:null,where:{value:null,regex:'i'},response:false}){
        this.search = data.search;
        this.value = data.value;
        this.response=data.response;
        this.specify = data.specify;
        this.publicacion = null;
        this.where = data.where && data.where.value ? data.where : null;
        this.specify = data.specify ? typeof data.specify===Array ? data.specify.join(" ",",") : data.specify : '' ; 
        this.message={
            data:null,
            content:null,
            type:'error'
        }
    }
    async create(){
        try{
            if(!this.value) throw new Error("Ingrese valores");
            if(!this.value.creator) throw new Error("es necesario el _id del creaador");
            let response =await new Publicacion(this.value).save();
            let user = await User.findById(this.value.creator);
            user.post.push(response);
            await user.save();
            if(!response) throw new Error("Ha ocurrido un error");
            
            await this.read({search:{
                _id:response._id
            }})

            this.message={//reasigna valores a las propiedades de la estructura de mensaje
                data:this.publicacion,
                content:'Publicacion creada correctamente',
                type:'success'
            }
            return this.message;//retorna el mensaje
        }catch(err){//------------------------------------------------------Errores
            return errorescatch(err);
        }
    }


    async read(datos={search:this.search,where:this.where,response:this.response,specify:this.specify}){ // Este metodo se encarga de buscar Datos especificos en la base de datos
        try{
            let estructura  =await Publicacion.find(datos.search).populate('creator',"name");

            this.message = {
                data: estructura,
                content:'Publicación encontrada',
                type:'success'
            }
            return this.message;
        }catch(err){
            return errorescatch(err);
        }
    }

    async update(data={search:this.search,value:this.value,specify:this.specify}){
        try{
            console.log(data);
            if(!data.search) throw new Error("Se necesitan los parametros de busqueda");
            this.publicacion =await Publicacion.findOne(data.search);
            if(!this.publicacion) throw new Error("ha ocurrido un error");
            if(this.publicacion <=0) throw new Error("Publicacion no encontrada");
            if(data.specify && data.specify != ''){
                let response = this.publicacion[data.specify];
                this.publicacion[data.specify]= Array.isArray(response) ?  [...response,data.value] : data.value ;
                this.publicacion =await this.publicacion.save();
            }


            this.message = {
                data:this.publicacion,
                content:'Publicación encontrada',
                type:'success'
            }
            return this.message;
        }catch(err){
            return errorescatch(err);
        }
    }

    async delete(data = { search: this.search, specify: this.specify, value: this.value }) {
        try {
            let response = null;
            if(!data.search) throw new Error("Publicación no encontrada");
            if(data.specify && data.specify.length > 0){   
               this.publicacion = await Publicacion.find(data.search);
               response = await this.publicacion[0][data.specify].filter(element => element._id != data.value._id );
               this.publicacion[0][data.specify] = response;
               response = await this.publicacion[0].save();
               this.publicacion = (await this.read({search:await response}))[0];
            }else{
                this.publicacion = await Publicacion.findOneAndDelete(data.search);
            }
            return {...this.message,data:this.publicacion,content:"Se ha eliminado correctamente",type:"success"};
        }catch (err) {
            return errorescatch(err);
        }
    }
    
}

module.exports = Post;