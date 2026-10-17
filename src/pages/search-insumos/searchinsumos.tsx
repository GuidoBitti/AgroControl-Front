import { Link } from 'react-router-dom';
import { useState } from 'react';
import './searchinsumos.css';
import { getInsumo, type Insumo } from '../../api/insumos';

function SearchInsumos() {
  const [nombre, setNombre] = useState('');
  const [resultados, setResultados] = useState<Insumo[]>([]);
  const [buscado, setBuscado] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const insumos = await getInsumo();
      const texto = nombre.trim().toLowerCase();

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
        <h1 className="title">Busqueda de Insumos</h1>
        <form onSubmit={handleSubmit}>
          <div className="padre">
            <input
              type="text"
              placeholder="Ingrese el nombre del insumo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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
        <div className="accion">
          <Link to="/menu" className="button">
            Volver
          </Link>
        </div>

        {buscado && (
          <div className="results">
            <h2 className="resultados-titulo">Resultados de la búsqueda:</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Stock</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((i) => (
                  <tr key={i.id}>
                    <td>{i.id}</td>
                    <td>{i.nombre}</td>
                    <td>{i.tipo}</td>
                    <td>{i.stock}</td>
                    <td>{i.descripcion}</td>
                  </tr>
                ))}
                {resultados.length === 0 && (
                  <tr>
                    <td colSpan={5}>No se encontraron insumos</td>
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

export default SearchInsumos;
