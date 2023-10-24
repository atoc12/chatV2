import { useUser } from '../../../../config/context/user/userContext';
import { Icon } from '../../../components/profile-icon/icon';
import './messages.css';

export const  MessagesChat = ({message})=>{
    const {user} =useUser();
    return(
        <div className={`msj-card ${user._id === message.sender ? 'me' : 'sender' } `}>
            <section className="msj-card-content" >
                <section>
                    <p>
                        {message.content}
                    </p>
                </section>
            </section>
        </div>
    )
}