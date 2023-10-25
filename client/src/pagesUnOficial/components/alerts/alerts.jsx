import { AiOutlineCloseCircle } from "react-icons/ai";
import "./alerts.css";
import { useAlert } from "../../../config/context/alert/alert";
import { useEffect } from "react";

export const AlertsMessage = ({alerta})=>{
    return(
        <div className="alert-message">
            <div>
                <section>
                    {alerta.content}
                </section>
                <span></span>
            </div>
        </div>
    )
}