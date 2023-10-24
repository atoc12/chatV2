import { AiOutlineCloseCircle } from "react-icons/ai";
import "./alerts.css";

export const AlertsMessage = ()=>{
    return(
        <div className="alert-message">
            <div>
                <span>
                    
                </span>
                <section className="alert-message-options">
                    <button className="btn"><AiOutlineCloseCircle/></button>
                </section>
                
            </div>
        </div>
    )
}