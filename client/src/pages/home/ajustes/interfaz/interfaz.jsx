import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom"
import "./Interfaz.css";
export const Interfaz = ()=>{
    const [select,setSelect] = useOutletContext();
    useEffect(()=>{
        setSelect(2);
    },[])
    const HandleSubmit = (e)=>{
        e.preventDefault();
        let estilos =document.documentElement.style;
        const formData = new FormData(e.target);
        // Recorre los elementos del formulario para obtener sus valores
        console.log("lal");
        for (let [name, value] of formData.entries()) {
            estilos.setProperty(`--${name}`,value);
          console.log(`${name}: ${value}`);
        }  
    }
    return(
        <div id="interfaz-ajustes" className="">
            <form onSubmit={(e)=>HandleSubmit(e)}>
                <div>
                    <button className="btn" type="submit">Guardar</button>
                </div>
                <div className="">
                    <section>
                        <h1>Fondo</h1>
                    </section>
                    <section>
                        <Background clase={"bkg-primary"}>Color primario</Background>
                        <Background clase={"bkg-secondary"}>Color secundario</Background>
                    </section>
                </div>
                <div className="">
                    <section>
                        <h1>Botones</h1>
                    </section>
                    <section className="">
                        <Botones clase={"btn-primary"} name={"button-primary"}>Color primario</Botones>
                        <Botones clase={"btn-secondary"}name={"button-secondary"}>Color secundario</Botones>
                    </section>
                </div>
                <div className="">
                    <section>
                        <h1>Box shadow</h1>
                    </section>
                    <section className="">
                        <Botones clase={"btn-primary"} name={"button-primary"}>Color primario</Botones>
                        <Botones clase={"btn-secondary"}name={"button-secondary"}>Color secundario</Botones>
                    </section>
                </div>
                
            </form>
        </div>
    )
} 





const Botones =({clase,name,children})=>{
    const [color,setColor] = useState(null);
    return(
        <div className="btn-settings-view">
            <section className="section-label">
                <label htmlFor={name}>{children}</label>
                <input type="color" name={name} id={name}  onChange={(e)=>setColor(e.target.value)}/>
            </section>
            <section className="">
                <button className={"btn "+clase} style={color ? {background:color} :{} } >Preview</button>
            </section>
        </div>
    )
}

const Background =({name,clase,children})=>{
    const [color,setColor] = useState(null);
    return(
        <div className="btn-settings-view">
            <section className="section-label">
                <label htmlFor={name}>{children}</label>
                <input type="color" name={name} id={name}  onChange={(e)=>setColor(e.target.value)}/>
            </section>
            <section className="">
                <div className={"div-settings-color  "+clase} style={color ? {background:color} :{} } >Preview</div>
            </section>
        </div>
    )
}