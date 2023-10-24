import {errors}  from './error.json';
export const errorMessage =(n)=>{
    return new Error(errors[n].info+" Error value:"+errors[n].value);
}
