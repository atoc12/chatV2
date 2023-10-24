import { appVar } from '../../config/var';
import {errors}  from './error/error.json';
import {errorMessage}  from './error/messageError';

export class Coleccion {
    constructor({search=null,value=null,specify=null,session=null,response=null},token=null){
        this.search=search;
        this.value=value;
        this.response=false;
        this.option="get";
        this.body={
            SEARCH:search,
            VALUE:value,
            SPECIFY:specify ? specify : [],
            SESSION:session,
            RESPONSE:response
        }
        this.fetchData={
            url:appVar.ip+"/",
            path:null,
            method:"POST",
            Authorization:token,
            key:null,
            body:this.body
        }
    }
    read(data={search:this.search}){
        this.fetchData.method= data.search ? "POST": 'GET';
        this.option= data.search ? "search" : 'get';
        return this;
    }
    create(){
        this.fetchData.method="POST";
        this.option="create";
        return this;
    }
    delete(){
        this.fetchData.method='delete';
        this.option="delete";
        return this
    }
    update(){
        this.fetchData.method='PUT';
        this.option="update";
        return this;
    }
    insert(data={search:this.search,value:this.value,specify:this.body.SPECIFY,session:this.body.SESSION}){
        console.log(data);
        this.fetchData.method="PUT";
        this.option="update";
        this.body.SPECIFY=data.specify;
        this.body.SEARCH=data.search;
        this.body.VALUE = data.value;
        this.body.SESSION = data.session;
        return this;
    }
    async apply(){
        try{
            if(!this.fetchData.Authorization) throw new Error('token is necesary');
            if(!this.fetchData.path) throw errorMessage(1);
            let url = this.fetchData.url+this.fetchData.path+"/"+this.option;
            if(this.fetchData.method === 'GET'){
                this.response = await fetch(url);
            }else{
                this.response = await fetch(url,{
                    method:this.fetchData.method,
                    headers:{
                        Authorization:`${this.fetchData.Authorization}`,
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify(this.fetchData.body)
                });
            }
            return await this.response.json();
        }catch(err){
            return err;
        }
    }
}