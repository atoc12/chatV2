import {Coleccion}  from "../general";

export class Publicaciones extends Coleccion{
    constructor({search,value,specify,response},token=null){
        super({search,value,specify,response},token);
        this.fetchData.path='post';
    }
    comments(){
        this.body.SPECIFY.push('comentarios');
        return this;
    }
}