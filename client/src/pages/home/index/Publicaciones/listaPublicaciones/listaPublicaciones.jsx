import { NavLink } from 'react-router-dom';
import './listasPublicaciones.css';
import { appVar } from '../../../../../config/var';
import { Icon } from '../../../components/icon-user/icon-user';
export const ListaCoincidencias =({data})=>{
    return(
        <NavLink to={"/home/usuario/"+data.name} className={"lista-coincidencia"}>
            <div>
                <span>         
                    <Icon data={data}></Icon>
                </span>
            </div>
            <div>
                {
                    data.name
                }
            </div>
        </NavLink>
    )
}