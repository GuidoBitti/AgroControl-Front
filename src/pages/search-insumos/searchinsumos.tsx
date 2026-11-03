import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './searchinsumos.css';
import { getInsumo, type Insumo } from '../../api/insumos';
import BackToMenu from '../../components/BackToMenu.js';
import '../../components/RecordCards.css';

function SearchInsumos() {
  const [nombre, setNombre] = useState('');
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [resultados, setResultados] = useState<Insumo[]>([]);
  const [buscado, setBuscado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    async function cargarInsumos() {
      try {
        const data = await getInsumo();
        setInsumos(data);
        setResultados(data);
        setBuscado(true);
      } catch (loadError) {
        console.error(loadError);
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'No se pudieron cargar los insumos.',
        );
      } finally {
        setLoading(false);
      }
    }

    void cargarInsumos();
  }, []);

  const buscarInsumos = (texto: string) => {
    const busqueda = texto.trim().toLowerCase();

    return insumos.filter(
      (insumo) =>
        insumo.id.toString().includes(busqueda) ||
        insumo.nombre.toLowerCase().includes(busqueda) ||
        insumo.descripcion.toLowerCase().includes(busqueda) ||
        insumo.tipo.toLowerCase().includes(busqueda),
    );
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setNotice('');

    setResultados(buscarInsumos(nombre));
    setBuscado(true);
  };

  const handleLimpiar = () => {
    setNombre('');
  };

  return (
    <div className="Pagina">
      <div className="container">
        <BackToMenu />
        <h1 className="title">BÚSQUEDA DE INSUMOS</h1>
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
            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Cargando insumos...' : 'Buscar'}
            </button>
            <button type="button" className="button" onClick={handleLimpiar}>
              Limpiar
            </button>
          </div>
        </form>
        {error && (
          <p
            className="search-insumos-feedback search-insumos-error"
            role="alert"
          >
            {error}
          </p>
        )}
        {notice && (
          <p
            className="search-insumos-feedback search-insumos-success"
            role="status"
          >
            {notice}
          </p>
        )}
        {loading && <p role="status">Cargando insumos...</p>}
        {buscado && (
          <section className="insumos-list-section">
            <h2>Insumos de la organización</h2>
            {resultados.length === 0 ? (
              <p>No hay insumos para mostrar.</p>
            ) : (
              <div
                className="record-list"
                aria-label="Insumos de la organización"
              >
                {insumos.map((insumo) => (
                  <article className="record-card" key={insumo.id}>
                    <div className="record-card-content">
                      <span className="record-card-kicker">
                        Insumo #{insumo.id}
                      </span>
                      <h3 className="record-card-title">{insumo.nombre}</h3>
                      <div className="record-card-details">
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Tipo:
                          </span>
                          {insumo.tipo}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Stock:
                          </span>
                          {insumo.stock}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Descripción:
                          </span>
                          {insumo.descripcion}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default SearchInsumos;
