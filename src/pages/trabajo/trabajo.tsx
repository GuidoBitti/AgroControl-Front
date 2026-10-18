import './trabajo.css';
import { useEffect, useState, type SubmitEvent } from 'react';
import { createTrabajo } from '../../api/trabajo';
import { getLote, type Lote } from '../../api/lote.ts';
import BackToMenu from '../../components/BackToMenu.js';

function AsignarTrabajo() {
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loteId, setLoteId] = useState('');
  const [usuarioId] = useState(() => Number(localStorage.getItem('userId')));
  const [usuarioNombre] = useState(() => localStorage.getItem('userNombre') ?? '');
  const [usuarioApellido] = useState(() => localStorage.getItem('userApellido') ?? '');
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!usuarioId || !usuarioNombre || !usuarioApellido) {
      setError('Iniciá sesión nuevamente para identificar al usuario.');
      return;
    }

    getLote()
      .then(setLotes)
      .catch((err) => {
        console.error(err);
        setError('No se pudieron cargar los datos del formulario');
      });
  }, [usuarioId, usuarioNombre, usuarioApellido]);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!usuarioId || !usuarioNombre || !usuarioApellido) {
      setError('Iniciá sesión nuevamente para identificar al usuario.');
      return;
    }

    if (!loteId || !descripcion.trim() || !fechaInicio || !fechaFin) {
      setError('Completá todos los campos.');
      return;
    }

    if (fechaFin < fechaInicio) {
      setError('La fecha de fin no puede ser anterior a la de inicio');
      return;
    }

    try {
      await createTrabajo({
        descripcion,
        fechaInicio,
        fechaFin,
        Lote: Number(loteId),
        Usuario: usuarioId,
      });
      setDescripcion('');
      setFechaInicio('');
      setFechaFin('');
      setLoteId('');
      alert('Trabajo asignado');
    } catch (err) {
      console.error(err);
      setError('No se pudo asignar el trabajo');
    }
  };

  return (
    <div className="Pagina">
      <div className="container">
        <BackToMenu />
        <h2 className="title">ASIGNAR TRABAJO</h2>
        <form onSubmit={handleSubmit}>
          <div className="padre">
            <div className="descripcion">
              <label htmlFor="descripcion">Descripción:</label>
              <input
                type="text"
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </div>

            <div className="fechaInicio">
              <label htmlFor="fechaInicio">Fecha de inicio:</label>
              <input
                type="date"
                id="fechaInicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                required
              />
            </div>

            <div className="fechaFin">
              <label htmlFor="fechaFin">Fecha de fin:</label>
              <input
                type="date"
                id="fechaFin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                required
              />
            </div>

            <div className="loteCampania">
              <label htmlFor="lote">Lote:</label>
              <select
                id="lote"
                value={loteId}
                onChange={(e) => setLoteId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Seleccioná un lote
                </option>
                {lotes.map((lote) => (
                  <option key={lote.id} value={lote.id}>
                    Lote #{lote.id}: {lote.tipo} - {lote.descripcion}
                  </option>
                ))}
              </select>
            </div>

            <div className="usuario">
              <span>Usuario autenticado:</span>
              <p>{usuarioNombre && usuarioApellido ? `${usuarioNombre} ${usuarioApellido}` : 'No identificado'}</p>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="button">
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}

export default AsignarTrabajo;
