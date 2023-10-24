import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './buscador.css';
import { useEffect, useState } from 'react';
import { socket } from '../home';
import { ListaCoincidencias } from '../index/Publicaciones/listaPublicaciones/listaPublicaciones';
import { Publicacion } from '../index/Publicaciones/publicacion';
import { Load } from '../components/load/load';
export const Buscador =()=>{
    const {id} = useParams();
    const [searchParams,setSearchParams] = useSearchParams();
    const history = useNavigate();
    const [search ,setSearch] =useState(searchParams.get("search"));
    const [filter,setFilter] = useState(searchParams.get("in"));
    const [lista,setLista] = useState([]);
    const [loader,setLoader] = useState(true);
    const load = ()=>{socket.emit(`buscar`,{search:search != '*'  ? search : {},filter:filter});}
    useEffect(()=>{
        socket.on("busqueda-resultado",(datos)=>{
            setLista(datos)
            setLoader(false);
        });
    },[])
    useEffect(() => {
        setLista([]);
        setFilter(null);
        setFilter(searchParams.get("in"));
        setLoader(true);
      }, [searchParams]);
    useEffect(() => {
        load();
    }, [search, filter]);

    return(
        <div id='buscadro-index'>
            <div>
                <Link className='btn' to={`/home/buscador?search=${search}&in=usuario`} style={filter == 'usuario' ? {borderBottom:'2px solid cyan'}:{}}>Perfil</Link>
                <Link className='btn' to={`/home/buscador?search=${search}&in=publicacion`} style={filter == 'publicacion' ? {borderBottom:'2px solid cyan'}:{}}>Publicacion</Link>
            </div>
            <div>
                {
                    loader ? 
                        <Load/> 
                    : 
                    <ul>

                        {
                            filter == 'usuario'? 
                                lista.length > 0 ?
                                    lista.map((datos,key)=>{
                                        return <ListaCoincidencias key={key} data={datos}></ListaCoincidencias>
                                    })
                                :<span className='resultado-search'>No se ha encontrado usuarios</span>
                                
                            : <></>
                        }
                        {
                            filter == 'publicacion' ? 
                                lista.length > 0 ?
                                    lista.map((datos,key)=>{
                                        return datos.status ? <Publicacion data={datos} key={key} respuesta={true}></Publicacion> : null
                                    })
                                :<span className='resultado-search'>Publicacion no encontrada</span>
                            : <></>
                        }

                    </ul>
                }
            </div>
        </div>
    )
}