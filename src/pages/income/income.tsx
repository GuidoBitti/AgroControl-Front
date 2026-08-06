import { useState } from 'react';
import './income.css';
import { Link } from 'react-router-dom';

function Income() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <>
      <div className="container">
        <h2 className="titulo">INGRESO DE USUARIOS</h2>
        <form onSubmit={handleSubmit}>
          <div className="padre">
            <div className="email">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="password">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <p>
            ¿No tienes una cuenta? <Link to="/record">Regístrate aquí</Link>
          </p>
          <button type="submit" className="button">
            Ingresar
          </button>
        </form>
      </div>
    </>
  );
}

export default Income;
