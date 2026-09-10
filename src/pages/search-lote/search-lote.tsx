import { Link } from 'react-router-dom';
import { useState } from 'react';
import './search-lote.css';

function SearchLote() {
  const [Lote, setLote] = useState('');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Lote:', Lote);
  };
  return (
    <div className="container">
      <h1 className="title">Busqueda de Lotes</h1>
      <form onSubmit={handleSubmit}>
        <div className="padre">
          <input
            type="text"
            placeholder="Ingrese numero de lote"
            value={Lote}
            onChange={(e) => setLote(e.target.value)}
          />
          <p>
            ¿Desea agregar un nuevo lote? <Link to="/lotes">Agregar Lote</Link>
          </p>
          <button type="submit" className="button">
            Buscar
          </button>
        </div>
      </form>
    </div>
  );
}
export default SearchLote;
