import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCampania, type Campania } from '../../api/campania';

function CampaniaDetalle() {
  const { id } = useParams();
  const [campania, setCampania] = useState<Campania | null>(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) return;

    getCampania(Number(id))
      .then(setCampania)
      .catch((err) => {
        console.error(err);
        setError('No se pudo cargar la campaña');
      })
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!campania) return <p>Campaña no encontrada.</p>;

  return (
    <div className="container">
      <h2 className="title">DETALLE DE CAMPAÑA</h2>

      <p>
        <strong>ID:</strong> {campania.id}
      </p>
      <p>
        <strong>Inicio:</strong> {campania.fechaInicio.slice(0, 10)}
      </p>
      <p>
        <strong>Fin:</strong> {campania.fechaFin.slice(0, 10)}
      </p>

      <h3>Lotes y cultivos</h3>
      {campania.LoteCampanias.length === 0 ? (
        <p>Esta campaña no tiene lotes asignados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Lote</th>
              <th>Cultivo</th>
            </tr>
          </thead>
          <tbody>
            {campania.LoteCampanias.map((lc) => (
              <tr key={lc.id}>
                <td>{lc.Lote.Cultivo?.nombre ?? 'Sin cultivo'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CampaniaDetalle;
