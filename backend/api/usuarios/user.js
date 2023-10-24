const User = require("../../DataBase/schemas/usuario/usuario");
const idGenerator = require("../../src/function/session");
const errorescatch = require("../error/error");

class Usuario {
    constructor(data={search:null,value:null,specify:null,where:{value:null,regex:'i'},session:false}){
        this.search = data.search;
        this.value = data.value;
        this.specify = data.specify;
        this.user = null;
        this.session=data.session;
        this.where = data.where && data.where.value ? data.where : null;
        this.specify = data.specify ? typeof data.specify===Array ? data.specify.join(" ",",") : data.specify : '' ; 
        this.message={
            data:null,
            content:null,
            type:'error'
        }
    }
    async create(session=null){
        try{
            await this.read(this.value);//Se realiza una peticion a la base de datos y si encuentra coincidencias se almacena en la propiedad user
            // -------------------------------Primara   Validaciones-------------------------------------------------
            if(!this.user) throw new Error("Ya existe un usuario con esas credenciales");//valida si existen usuarios con esas credenciales
            if(!this.value ||!this.value.password || !this.value.name || !this.value.email) throw new Error("Es necesario rellenar todos los campos");//valida si se han ingresado todos los campos
            if(this.value.password <= 8 ) throw new Error("La contraseña debe de tener más de 8 cáracteres"); //vallida si la contraseña tiene más de 8 caracteres
            //-----------------------------------Crear el usuario----------------------------------------------
            this.user = new User(this.value);//crea el usuario
            this.user.picture = `pic-${this.user._id.toString()}`;//se indica donde se encuentra la foto de perfil del usuario
            if(session){ this.user.conexion=true; this.user.session=idGenerator();} // valida si se crea una nueva session
            let response = await this.user.save();
            //-----------------------------Segunda etapa de validaciones---------------------------------
            if(!response) throw new Error('Ha ocurrido un error al crear el usuario');
            //----------------------------------Retornos-------------------------------------------------
            this.message={//reasigna valores a las propiedades de la estructura de mensaje
                data:this.user,
                content:'Se ha creado el usuario correctamente',
                type:'success'
            }
            return this.message;//retorna el mensaje
        }catch(err){//------------------------------------------------------Errores
                return errorescatch(err);
        }
            
    }


    async read(data={search:this.search,where:this.where,specify:this.specify,session:this.session}){ // Este metodo se encarga de buscar Datos especificos en la base de datos
        try{
            if(data.search){
                this.user = await User.find(data.search,{password:0,socket_id:0,session:0});
                if(data.session){
                    this.user[0].session=idGenerator();
                    this.user = await this.user[0].save();
                }
            }else if(data.specify){
                
            }
            // if(data.where && data.where.value){
            //     this.user = await User.find({}).where(data.where.value).regex(new RegExp(data.search,data.where.regex));
            // }else if(data.specify && data.specify != ''){
            //     this.user = await User.findOne(data.search).select(data.specify).populate(data.specify);
            //     console.log(this.user);
            //     this.user = this.user[data.specify];
            // }else{
            //     this.user = await User.find(data.search);
            // }
            // if(!this.user) throw new Error('Error al consultar a la base de datos');
            // if(this.user.length === 0 ) throw new Error("Usuario no encontrado");
            // if(data.session){
                // this.user[0].session=idGenerator();
            //     this.user = await this.user[0].save();
            // }
            // if( Array.isArray(this.user)){
            //     this.user = this.user.map(datos=>{
            //         const {password,socket_id,picture,permissions,conexion,contactos,solicitud,mis_publicaciones,...rest} = datos._doc;
            //         return rest;
            //     })

            // }
            // .populate('post');
            // console.log(a);

            this.message = {
                data:this.user,
                content:'Usuario encontrado',
                type:'success'
            }
            return this.message;
        }catch(err){
            console.log(err);
            return errorescatch(err);
        }
    }

    async update(data={search:this.search,value:this.value,specify:this.specify}){
        try{
            const options = { new: true }; // Para que devuelva el documento actualizado



            this.user = await User.findOneAndUpdate(data.search, data.value, options);
            if (!this.user) throw new Error("Usuario no encontrado");
            if(data.specify && data.specify != ''){
                let response = this.user[data.specify];
                this.user[data.specify]= Array.isArray(response) ?  [...response,data.value] : data.value ;
                this.user =await this.user.save();
            }



            this.message = {
                data: this.user,
                content: 'Se ha actualizado con éxito',
                type: "success"
            };
            return this.message;
        }catch(err){
            console.log(err);
            return errorescatch(err);
        }
    }
    
    async delete(data = { search: this.search, specify: this.specify, value: this.value }) {
        try {
            if (!data.specify || data.specify === '' || data.specify.length == 0){
                this.user = await User.findOneAndDelete(data.search);
                if (!this.user) throw new Error('Usuario no encontrado');
            }else{
                if(!data.value)throw new Error('parametro value está vacio');
                this.user = await User.find(data.search).select(data.specify);
                if(!this.user || this.user.length == 0) throw new Error('Usuario no encontrado');
                const arrayToSearch =await  this.user[0][data.specify]; // Accede al array dentro del primer documento encontrado
                const filteredArray = arrayToSearch.filter(element => element._id.toString() !== data.value);
                if(arrayToSearch.length === filteredArray.length) throw new Error('No se ha encontrado el elemento ha eliminar');
                this.user[0][data.specify] = filteredArray;
                this.user[0].save();
            }

            this.message = {
                data: this.user,
                content: 'Elemento eliminado correctamente',
                type: 'success'
            };
    
            return this.message;
        }catch (err) {
            return errorescatch(err);
        }
    }
    
}

module.exports = Usuario;