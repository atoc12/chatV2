import { Link, Outlet } from "react-router-dom"
import { Menu } from "./components/menu/menu.jsx"
import './index.css';
import { appVar } from "../config/var.js";
import { Socket,io } from "socket.io-client";
import { AsideContacts } from "./components/aside-contacts/aside-contacts.jsx";
import { useUser } from "../config/context/user/userContext.jsx";
import { useEffect } from "react";
import { useNotification } from "../config/context/notification/notificacionContext.jsx";
import { useSolicitud } from "../config/context/solicitud/solicitudContext.jsx";
import { useContactos } from "../config/context/contactos/contactos.jsx";

import { useChat } from "../config/context/chat/chat.jsx";
import { Chat } from "../api-client/functions/chat/chat.js";

export const socket = io(appVar.ip);
export const Index = ()=>{
    const {user} = useUser();
    const {noti,setNoti} = useNotification();
    const {solicitud,setSolicitud} = useSolicitud();
    const {contactos,setContactos} = useContactos();
    const {chat,setChat} =useChat();
    useEffect(()=>{
        socket.on("recive-alert",(alert=>{
            console.log(alert);
            setNoti(alert);
        }))
        socket.on("recive-chats",(data)=>{
            new Chat({search:{_id:{$in:data}}},"2").read().apply().then(datos=>{setChat(datos.data)})
            
        })
        socket.on("recive-solicitud",(soli=>{
            console.log(soli);
            setSolicitud(soli);

        }))
        socket.on("recive-contact",(contact=>{
            setContactos(contact);
        }))
        socket.on("test",(contact=>{
            console.log("actualizar");
        }))
        socket.on("mensaje-test",(msj=>{
            console.log(msj);
        }))
        
        socket.emit("conexion",user ? user : null);
    },[])
    
    return(
        <div id="container-index" className="container">
            <main>
                <div>
                    <Outlet/>
                </div>
                <AsideContacts/>
            </main>
            {
                user ?
                    <Menu></Menu>
                :<Link className="session-need" to={"/login"}>Iniciar sessión</Link>
            }
        </div>
    )
}