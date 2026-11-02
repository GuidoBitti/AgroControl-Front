import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createLote } from '../../api/lote.ts';
import BackToMenu from '../../components/BackToMenu.js';
import './lotes.css';

function Lotes() {
  const [numero, setNumero] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [hectareas, setHectareas] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [savingLote, setSavingLote] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (
      ![numero, latitud, longitud, hectareas, descripcion].every(
        (value) => value.trim(),
      )
    ) {
      setError('Completá todos los campos para crear el lote.');
      return;
    }

    const numeroValue = Number(numero);
    const latitudValue = Number(latitud);
    const longitudValue = Number(longitud);
    const hectareasValue = Number(hectareas);
    if (!Number.isInteger(numeroValue) || numeroValue <= 0) {
      setError('El número de lote debe ser un entero mayor que cero.');
      return;
    }
    if (!Number.isFinite(latitudValue) || latitudValue < -90 || latitudValue > 90) {
      setError('La latitud debe estar entre -90 y 90.');
      return;
    }
    if (!Number.isFinite(longitudValue) || longitudValue < -180 || longitudValue > 180) {
      setError('La longitud debe estar entre -180 y 180.');
      return;
    }
    if (!Number.isInteger(hectareasValue) || hectareasValue <= 0) {
      setError('Las hectáreas deben ser un entero mayor que cero.');
      return;
    }

    setSavingLote(true);
    try {
      await createLote({
        numero: numeroValue,
        latitud: latitudValue,
        longitud: longitudValue,
        hectareas: hectareasValue,
        descripcion: descripcion.trim(),
      });
      setNumero('');
      setLatitud('');
      setLongitud('');
      setHectareas('');
      setDescripcion('');
      setNotice('Lote creado correctamente.');
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : 'No se pudo crear el lote.',
      );
    } finally {
      setSavingLote(false);
    }
  };

  return (
    <div className="Pagina">
      <div className="container lotes-page">
        <BackToMenu />
        <h2 className="title">LOTES</h2>
        {error && (
          <p className="lotes-feedback lotes-error" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="lotes-feedback lotes-success" role="status">
            {notice}
          </p>
        )}

        <section className="lotes-section">
          <h3>Ingresar lote</h3>
          <form onSubmit={handleSubmit}>
            <div className="lotes-form-grid">
              <label htmlFor="numero">
                Número de lote
                <input
                  type="number"
                  id="numero"
                  min={1}
                  step={1}
                  value={numero}
                  onChange={(event) => setNumero(event.target.value)}
                  required
                />
              </label>
              <label htmlFor="latitud">
                Latitud
                <input
                  type="number"
                  id="latitud"
                  min={-90}
                  max={90}
                  step="any"
                  value={latitud}
                  onChange={(event) => setLatitud(event.target.value)}
                  required
                />
              </label>
              <label htmlFor="longitud">
                Longitud
                <input
                  type="number"
                  id="longitud"
                  min={-180}
                  max={180}
                  step="any"
                  value={longitud}
                  onChange={(event) => setLongitud(event.target.value)}
                  required
                />
              </label>
              <label htmlFor="hectareas">
                Hectáreas
                <input
                  type="number"
                  id="hectareas"
                  min={1}
                  step={1}
                  value={hectareas}
                  onChange={(event) => setHectareas(event.target.value)}
                  required
                />
              </label>
              <label htmlFor="descripcion">
                Descripción
                <input
                  type="text"
                  id="descripcion"
                  value={descripcion}
                  onChange={(event) => setDescripcion(event.target.value)}
                  required
                />
              </label>
            </div>
            <p>
              ¿El lote ya existe? <Link to="/search-lote">Buscar Lote</Link>
            </p>
            <button type="submit" className="button" disabled={savingLote}>
              {savingLote ? 'Guardando...' : 'Crear lote'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Lotes;
