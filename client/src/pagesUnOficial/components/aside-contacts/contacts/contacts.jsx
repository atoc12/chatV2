import { Icon } from "../../profile-icon/icon";
import {useNavigate} from 'react-router-dom'
import "./contacts.css";
import { SlOptionsVertical } from 'react-icons/sl';
import { useEffect } from "react";
import { socket } from "../../..";
import { useUser } from "../../../../config/context/user/userContext";

export const Contact = ({data})=>{
    const {user} = useUser();
    const history = useNavigate();
    const handleDelete = ()=>{
        socket.emit("remove-contact",{user:user,value:data})
    }
    return(
        <div className="contact-card">
            <Icon data={data} />
            <span>
                {data.name}
            </span>
            <span className="contact-options">
                <SlOptionsVertical/>

                <ul>
                    <li>
                        <button onClick={handleDelete}>
                            Eliminar
                        </button>
                    </li>
                </ul>

            </span>
            <div className="redirect-contact" onClick={()=>history("/chat")}>

            </div>
        </div>
    )
}