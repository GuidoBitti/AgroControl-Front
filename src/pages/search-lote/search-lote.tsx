import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './search-lote.css';
import { getLote, type Lote } from '../../api/lote.ts';
import { getCampaniaActual, type Campania } from '../../api/campania';
import { createLoteCampania } from '../../api/lote-campania';
import BackToMenu from '../../components/BackToMenu.js';
import '../../components/RecordCards.css';

function SearchLote() {
  const [id, setId] = useState('');
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [resultados, setResultados] = useState<Lote[]>([]);
  const [campaniaActual, setCampaniaActual] = useState<Campania | null>(null);
  const [lotesAsignados, setLotesAsignados] = useState<Set<number>>(
    () => new Set(),
  );
  const [buscado, setBuscado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingLoteId, setSavingLoteId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [campaniaError, setCampaniaError] = useState('');
  const [noHayCampania, setNoHayCampania] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    async function cargarLotes() {
      const [lotesResult, campaniaResult] = await Promise.allSettled([
        getLote(),
        getCampaniaActual(),
      ]);

      if (lotesResult.status === 'fulfilled') {
        setLotes(lotesResult.value);
        setResultados(lotesResult.value);
        setBuscado(true);
      } else {
        console.error(lotesResult.reason);
        setError(
          lotesResult.reason instanceof Error
            ? lotesResult.reason.message
            : 'No se pudieron cargar los lotes.',
        );
      }

      if (campaniaResult.status === 'fulfilled') {
        const campania = campaniaResult.value;
        setCampaniaActual(campania);
        setLotesAsignados(
          new Set(
            (campania.LoteCampanias ?? []).map(
              (asignacion) => asignacion.Lote.id,
            ),
          ),
        );
      } else {
        console.error(campaniaResult.reason);
        const message =
          campaniaResult.reason instanceof Error
            ? campaniaResult.reason.message
            : 'No se pudo consultar la campaña vigente.';
        if (message.includes('No hay una campaña vigente')) {
          setNoHayCampania(true);
        } else {
          setCampaniaError(message);
        }
      }

      setLoading(false);
    }

    void cargarLotes();
  }, []);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setNotice('');
    const texto = id.trim().toLowerCase();
    setResultados(
      lotes.filter(
        (lote) =>
          lote.id.toString().includes(texto) ||
          lote.numero.toString().includes(texto) ||
          lote.descripcion.toLowerCase().includes(texto),
      ),
    );
    setBuscado(true);
  };

  const handleAsignarCampania = async (lote: Lote) => {
    if (!campaniaActual) return;

    setSavingLoteId(lote.id);
    setError('');
    setNotice('');
    try {
      await createLoteCampania({
        loteId: lote.id,
        campaniaId: campaniaActual.id,
      });
      setLotesAsignados((current) => new Set(current).add(lote.id));
      setNotice(`El lote ${lote.numero} quedó asignado a la campaña vigente.`);
    } catch (assignmentError) {
      console.error(assignmentError);
      setError(
        assignmentError instanceof Error
          ? assignmentError.message
          : 'No se pudo asignar el lote a la campaña vigente.',
      );
    } finally {
      setSavingLoteId(null);
    }
  };

  return (
    <div className="Pagina">
      <div className="container search-lote-page">
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
            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Cargando lotes...' : 'Buscar'}
            </button>
          </div>
        </form>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {campaniaError && (
          <p className="error" role="alert">
            {campaniaError}
          </p>
        )}
        {noHayCampania && (
          <p className="search-lote-campaign-status" role="status">
            No hay una campaña vigente para esta organización.
          </p>
        )}
        {notice && (
          <p className="search-lote-notice" role="status">
            {notice}
          </p>
        )}
        {loading && <p role="status">Cargando lotes...</p>}
        {buscado && (
          <section className="search-lote-results">
            <h2 className="resultados-titulo">Resultados de la búsqueda:</h2>
            {resultados.length === 0 ? (
              <p>No se encontraron lotes.</p>
            ) : (
              <div className="record-list" aria-label="Resultados de lotes">
                {resultados.map((lote) => (
                  <article className="record-card" key={lote.id}>
                    <div className="record-card-content">
                      <span className="record-card-kicker">ID {lote.id}</span>
                      <h3 className="record-card-title">
                        {lote.descripcion} - {lote.numero}
                      </h3>
                      <div className="record-card-details">
                        {campaniaActual && (
                          <span
                            className={`record-card-detail search-lote-assignment-status ${
                              lotesAsignados.has(lote.id)
                                ? 'is-assigned'
                                : 'is-unassigned'
                            }`}
                          >
                            {lotesAsignados.has(lote.id)
                              ? `Asignado a la campaña vigente (#${campaniaActual.id})`
                              : 'No asignado a la campaña vigente'}
                          </span>
                        )}
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Hectáreas:
                          </span>
                          {lote.hectareas}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Coordenadas:
                          </span>
                          {lote.latitud}, {lote.longitud}
                        </span>
                      </div>
                    </div>
                    {campaniaActual && !lotesAsignados.has(lote.id) && (
                      <div className="record-card-actions">
                        <button
                          type="button"
                          disabled={savingLoteId !== null}
                          onClick={() => void handleAsignarCampania(lote)}
                        >
                          {savingLoteId === lote.id
                            ? 'Asignando...'
                            : 'Asignar a campaña vigente'}
                        </button>
                      </div>
                    )}
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

export default SearchLote;
