import { useEffect } from 'react';
import { useUser } from '../../../../config/context/user/userContext';
import { Icon } from '../../profile-icon/icon';
import './response.css';
export const Response = ({data})=>{
    const {user} = useUser();
    return(
        <div className="post-response">
            <div className='post-response-info'>
                <section>
                    <Icon data={{_id:data.creator._id.toString()}} />
                </section>
                <section>
                    <a href="">{data.creator.name}</a>
                </section>
            </div>
            <div className='post-response-content'>
                <p>
                    {data.content}
                </p>
            </div>
            <div>

            </div>
        </div>
    )
}