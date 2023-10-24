import { socket } from "../../..";
import { useUser } from "../../../../config/context/user/userContext";
import { Icon } from "../../profile-icon/icon";
import "./request.css";
import { SlCheck, SlClose, SlOptionsVertical } from 'react-icons/sl';

export const Request = ({data})=>{
    const {user} = useUser();

    const handleAccept = ()=>{

        socket.emit("add-contact",{user:user,value:data._id});
    }

    const handleDecline = ()=>{

    }

    return(
        <div className="request-card">
            <section className="request-info">
                <Icon data={data} />
                <span>
                    {data.name}
                </span>
            </section>
            <section className="request-options">
                <button onClick={handleAccept} className="btn btn-accept"><SlCheck/></button>
                <button onClick={handleDecline} className="btn btn-decline"><SlClose/></button>
            </section>
        </div>
    )
}