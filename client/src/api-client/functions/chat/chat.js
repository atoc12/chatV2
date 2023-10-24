import {Coleccion}  from "../general";
import {errors} from'../error/error.json';


export class Chat extends Coleccion {
    constructor({search,value,specify,session},token=null){
        super({search,value,specify,session},token);
        this.fetchData.path='chat';
    }
}