const Chat = require("../../DataBase/schemas/chat/chat");
const User = require("../../DataBase/schemas/usuario/usuario");
const errorescatch = require("../error/error");
class Chats {
    constructor(data={search:null,value:null,specify:null,where:{value:null,regex:'i'}}){
        this.search = data.search;
        this.value = data.value;
        this.specify = data.specify;
        this.Chat = null;
        this.where = data.where && data.where.value ? data.where : null;
        this.specify = data.specify ? typeof data.specify===Array ? data.specify.join(" ",",") : data.specify : '' ; 
        this.message={
            data:null,
            content:null,
            type:'error'
        }
    }
    async create(data={value:this.value}){
        try{
            if(!data.value) throw new Error("Es necesario ingresar valores");
            if(!data.value.participants || data.value.participants.length <=0) throw new Error("Es necesario ingresar participantes");
            if(data.value.participants.length <= 1) throw new Error("Es necesario almenos dos participantes");
            this.Chat = new Chat(data.value);
            if(!this.Chat) throw new Error("Ha ocurrido un error,revisar si los datos son validos");
            this.Chat =await this.Chat.save();

            this.message = {
                data:this.Chat,
                content:'Chat creado',
                type:'success'
            }
            return this.message;
        }catch(err){return errorescatch(err)}
    }


    async read(datos={search:this.search,specify:this.specify,where:this.where,value:this.value,response:null}){ // Este metodo se encarga de buscar Datos especificos en la base de datos
        try{
            if(datos.where && datos.where.value){
                this.Chat = await Chat.find({}).where(where.value).regex(new RegExp(this.search,datos.where.regex));
            }else{
                this.Chat = await Chat.findOne(datos.search);
            }
            if(!this.Chat) throw new Error('Error al consultar a la base de datos');
            if(this.Chat.length === 0 ) throw new Error("Chat no encontrada");
            let estructura = null;
            if(datos.specify){
                let filter = this.Chat[datos.specify];
                let id = filter.map(participants=>datos.value == '_id' ? participants[datos.value].toString() : participants[datos.value]);
                let creador = await User.find({_id:{$in:id}}).select("_id name email");
                estructura = creador;
                if(datos.specify != 'participants'){
                    estructura = Promise.all(filter.flatMap(async (data)=>{
                        let ind = creador.filter(user =>user._id.toString() === data.sender.toString())[0];
                        if(ind){
                            const {__v,...rest } = data._doc,{_id,...rest2 } = ind._doc;
                            const resultado1 = { ...rest },resultado2 = { ...rest2 };
                            return {...resultado1,...resultado2};
                        }else{
                            return 'error';
                        }
                    }))
                }
            }
            this.message = {
                data:await estructura ? await estructura : this.Chat,
                content:'Chat encontrado',
                type:'success'
            }
            return this.message;
        }catch(err){
            return errorescatch(err);
        }
    }

    async update(data={search:this.search,value:this.value,specify:this.specify}){
        try{
            if(!data.search) throw new Error("Se necesitan los parametros de busqueda");
            this.Chat =await Chat.findOne(data.search);
            if(!this.Chat) throw new Error("ha ocurrido un error");
            if(this.Chat <=0) throw new Error("Chat no encontrada");
            if(!data.value) throw new Error("Se necesitan valores");
            if(data.specify && data.specify != ''){
                let response = this.Chat[data.specify];
                this.Chat[data.specify]= Array.isArray(response) ?  [...response,data.value] : data.value ;
                this.Chat =await this.Chat.save();
            }


            this.message = {
                data:this.Chat,
                content:'Chat encontrada',
                type:'success'
            }
            return this.message;
        }catch(err){
            return errorescatch(err);
        }
    }

    async delete(data = { search: this.search, specify: this.specify, value: this.value }) {
        try {

            return this.message;
        }catch (err) {
            return errorescatch(err);
        }
    }
    
}


module.exports = Chats;