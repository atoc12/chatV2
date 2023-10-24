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