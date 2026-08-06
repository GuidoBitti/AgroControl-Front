import { Link } from 'react-router-dom';
import { useState } from 'react';
import './record.css';

function Record() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [nacimiento, setNacimiento] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Nombre:', nombre);
    console.log('Apellido:', apellido);
    console.log('Correo:', correo);
    console.log('Contraseña:', contraseña);
    console.log('Teléfono:', telefono);
    console.log('Dirección:', direccion);
    console.log('Fecha de Nacimiento:', nacimiento);
  };

  return (
    <>
      <div className="container">
        <h2 className="titulo">REGISTRO USUARIO</h2>
        <form onSubmit={handleSubmit}>
          <div className="padre">
            <div className="nombre">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresa tu nombre"
                required
              />
            </div>
            <div className="apellido">
              <label htmlFor="apellido">Apellido:</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Ingresa tu apellido"
                required
              />
            </div>
            <div className="correo">
              <label htmlFor="correo">Correo:</label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="Ingresa tu correo"
                required
              />
            </div>
            <div className="contraseña">
              <label htmlFor="contraseña">Contraseña:</label>
              <input
                type="password"
                id="contraseña"
                name="contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            <div className="telefono">
              <label htmlFor="telefono">Teléfono:</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ingresa tu teléfono"
              />
            </div>
            <div className="direccion">
              <label htmlFor="direccion">Dirección:</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Ingresa tu dirección"
              />
            </div>
            <div className="nacimiento">
              <label htmlFor="nacimiento">Fecha de Nacimiento:</label>
              <input
                type="date"
                id="nacimiento"
                name="nacimiento"
                value={nacimiento}
                onChange={(e) => setNacimiento(e.target.value)}
                placeholder="Selecciona tu fecha de nacimiento"
              />
            </div>
            <p>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/income">Inicia sesión aquí</Link>
            </p>
            <button type="submit" className="button">
              Registrar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Record;
