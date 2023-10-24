import { AiOutlineUserAdd } from 'react-icons/ai';
import './contactos.css';
import { BsTrash,BsCheck} from 'react-icons/bs';
import { useUser } from '../../../config/context/user/userContext';
import { SlOptionsVertical } from 'react-icons/sl';
import { useEffect, useState } from 'react';
import { AddUser } from '../components/addUser/addUser';
import { HandeDelete } from '../../../config/functions/usuarios/contactos/borrar';
import { handleOpcion } from '../../../config/functions/usuarios/contactos/confirmar';
import { Icon } from '../components/icon-user/icon-user';
import { useSolicitud } from '../../../config/context/solicitud/solicitudContext';
import { useContactos } from '../../../config/context/contactos/contactos';
import { RiContactsLine } from 'react-icons/ri';
import texto from '../../../config/interfaz/texto/contact.json';
import OtherText from '../../../config/interfaz/texto/other.json';
import { Load } from '../components/load/load';
export const Contactos = ({chat,setChat})=>{
    const {user,setUser} = useUser();
    const {solicitud,setSolicitud} = useSolicitud()
    const {contactos,setContactos} = useContactos();
    const [selectDiv,setSelectDiv] = useState(0);
    const [mostrar,setMostrar] = useState(false);
    const [add,setAdd] = useState(false);
    return(
        <div id='contactos' style={mostrar ? {transform:'translateX(100%)',position:"fixed"} : {}}>
            <section>
                <button aria-label={"abrir o cerrar menu de contactos"} className='btn-contact-menu btn' onClick={()=>setMostrar(!mostrar)}><RiContactsLine
                /></button>
                <section id='op-contact'>
                    <button  className='btn' aria-label={texto.buttons.add} onClick={()=>setAdd(!add)}><AiOutlineUserAdd/>{texto.buttons.add}</button>
                </section>
                <AddUser setOpen={setAdd} open={add}></AddUser>
            </section>
            <section>
                <button aria-label={texto.buttons.contact} className={`btn selected-btn ${selectDiv == 0 ? 'select-primary' : ''}`} onClick={()=>setSelectDiv(0)}>{texto.buttons.contact}</button>
                <button aria-label={texto.buttons.requests}className={`btn selected-btn ${selectDiv == 1 ? 'select-primary' : ''}`} onClick={()=>setSelectDiv(1)}>{texto.buttons.requests}</button>
            </section>
            <section>
                <div id='contactos-div'>
                    <ul>
                        {
                            selectDiv == 0 ? <ContactosDiv chat={chat} contactos={contactos} setChat={setChat} user={user}></ContactosDiv> : <SolicitudDiv solicitud={solicitud}></SolicitudDiv>
                        }
                    </ul>
                </div>
            </section>
        </div>
    )
}

const ContactosDiv = ({contactos,user,chat,setChat})=>{
    const [load,setLoad] = useState(true);
    useEffect(()=>{
        if(contactos){
            setLoad(false);
        }else{
            setLoad(true);
        }
    },[contactos])
    return(
        load ?
            <Load/>
        :
            contactos && contactos.length > 0 ? contactos.map((data,key)=>{
                return(
                    <li key={key}>
                        <ListContact data={data} chat={chat} setChat={setChat}></ListContact>
                    </li>
                )
            }):
            user && user.contactos && user.contactos.length >0 ? null : <></>
    )
}
const SolicitudDiv = ({solicitud})=>{
    const [load,setLoad] = useState(true);
    useEffect(()=>{
        if(contactos){
            setLoad(false);
        }else{
            setLoad(true);
        }
    },[contactos])
    return(
        load ? 
            <Load/>
        :
        solicitud && solicitud.length > 0 ?
        solicitud.map((data,key)=>{
            return(
                <li key={key}>
                    <ListUserSolicitud id={data._id} datos={data}></ListUserSolicitud>
                </li>
            )
        })
        :<> {texto.messages.requests}</>  
    )
}
const ListContact = ({data,chat,setChat})=>{
    const {user,setUser} = useUser();
    return(
        <div className='list-contact'>
            <section onClick={()=>setChat(chat.chat_id === data.chat_id ? {chat_id:null,name:null,contacto:null} : {chat_id:data.chat_id,name:data.name,contacto:data})}>
                <section>
                    <Icon data={data}>{ data.conexion ? <div className='conex-cont'></div> : <></>}</Icon>
                    
                </section>
                <div>
                    <p>
                        {data.name}
                    </p>
                </div>
                
            </section>
            <section>
                <div>
                    <span><SlOptionsVertical/></span>
                    <ul>
                        <li>
                            <button onClick={()=>HandeDelete(data,user)}><BsTrash/></button>
                        </li>
                    </ul>
                </div>
                
            </section>
        </div>
    )
}



const ListUserSolicitud = ({datos})=>{
    const {user,setUser} = useUser()
    
    return(
        <div className='listuser'>
            <section>
                {datos.name}
            </section>
            <section>
                <button aria-label={texto.buttons.delete} className='btn' onClick={(e)=>handleOpcion(datos,false,user)}><BsTrash/></button>
                <button aria-label={texto.buttons.accept}className='btn' onClick={(e)=>handleOpcion(datos,true,user)}><BsCheck/></button>
            </section>
        </div>
    )
}
