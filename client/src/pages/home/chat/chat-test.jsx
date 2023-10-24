import { useEffect, useRef, useState } from 'react';
import './chat-test.css';
import { Mensaje } from './mensajes/mensaje';
import {MdOutlineArrowBackIosNew} from 'react-icons/md';
import { useUser } from '../../../config/context/user/userContext';
import { socket } from '../home';
import { useNavigate } from 'react-router-dom';
import { useTittle } from '../../../config/context/tittle/tittlecontext';


export const ChatTest =({chat,setChat})=>{
    const {tittle,setTittle} = useTittle()
    const {user,setUser} = useUser();
    const [msj,setMsj] = useState(null);
    const history = useNavigate();
    const [infoChat,setInfoChat] = useState(null);
    const [mensajes,setMensajes] = useState([]);
    const divRef = useRef(null);

    const handleSubmit =(e)=>{
        e.preventDefault();
        if(!msj) return;
        if(msj == '' || msj == ' ')return;
        socket.emit("send-message",{
            sender:user._id,
            content:msj,
            name:user.name,
            timestamp:new Date()
        })
        e.target["msj"].value='';
        setMsj(null);
    }
    useEffect(()=>{
        if(user){
            socket.on("recive-chat-info",async (data)=>{
                setMensajes(data);
            });
            socket.on("recive-message",(m)=>{
                console.log(m);
                setMensajes(messages => [...messages,m]);
            });
        }else{
            return history("/home/")
        }
        
    },[]);
    useEffect(()=>{
        divRef.current.scrollTop = divRef.current.scrollHeight;
    },[mensajes]);
    
    useEffect(()=>{
        socket.emit("send-chat",chat);
    },[chat]);





    return(
        <div id='chat'>
                <div id='chat-data'>
                    <section>
                        <button className='btn' onClick={()=>setChat({chat_id:null,name:null,contacto:null})}><MdOutlineArrowBackIosNew></MdOutlineArrowBackIosNew></button>
                    </section>
                    <section>
                        <h1>
                            {chat.name}
                        </h1>
                    </section>
                </div>
                <div id="chat-body">
                    <section className='chat-main' ref={divRef}>
                        {
                            mensajes ? 
                            mensajes.map((data,key)=>{
                                return(
                                    <Mensaje key={key} data={data} content={data.content}contacto={data.sender == user._id ? user : chat.contacto } sender={data.sender == user._id}></Mensaje>
                                )
                            }) :<></>
                        }
                        
                        <section className='chat-form'>
                            <form onSubmit={(e)=>handleSubmit(e)}>
                                <input type="text" name="msj" id="" onChange={(e)=>setMsj(e.target.value)} />
                                <button type="submit" onSubmit={(e)=>handleSubmit(e)}>Enviar</button>
                            </form>
                        </section>
                    </section>
                </div>
            </div>
    )   
}