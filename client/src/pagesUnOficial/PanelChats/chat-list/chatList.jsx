import { useState } from 'react';
import { useUser } from '../../../config/context/user/userContext';
import { Icon } from '../../components/profile-icon/icon';
import './chatList.css';
import { Link, useNavigate } from 'react-router-dom';

export const ChatList = ({chats})=>{
    const {user} = useUser();

    const history = useNavigate();

    const tittle = chats.participants.filter(integrant => integrant._id != user._id)[0];
    
    return (
        <div className='chat-list' tabIndex={1} onClick={()=>history(chats._id)}>
                    
                <section className='chat-info'>
                    <span className='chat-icon'><Icon data={ tittle }></Icon></span>
                    <h1>{tittle.name}</h1>
                </section>

                <section className='chat-more-info'>
                    <ul>
                        <li>
                            <span>Chat</span>:{chats.typeChat}
                        </li>
                    </ul>
                </section>

                <section className='chat-list-user'>
                    <section>
                        <h1>integrantes</h1>
                        <span>{chats.participants.length}</span>
                    </section>
                    <section>

                        {
                            chats.participants.map((a,key)=>{
                                if(key < 4){
                                    return <Icon key={key} data={a}></Icon> 
                                }
                            })
                        }

                        {
                            chats.participants.length > 4 && <section className='icon'>
                                <span>
                                    {chats.participants.length-4}+
                                </span>
                            </section>                           
                        }
                        
                    </section>
                </section>


            </div>
    )
}