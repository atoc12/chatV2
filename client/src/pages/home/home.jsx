import { useEffect, useRef, useState } from 'react';
// import './home.css';
// import { Menu } from './components/menu/menu';
import { Outlet } from 'react-router-dom';
import { Contactos } from './contactos/contactos';
import { useUser } from '../../config/context/user/userContext';
import {io} from 'socket.io-client';
import { Menuv2 } from './components/menuv2/menuv2';
import { ChatTest } from './chat/chat-test';
import { appVar } from '../../config/var';
import { useTittle } from '../../config/context/tittle/tittlecontext';
import {SelectPubliContext, useSelectPubli } from '../context/seleccionarPublicacion/selectPublicacion';
import { Send } from './components/send/send';
import { SendContext } from '../../config/context/send/sendContext';
import { AlertDiv} from './components/msj/message';

export const socket = io(appVar.ip);
export const Home = ()=>{
    const [publiselect,setPubliSelect] = useState(null);
    const {tittle,setTittle} = useTittle()
    const {user,setUser} = useUser();
    const [center,setCenter] = useState(null);
    const [chat,setChat] = useState({name:null,chat_id:null,contacto:null});
    const [send,setSend] = useState(null);
    const homeRef = useRef();
    const contentRef = useRef();
    useEffect(()=>{
        if(user){
            
        }
        contentRef.current.scrollIntoView({});
    },[]);
    useEffect(()=>{
        if(center){
            contentRef.current.scrollIntoView({ behavior: 'smooth' });
            setCenter(null);
            setChat({chat_id:null,name:null,contacto:null})
        }
    },[center])

    useEffect(()=>{
            contentRef.current.scrollIntoView({ behavior: 'smooth' });
            if(chat.chat_id){
                setTittle(`chat/${chat.name}`)
            }
            setCenter(null);
    },[chat]);


    return(
        <SelectPubliContext.Provider value={{publiselect,setPubliSelect}}>
            <SendContext.Provider value={{send,setSend}} >
                {
                    user && alert.length > 0? <AlertDiv/>: null
                }   
                <div id='home'>
                    <Menuv2 center={center} setCenter={setCenter}/>
                    <div id='home-content' ref={contentRef}>
                        {
                            user && chat.chat_id ? <ChatTest chat={chat} setChat={setChat}/> : <Outlet/>
                        }
                        {
                            user && send ? <Send/> : null 
                        }
                    </div>
                    {
                        user ? <div id='home-contacts'>
                            <Contactos chat={chat} setChat={setChat}/>
                        </div> :<></>
                    }
                    
                </div>
            </SendContext.Provider>
        </SelectPubliContext.Provider>
    )
}