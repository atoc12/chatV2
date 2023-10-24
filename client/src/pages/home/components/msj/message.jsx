import {BiCheckCircle, BiErrorCircle} from 'react-icons/bi'
import {CiShare1} from 'react-icons/ci';
import { useEffect, useState } from 'react';
import './msj.css';
import { Link } from 'react-router-dom';
import { Load } from '../load/load';
import { useAlert } from '../../../../config/context/alert/alert';
export const AlertDiv = () => {
    const {alert,setAlert} = useAlert();
    const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
    const [keyForReset, setKeyForReset] = useState(0);
    const [isLoading, setIsLoading] = useState(alert[currentAlertIndex] ? false : true); // Estado para controlar si está cargando
    useEffect(()=>{
        console.log(alert);
    },[])    
    useEffect(() => {
      if(alert[currentAlertIndex]){
          setIsLoading(false);
      }
    }, [currentAlertIndex]);
  
    useEffect(() => {
      if (alert.length > 0 && !isLoading) {
        const timeout = setTimeout(() => {
          if (currentAlertIndex < alert.length - 1) {
            setCurrentAlertIndex(prevIndex => prevIndex + 1);
            setKeyForReset(prevKey => prevKey + 1); // Cambia la key para resetear MessagesGlobal
          } else {
            setAlert([]);
            setCurrentAlertIndex(0);
            setKeyForReset(prevKey => prevKey + 1); // Cambia la key para resetear MessagesGlobal
          }
        }, 5000);
  
        return () => clearTimeout(timeout);
      }
    }, [currentAlertIndex, alert, setAlert, isLoading]);
    
    return (
      <div id='alert-div'>
        {alert.length > 0 && currentAlertIndex < alert.length ? (
          <MessagesGlobal
            key={keyForReset}
            data={alert[currentAlertIndex]}
            load={isLoading}
          />
        ) : null}
      </div>
    );
  }
export const MessagesGlobal = ({data,load})=>{
    return( 
        <div className='msj-global'>
            <div className={ load ? '' :'carga'}>
                {
                    load ? <Load/> 
                    : 
                    <>
                        <span>
                            {
                                
                                data.type ?<BiCheckCircle className='active-color'/>:<BiErrorCircle className='error-color'/>
                            }
                        </span>
                        <span>
                            {data.content}
                        </span>
                        <Link to={"/home/notificaciones"}>
                            <CiShare1/>
                        </Link>    
                    </>
                }
            </div>
        </div>
    )
}