import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './search-trabajo.css';
import { getTrabajo, type Trabajo } from '../../api/trabajo';
import BackToMenu from '../../components/BackToMenu';
import '../../components/RecordCards.css';

function SearchTrabajos() {
  const [nombre, setNombre] = useState('');
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [resultados, setResultados] = useState<Trabajo[]>([]);
  const [buscado, setBuscado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    async function cargarTrabajos() {
      try {
        const data = await getTrabajo();
        setTrabajos(data);
        setResultados(data);
        setBuscado(true);
      } catch (loadError) {
        console.error(loadError);
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'No se pudieron cargar los trabajos.',
        );
      } finally {
        setLoading(false);
      }
    }

    void cargarTrabajos();
  }, []);

  const buscarTrabajos = (texto: string) => {
    const busqueda = texto.trim().toLowerCase();

    return trabajos.filter(
      (trabajo) =>
        trabajo.id.toString().includes(busqueda) ||
        trabajo.fechaInicio.includes(busqueda) ||
        trabajo.descripcion.toLowerCase().includes(busqueda) ||
        trabajo.fechaFin.includes(busqueda) ||
        trabajo.cantidadInsumo.toString().includes(busqueda) ||
        String(getInsumoId(trabajo) ?? '').includes(busqueda) ||
        String(getLoteId(trabajo) ?? '').includes(busqueda),
    );
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setNotice('');

    setResultados(buscarTrabajos(nombre));
    setBuscado(true);
  };

  const getInsumoId = (t: Trabajo): number | undefined =>
    typeof t.insumo === 'object' ? t.insumo.id : t.insumo;

  const getLoteId = (t: Trabajo): number | undefined =>
    typeof t.lote === 'object' ? t.lote.id : t.lote;

  return (
    <div className="Pagina">
      <div className="container search-trabajo-page">
        <BackToMenu />
        <h1 className="title">BÚSQUEDA DE TRABAJOS</h1>
        <form onSubmit={handleSubmit}>
          <div className="padre">
            <input
              type="text"
              placeholder="Ingrese el nombre del trabajo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <p>
              ¿Desea agregar un nuevo trabajo?{' '}
              <Link to="/trabajos">Agregar Trabajo</Link>
            </p>
            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Cargando trabajos...' : 'Buscar'}
            </button>
          </div>
        </form>
        {error && (
          <p
            className="search-trabajo-feedback search-trabajo-error"
            role="alert"
          >
            {error}
          </p>
        )}
        {notice && (
          <p
            className="search-trabajo-feedback search-trabajo-success"
            role="status"
          >
            {notice}
          </p>
        )}
        {loading && <p role="status">Cargando trabajos...</p>}
        {buscado && (
          <section className="search-trabajo-results">
            <h2 className="resultados-titulo">Resultados de la búsqueda:</h2>
            {resultados.length === 0 ? (
              <p>No se encontraron trabajos.</p>
            ) : (
              <div className="record-list" aria-label="Resultados de trabajos">
                {resultados.map((i) => (
                  <article className="record-card" key={i.id}>
                    <div className="record-card-content">
                      <span className="record-card-kicker">
                        Trabajo #{i.id}
                      </span>
                      <h3 className="record-card-title">{i.descripcion}</h3>
                      <div className="record-card-details">
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Fecha de inicio:
                          </span>
                          {i.fechaInicio}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Fecha de fin:
                          </span>
                          {i.fechaFin}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Cantidad de insumos:
                          </span>
                          {i.cantidadInsumo}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Descripción:
                          </span>
                          {i.descripcion}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Lote:
                          </span>
                          {getLoteId(i) ?? 'N/A'}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Insumo:
                          </span>
                          {getInsumoId(i) ?? 'N/A'}
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

export default SearchTrabajos;
