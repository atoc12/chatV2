import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import './index.css';
import { useEffect, useState } from 'react';
import { useUser } from '../../../config/context/user/userContext';
import { socket } from '../home';
import { Publicacion } from './Publicaciones/publicacion';
import { CrearPublicacion } from './Publicaciones/crearPublicaciones/crearPublicacion';
import { ListaCoincidencias } from './Publicaciones/listaPublicaciones/listaPublicaciones';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTittle } from '../../../config/context/tittle/tittlecontext';
import { useSelectPubli } from '../../context/seleccionarPublicacion/selectPublicacion';
import { Load } from '../components/load/load';

export const Index = ()=>{
    const {user,setUser} = useUser();
    const {tittle,setTittle} = useTittle()
    const {publiselect,setPubliSelect} = useSelectPubli();
    const [filter,setFilter] =useState(null);
    const [search,setSearch] = useState(null);
    const [select,setSelect]= useState(null);
    const [load,setLoad] = useState(true);
    const [add,setAdd]=useState(false);
    const [publicaciones,setPublicaciones] = useState([]);
    useEffect(()=>{
        setTittle('inicio')
        socket.emit("obtener-publicacion",{});
        socket.on("nuevas-publicaciones",()=>socket.emit("obtener-publicacion",{}))
        socket.on("recibir-publicacion",data=>{
            setPublicaciones(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
            setLoad(false);
        })
    },[])
    return(
        <div id='index-home'>
            <section>
                <InputSearch search={search} setSearch={setSearch} filter={filter} setFilter={setFilter}></InputSearch>
                <ResultadosListaDeBusqueda filter={filter} search={search}></ResultadosListaDeBusqueda>
            </section>
            <section id='index-content'>
                <section>
                    {
                        load ?
                            <Load/>
                        : publicaciones && publicaciones.length>0 ? publicaciones.map((data,key)=>{
                            return(
                                data ||  (user && data.creator == user._id) ? 
                                    data.type && data.type == "post" ? 
                                        data.status ? <Publicacion data={data} respuesta={true} key={key}/>:null
                                    :
                                    <div key={key}>
                                        {data}
                                    </div>
                                :null
                                );
                            }):<></>
                    }
                </section>
            </section>
            {user && add ? <CrearPublicacion add={add} setAdd={setAdd}></CrearPublicacion> : <></>}
            {user ?<button id='create-publicacio-btn' onClick={()=>setAdd(!add)} className='btn' aria-label={"boton para agregar publicaciones"}><AiOutlinePlus/></button>:<></>}            
        </div>
    )
}


const InputSearch = ({search,setSearch,filter,setFilter})=>{
    const history = useNavigate()
    const handeSubmit = (e)=>{
        e.preventDefault();
        console.log("a");
        history(`/home/buscador?search=${search ? search : '*'}&in=usuario`)
    }
    useEffect(()=>{
        if(search){
            socket.emit("buscar-usuario",search);
            socket.on("busqueda-resultado",(datos)=>setFilter(datos));
        }
    },[search])
    return(
        <form onSubmit={(e)=>handeSubmit(e)}>
                <input type="search" name="buscar" id="buscar" autoComplete='off' placeholder='Buscar' className='btn' onChange={(e)=>setSearch(e.target.value != '' ? e.target.value : null)} aria-label={"input de busqueda"}/>
                <button type='submit' className='btn' aria-label={"boton de busqueda"} ><AiOutlineSearch/></button>
        </form>
    )
}


const ResultadosListaDeBusqueda = ({search,filter})=>{
    return(
            <>
                   
                    {
                        search? 
                        <div id='div-busqueda'>
                            <ul>
                                {filter ? filter.map((datos,key)=><li key={key}><ListaCoincidencias data={datos}></ListaCoincidencias> </li>):<></>}
                            </ul>
                        </div>
                        :<></>
                    }
            </>
    )
}