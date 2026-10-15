import { useState, type FormEvent } from 'react';
import './income.css';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/usuario.ts';

function Income() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      await login(email.trim(), password);
      navigate('/menu');
    } catch (err) {
      console.error(err);
      setError('Email o contraseña incorrectos');
    }
  };

  return (
    <>
      <div className="container">
        <h2 className="title">INGRESO DE USUARIOS</h2>
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
          {error && <p className="error">{error}</p>}
          <button type="submit" className="button">
            Ingresar
          </button>
        </form>
      </div>
    </>
  );
}

export default Income;
