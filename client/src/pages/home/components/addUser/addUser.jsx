import { useEffect, useState } from 'react';
import './AddUser.css';
import { useUser } from '../../../../config/context/user/userContext';
import { socket } from '../../home';
export const AddUser =({open,setOpen})=>{
    const {user,setUser} = useUser();
    const [name,setName] = useState(null);
    const handleSubmit = (e)=>{
        e.preventDefault();
        e.target["nombre"].value="";
        socket.emit("enviar-solicitud",{
            _id:user._id,
            name:user.name,
            contact_name:name
        })
    }
    return(
        <section id='adduser' style={{display:open ? 'block' : 'none'}}>
            <div>
                <h1>Añadir contacto</h1>
                <form onSubmit={(e)=>handleSubmit(e)}>
                    <input type="text" name="nombre" placeholder='Nombre' className='btn' onChange={(e)=>setName(e.target.value)}/>
                    <input type="submit" value="Enviar" className='btn' />
                </form>
            </div>
            <div onClick={()=>setOpen(false)}></div>
        </section>
    )
} 