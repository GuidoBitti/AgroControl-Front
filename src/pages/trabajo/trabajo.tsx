import './trabajo.css';
import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { createTrabajo } from '../../api/trabajo';
import { getUsuario, type Usuario } from '../../api/usuario';
import { getLoteCampania, type LoteCampania } from '../../api/lote-campania';

function AsignarTrabajo() {
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loteCampaniaId, setLoteCampaniaId] = useState(0);
  const [usuarioId, setUsuarioId] = useState(0);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loteCampanias, setLoteCampanias] = useState<LoteCampania[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getUsuario(), getLoteCampania()])
      .then(([u, lc]) => {
        setUsuarios(u);
        setLoteCampanias(lc);
      })
      .catch((err) => {
        console.error(err);
        setError('No se pudieron cargar los datos del formulario');
      });
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (fechaFin < fechaInicio) {
      setError('La fecha de fin no puede ser anterior a la de inicio');
      return;
    }

    try {
      await createTrabajo({
        descripcion,
        fechaInicio,
        fechaFin,
        LoteCampania: loteCampaniaId,
        Usuario: usuarioId,
      });
      setDescripcion('');
      setFechaInicio('');
      setFechaFin('');
      setLoteCampaniaId(0);
      setUsuarioId(0);
      alert('Trabajo asignado');
    } catch (err) {
      console.error(err);
      setError('No se pudo asignar el trabajo');
    }
  };

  return (
    <div className="Pagina">
      <div className="container">
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
              <label htmlFor="loteCampania">Lote de campaña:</label>
              <select
                id="loteCampania"
                value={loteCampaniaId}
                onChange={(e) => setLoteCampaniaId(Number(e.target.value))}
                required
              >
                <option value={0} disabled>
                  Seleccioná un lote de campaña
                </option>
                {loteCampanias.map((lc) => (
                  <option key={lc.id} value={lc.id}>
                    {}
                    Lote de campaña #{lc.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="usuario">
              <label htmlFor="usuario">Usuario:</label>
              <select
                id="usuario"
                value={usuarioId}
                onChange={(e) => setUsuarioId(Number(e.target.value))}
                required
              >
                <option value={0} disabled>
                  Seleccioná un usuario
                </option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre} {u.apellido}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="button">
            Guardar
          </button>
        </form>
        <div className="accion">
          <Link to="/menu" className="button">
            Volver
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AsignarTrabajo;
