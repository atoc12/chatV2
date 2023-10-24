import { appVar } from '../../../config/var';
import './icon.css';
export const Icon = ({data})=>{
    return(
        <div className='icon'>
            <img loading='lazy' src={`${appVar.ip+"/carpetas/usuario/icon/pic-"+(data.creator || data.sender ? (data.creator ? data.creator : data.sender) : data._id )+".jpg"}`} alt='icon'/> 
        </div>
    )
}