import { Link } from 'react-router-dom';
import { useState } from 'react';
import './search-lote.css';
import { getLote, type Lote } from '../../api/lote.ts';
import BackToMenu from '../../components/BackToMenu.js';

function SearchLote() {
  const [id, setId] = useState('');
  const [resultados, setResultados] = useState<Lote[]>([]);
  const [buscado, setBuscado] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const insumos = await getLote();
      const texto = id.trim().toLowerCase();

      setResultados(
        insumos.filter(
          (i) =>
            i.id.toString().includes(texto) ||
            i.nombre.toLowerCase().includes(texto) ||
            i.descripcion.toLowerCase().includes(texto) ||
            i.tipo.toLowerCase().includes(texto),
        ),
      );
      setBuscado(true);
    } catch (error) {
      console.error(error);
      alert('No se pudo realizar la búsqueda');
    }
  };

  return (
    <div className="Pagina">
      <div className="container">
        <BackToMenu />
        <h1 className="title">Busqueda de Lotes</h1>
        <form onSubmit={handleSubmit}>
          <div className="padre">
            <input
              type="text"
              placeholder="Ingrese el id del lote"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <p>
              ¿Desea agregar un nuevo lote?{' '}
              <Link to="/lotes">Agregar Lote</Link>
            </p>
            <button type="submit" className="button">
              Buscar
            </button>
          </div>
        </form>

        {buscado && resultados.length === 0 && (
          <p className="no-results">No se encontraron lotes.</p>
        )}
        {buscado && (
          <div className="results">
            <h2 className="resultados-titulo">Resultados de la búsqueda:</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((i) => (
                  <tr key={i.id}>
                    <td>{i.id}</td>
                    <td>{i.tipo}</td>
                    <td>{i.descripcion}</td>
                  </tr>
                ))}
                {resultados.length === 0 && (
                  <tr>
                    <td colSpan={5}>No se encontraron lotes</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchLote;
