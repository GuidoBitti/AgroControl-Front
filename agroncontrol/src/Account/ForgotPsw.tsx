import { Link } from "react-router-dom";
import { useState } from "react";


export function ForgotPsw(){
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");


    return(
        <form onSubmit={handleSubmit}>
      <h1>Inicio de sesion</h1>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password">contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          required
        />
      </div>

      <button type="submit">Login</button>
            <div>
                <Link to="/login">Volver al inicio</Link>
            </div>
        </form>
    )
}