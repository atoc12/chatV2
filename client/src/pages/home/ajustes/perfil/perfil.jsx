import { useEffect, useState } from 'react';
import './perfil.css';
import { useUser } from '../../../../config/context/user/userContext';
import { socket } from '../../home';
import { appVar } from '../../../../config/var';
import { EatApi } from '../../../../config/fetch/fetch';
import { useOutletContext } from 'react-router-dom';
export const PerfilAjuste =()=>{
    const {user,setUser} = useUser()
    const [select,setSelect] = useOutletContext()
    const [nombre,setNombre] =useState(user.name)
    const [img,setImg]= useState(null);
    const HandleSubmit=async(event)=>{
        event.preventDefault();
        const files = event.target["inputImage"].files;
        if (files.length > 0) {
            const formData = new FormData();
            formData.append('lol', files[0],"pic-"+user._id);
            console.log(formData.get('lol'));
            try {
                const response = await fetch(appVar.ip+'/subir/archivo', {method: 'POST',body: formData,});
                if (response.ok) {
                  console.log('Imagen subida correctamente');
                }else {
                  console.error('Error al subir la imagen:', response.statusText);
                }
            }catch (error) {
                console.error('Error en la solicitud:', error);
            }
          }
          socket.emit("actualizar-perfil",{
            user:user,
            update:files.length >0 ?{
              name:nombre,
              picture:"pic-"+user._id
            }:{
              name:nombre
            }
          })
    }
    useEffect(()=>{
      setSelect(1);
    },[])
    const Preview =(event)=>{
        var input = event.target;
        var reader = new FileReader();
      
        reader.onload = function() {
        //   var img = document.createElement("img");
        //   img.src = reader.result;
          setImg(reader.result);
          document.getElementById("imagePreview").setAttribute('src',reader.result);
          document.getElementById("icon-config").style.backgroundImage=`url(${reader.result})`;
        };
      
        reader.readAsDataURL(input.files[0]);
    }
    return(
        <div id='perfil-ajustes'>
            <form onSubmit={(e)=>HandleSubmit(e)}>
                <section>
                    <section>
                        <section id='icon-config' style={{backgroundImage:`url(${appVar.ip+"/carpetas/usuario/icon/pic-"+user._id+".jpeg"})`}}>
                            <span>
                                <img src={`${appVar.ip+"/carpetas/usuario/icon/pic-"+user._id+".jpeg"}`} id='imagePreview' />
                                <input type="file" name="inputImage" id="inputImage" accept="image/*" onChange={(e)=>Preview(e)}/>
                            </span>
                            <p>{nombre}</p>
                        </section>
                        <section>
                          <section className='input-perfil'>
                              <label htmlFor="nombre-cuenta">nombre</label>
                              <input type="text" name="nombre-cuenta" id="nombre-cuenta" placeholder={nombre} onChange={(e)=>setNombre(e.target.value != '' ?e.target.value : user.name )}/>
                          </section>
                        </section>
                    </section>
                    <section>
                        <button type="submit" className='btn btn-save btn-primary'>Guardar</button>
                    </section>
                </section>
            </form>
        </div>
    )
}