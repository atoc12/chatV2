import { useNavigate, useParams } from 'react-router-dom';
import './chat.css';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { AiOutlineSend } from 'react-icons/ai';
import { Load } from '../../components/load/load';
import {Chat} from '../../../api-client/functions/chat/chat.js'
import { useEffect, useRef, useState } from 'react';
import { useUser } from '../../../config/context/user/userContext';
import { socket } from '../..';
import { MessagesChat } from './messages/messages';
export const ChatBody = ( ) => { 
    const {id} = useParams();
    const {user} = useUser();
    const [load,setLoad] = useState(true);
    const [loadMjs,setLoadMsj] = useState(true);
    const [info,setInfo] = useState(null);
    const [messages,setMessages] = useState(null);
    const [content,setContent] = useState(null);
    const history = useNavigate();
    const contentRef = useRef()

    const handlerSubmit = (e)=> {

        e.preventDefault();

        if(content){
            socket.emit("new-message",{message:content,user:user,chat_id:id});

        }

        e.target["msj-input"].value='';
        setContent(null);

    }


    useEffect(()=>{
        socket.on("recive-messages"+id,(data)=>{
            setMessages(data);
            setLoadMsj(false);
        })
        socket.on("recive-chat-info",(data)=>{
            setInfo(data);
            setLoad(false);
        })
    },[]);
    
    useEffect(()=>{
        socket.emit("get-chat",{user:user,chat_id:id})
        socket.emit("joined-chat",id);
    },[id]);

    useEffect(()=>{
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
    },[messages]);

    return (

        <div className="Chat" ref={contentRef}>
            {
                load && !info ? 
                    <Load/> 
                :
                <>
                    <section className='Chat-top-info'>

                        <button className='btn btn-and-tooltip Chat-op' onClick={()=>history(-1)}>

                            <MdOutlineArrowBackIosNew/>

                            <span>
                                atras
                            </span>
                        </button>

                        <h1 className='name-chat'>{ info.participants.filter(integrant => integrant._id != user._id)[0].name }</h1>


                    </section>


                    <section className='Chat-mid-content'>

                        {
                           loadMjs ? 
                            <Load/> 
                           : 
                           messages.map((element,key)=> <MessagesChat key={key} message={element} />)
                        }

                    </section>

                    <section className='Chat-bottom'>

                        <form method="post" onSubmit={handlerSubmit} className='form-chat-area'>

                            <textarea name="msj-input" id="msj-input" onChange={(e)=>setContent(e.target.value)}/>

                            <button type="submit" className='btn'>
                                <AiOutlineSend/>
                            </button>

                        </form>

                    </section>
            
                </>
            }


        </div>

    )

}