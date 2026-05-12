import { Link } from "react-router-dom";

export function Register(){
    return(
        <form>
            <div>
                <Link to="/login">Volver al inicio</Link>
            </div>
        </form>
    )
}