import './session.css';
import { EatApi } from '../../config/fetch/fetch';
import { useEffect, useState } from 'react';
import { useUser } from '../../config/context/user/userContext';
import { Login } from './login/login';
import {User} from '../../api-client/functions/usuarios/usuario';
import { useContactos } from '../../config/context/contactos/contactos';
import { useNotification } from '../../config/context/notification/notificacionContext';
export const Session = ()=>{
    const [message ,setMessage] = useState(null);
    const {user,setUser} = useUser()
    const {setNoti} = useNotification();
    const handleSubmit =async (e)=>{
        e.preventDefault();
        try{
            let datos = {
                email:e.target['correo'].value,
                password:e.target['pass'].value
            }
            let resultado = await new User({search:datos,session:true},"1").read().apply() ;
            setMessage(resultado.message);
            if(resultado.data){
                const {session,notificaciones,...rest} = resultado.data;
                console.log(notificaciones);
                setNoti(notificaciones);
                localStorage.setItem("USER",JSON.stringify(rest));
                localStorage.setItem("TOKEN",JSON.stringify(session));
                setUser(JSON.parse(localStorage.getItem("USER")));
            }
        }catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{

    },[])
    return(
        <div id="session">
            <main>
                <div>
                    <form onSubmit={(e)=>handleSubmit(e)} className='session-form'>
                        <Login/>
                        <span id='session-message'>{ message ? message : <></>}</span>
                    </form>
                </div>
            </main>
        </div>
    )
}