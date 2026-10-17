import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { getCampanias, type Campania } from '../../api/campania';

function BuscarCampania() {
  const [id, setId] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [resultados, setResultados] = useState<Campania[]>([]);
  const [buscado, setBuscado] = useState(false);
  const [error, setError] = useState('');

  const dia = (fecha: string) => fecha.slice(0, 10);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const campanias = await getCampanias();

      setResultados(
        campanias.filter((c) => {
          if (id && c.id !== Number(id)) return false;
          if (fechaInicio && dia(c.fechaInicio) < fechaInicio) return false;
          if (fechaFin && dia(c.fechaFin) > fechaFin) return false;
          return true;
        }),
      );
      setBuscado(true);
    } catch (err) {
      console.error(err);
      setError('No se pudo realizar la búsqueda');
    }
  };

  const handleLimpiar = () => {
    setId('');
    setFechaInicio('');
    setFechaFin('');
    setResultados([]);
    setBuscado(false);
  };

  return (
    <div className="Pagina">
      <div className="container">
        <h2 className="title">BUSCAR CAMPAÑAS</h2>
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

        {buscado && resultados.length === 0 && (
          <p>No se encontraron campañas.</p>
        )}

        {resultados.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{dia(c.fechaInicio)}</td>
                  <td>{dia(c.fechaFin)}</td>
                  <td>
                    <Link to={`/campania/${c.id}`} className="button">
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="accion">
          <Link to="/menu" className="button">
            Volver
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BuscarCampania;
