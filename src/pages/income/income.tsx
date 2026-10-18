import { useState } from 'react';
import './income.css';
import { Link, useNavigate } from 'react-router-dom';
import { getUsuarioDesdeLogin, login } from '../../api/usuario.ts';

function Income() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const data = await login(email.trim(), password);
      localStorage.setItem('token', data.token);
      const usuario = await getUsuarioDesdeLogin(data, email.trim());
      localStorage.setItem('userId', String(usuario.id));
      localStorage.setItem('userNombre', usuario.nombre);
      localStorage.setItem('userApellido', usuario.apellido);
      navigate('/menu');
    } catch (err) {
      console.error(err);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userNombre');
      localStorage.removeItem('userApellido');
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
