import { BiMessageAltAdd } from 'react-icons/bi';
import './PanelChat.css';
import { ChatList } from './chat-list/chatList';
import { useEffect, useState } from 'react';

import { useChat } from '../../config/context/chat/chat';
export const PanelChat =()=>{
    const {chat,setChat} = useChat();
    const [filter,setFilter] = useState('');

    return(
        <div id='Panel-chat'>

            <div id='Panel-chat-options'>
                <input type="search" className='form-search' placeholder='Buscar' onChange={(e)=>setFilter(e.target.value)} />    
                <button className='btn btn-and-tooltip'>
                    <BiMessageAltAdd/>
                    <span>
                        Nuevo Chat
                    </span>
                </button>
            </div>

            <div id='Panel-chats-container'>

            {
                chat.map((info,key)=>info.status? <ChatList key={key} chats={info} ></ChatList> : null)
            }               

            </div>
        </div>
    )
}