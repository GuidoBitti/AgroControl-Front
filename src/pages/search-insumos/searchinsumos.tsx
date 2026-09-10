import { Link } from 'react-router-dom';
import { useState } from 'react';
import './searchinsumos.css';

function SearchInsumos() {
  const [Insumo, setInsumo] = useState('');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Insumo:', Insumo);
  };
  return (
    <div className="container">
      <h1 className="title">Busqueda de Insumos</h1>
      <form onSubmit={handleSubmit}>
        <div className="padre">
          <input
            type="text"
            placeholder="Ingrese el nombre del insumo"
            value={Insumo}
            onChange={(e) => setInsumo(e.target.value)}
          />
          <p>
            ¿Desea agregar un nuevo insumo?{' '}
            <Link to="/insumos">Agregar Insumo</Link>
          </p>
          <button type="submit" className="button">
            Buscar
          </button>
        </div>
      </form>
    </div>
  );
}
export default SearchInsumos;
