import { useEffect, useState, type FormEvent } from 'react';
import { getCampanias, type Campania } from '../../api/campania';
import { getUsuario, type Usuario } from '../../api/usuario';
import BackToMenu from '../../components/BackToMenu.js';
import '../../components/RecordCards.css';

function relationId(
  value: number | { id: number } | null | undefined,
): number | undefined {
  if (typeof value === 'number') return value;
  return value?.id;
}

function campaniaBelongsToOrganization(
  campania: Campania,
  organizacionId: number,
): boolean {
  const organizaciones = Array.isArray(campania.organizacion)
    ? campania.organizacion
    : [campania.organizacion];

  return organizaciones.some(
    (organizacion) => relationId(organizacion) === organizacionId,
  );
}

function BuscarCampania() {
  const [id, setId] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [campanias, setCampanias] = useState<Campania[]>([]);
  const [resultados, setResultados] = useState<Campania[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const dia = (fecha: string) => fecha.slice(0, 10);

  useEffect(() => {
    async function loadCampanias() {
      try {
        const userId = Number(localStorage.getItem('userId'));
        if (!Number.isInteger(userId) || userId <= 0) {
          throw new Error('Iniciá sesión nuevamente para identificar al usuario.');
        }

        const usuarios: Usuario[] = await getUsuario();
        const usuarioActual = usuarios.find((usuario) => usuario.id === userId);
        const organizacionId = usuarioActual
          ? relationId(usuarioActual.organizacion)
          : undefined;
        if (!organizacionId) {
          throw new Error('No se pudo identificar la organización del usuario.');
        }

        const todasLasCampanias = await getCampanias();
        const campaniasOrganizacion = todasLasCampanias.filter((campania) =>
          campaniaBelongsToOrganization(campania, organizacionId),
        );
        setCampanias(campaniasOrganizacion);
        setResultados(campaniasOrganizacion);
      } catch (loadError) {
        console.error(loadError);
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'No se pudieron cargar las campañas de la organización.',
        );
      } finally {
        setCargando(false);
      }
    }

    void loadCampanias();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    setResultados(
      campanias.filter((c) => {
        if (id && c.id !== Number(id)) return false;
        if (fechaInicio && dia(c.fechaInicio) < fechaInicio) return false;
        if (fechaFin && dia(c.fechaFin) > fechaFin) return false;
        return true;
      }),
    );
  };

  const handleLimpiar = () => {
    setId('');
    setFechaInicio('');
    setFechaFin('');
    setResultados(campanias);
  };

  return (
    <div className="Pagina">
      <div className="container">
        <BackToMenu />
        <h2 className="title">CAMPAÑAS DE MI ORGANIZACIÓN</h2>
        <form onSubmit={handleSubmit}>
          <div className="padre">
            <div>
              <label htmlFor="id">ID:</label>
              <input
                type="number"
                id="id"
                min={1}
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="fechaInicio">Inicia desde:</label>
              <input
                type="date"
                id="fechaInicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="fechaFin">Termina hasta:</label>
              <input
                type="date"
                id="fechaFin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="button">
            Buscar
          </button>
          <button type="button" className="button" onClick={handleLimpiar}>
            Limpiar
          </button>
        </form>

        {cargando && <p role="status">Cargando campañas...</p>}
        {!cargando && !error && resultados.length === 0 && (
          <p>No se encontraron campañas.</p>
        )}

        {!cargando && resultados.length > 0 && (
          <section className="record-list" aria-label="Campañas de la organización">
            {resultados.map((campania) => (
              <article className="record-card" key={campania.id}>
                <div className="record-card-content">
                  <span className="record-card-kicker">
                    Campaña #{campania.id}
                  </span>
                  <h3 className="record-card-title">{campania.descripcion}</h3>
                  <div className="record-card-details">
                    <span className="record-card-detail">
                      <span className="record-card-detail-label">Inicio:</span>
                      {dia(campania.fechaInicio)}
                    </span>
                    <span className="record-card-detail">
                      <span className="record-card-detail-label">Fin:</span>
                      {dia(campania.fechaFin)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

export default BuscarCampania;
