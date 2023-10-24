import { NavLink } from "react-router-dom"
import { InputSession } from "../inputs/inputs"
import { useState } from "react";
import texto from '../../../config/interfaz/texto/session.json';
export const Login =()=>{
    const [correo,setCorreo]= useState(null);
    const [pass,setPass] =useState(null);
    return(
        <>
            <h1 className="t-g-1">{texto.signIn.tittle}</h1>
            <section>
                <InputSession
                    autoComplete="enable" 
                    nombre={"correo"} 
                    onChange={(e)=>setCorreo(e.target.value)} 
                    type='email'
                    status={ correo ? correo !="" && correo !==" " && correo.includes('@') ? true : false : null}
                >
                        {texto.signIn.inputs.email}
                </InputSession>
                <InputSession 
                    nombre={"pass"} 
                    type='password'
                    onChange={(e)=>setPass(e.target.value)}
                    status={pass ? pass !='' && pass !=' ' && pass.length >= 8 ?true:false :null}
                >
                        {texto.signIn.inputs.password}
                </InputSession>
            </section>
            <section>
                <section>
                    <button className='btn' type='submit'>{texto.signIn.inputs.send}</button>
                </section>
                <section>
                    <NavLink to={"/register"}>no tengo una cuenta</NavLink>
                </section>
            </section>
            
        </>
    )
}