import { useState } from "react";
import { Link } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()

    console.log({
      email,
      password,
    });
  };

  return (
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
        <Link to="/forgot-password">Olvide mi contraseña</Link>
      </div>
      <div>
        <Link to="/register">Registrarse</Link>
      </div>
    </form>
  );
}
