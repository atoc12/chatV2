import './session.css';
import { EatApi } from '../../config/fetch/fetch';
import { useEffect, useState } from 'react';
import { useUser } from '../../config/context/user/userContext';
import { Login } from './login/login';
import {User} from '../../api-client/functions/usuarios/usuario';
import { useContactos } from '../../config/context/contactos/contactos';
import { useNotification } from '../../config/context/notification/notificacionContext';
import { LoadFullScreen } from '../components/LoadFullScreen/loadFullScreen';
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
            console.log(resultado);
            if(resultado.data){
                const {session,notificaciones,...rest} = resultado.data[0];
                console.log(notificaciones);
                setNoti(notificaciones);
                localStorage.setItem("USER",JSON.stringify(rest));
                localStorage.setItem("TOKEN",session);
                setUser(JSON.parse(localStorage.getItem("USER")));
            }else{
                setMessage(resultado.message)
            }

        }catch(err){
            setMessage(err.message)
        }
    }
    useEffect(()=>{

    },[])
    return(
        <div id="session">
            <main>
                <LoadFullScreen/>
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