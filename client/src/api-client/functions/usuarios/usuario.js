import {Coleccion}  from "../general";
import {errors} from'../error/error.json';


export class User extends Coleccion {
    constructor({search,value,specify,session},token=null){
        super({search,value,specify,session},token);
        this.fetchData.path='user';
    }
    publicaciones(data={value:this.value}){
        this.body.SPECIFY='publicaciones';
        this.body.VALUE = data.value;
        return this;
    }
    contactos(data={value:this.value}){
        this.body.SPECIFY='contactos';
        this.body.VALUE = data.value;
        return this;
    }
    solicitud(data={value:this.value}){
        this.body.SPECIFY='solicitud';
        this.body.VALUE = data.value;
        return this;
    }
    notificaciones(data={value:this.value}){
        this.body.SPECIFY='notificaciones';
        this.body.VALUE = data.value;
        return this;
    }
    
}