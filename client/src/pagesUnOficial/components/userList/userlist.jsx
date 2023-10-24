import { Link } from 'react-router-dom';
import './userlist.css';
import { Icon } from '../profile-icon/icon';
export const ListUser = ({data})=>{
    return(
        <div className='list-user'>
            <Link to={"/"+data.name}>
                <section>
                    <div>
                        <Icon data={data}/>
                    </div>
                </section>
                <section>
                    {data.name}
                </section>
            </Link>
        </div>
    )
}