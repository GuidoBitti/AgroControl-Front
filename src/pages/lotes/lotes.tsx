import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createLote } from '../../api/lote.ts';
import BackToMenu from '../../components/BackToMenu.js';
import './lotes.css';

function Lotes() {
  const [numero, setNumero] = useState('');
  const [tipoCultivo, setTipo] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [hectareas, setHectareas] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (![numero, tipoCultivo, lat, lng, hectareas, descripcion].every((value) => value.trim())) {
      alert('Completá todos los campos.');
      return;
    }

    try {
      await createLote({
        numero: Number(numero),
        tipo: tipoCultivo,
        latitud: Number(lat),
        longitud: Number(lng),
        hectareas: Number(hectareas),
        descripcion,
      });

      alert('Lote creado correctamente');

      setNumero('');
      setTipo('');
      setLat('');
      setLng('');
      setHectareas('');
      setDescripcion('');
    } catch (error) {
      console.error(error);
      alert('Error al crear el lote');
    }
  };

  return (
    <>
      <div className="container">
        <BackToMenu />
        <h1 className="title">INGRESO LOTES</h1>
        <form onSubmit={handleSubmit}>
          <div className="padre">
            <div className="numero">
              <label htmlFor="numero">Número:</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="numero"
                name="numero"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ingresa el número"
                required
              />
            </div>
            <div className="tipo">
              <label htmlFor="tipo">Tipo Cultivo:</label>
              <input
                type="text"
                id="tipo"
                name="tipo"
                value={tipoCultivo}
                onChange={(e) => setTipo(e.target.value)}
                placeholder="Ingresa el tipo de cultivo"
                required
              />
            </div>
            <div className="ubicacion">
              <label htmlFor="lat">Latitud:</label>
              <input
                type="text"
                inputMode="decimal"
                id="lat"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="-34.6037"
                required
              />

              <label htmlFor="lng">Longitud:</label>
              <input
                type="text"
                inputMode="decimal"
                id="lng"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="-58.3816"
                required
              />
            </div>
            <div className="hectareas">
              <label htmlFor="hectareas">Cantidad de hectáreas:</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="hectareas"
                value={hectareas}
                onChange={(e) => setHectareas(e.target.value)}
                placeholder="Ingresa las hectáreas"
                required
              />
            </div>
            <div className="descripcion">
              <label htmlFor="descripcion">Descripción:</label>
              <input
                type="text"
                id="descripcion"
                name="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ingresa la descripción"
                required
              />
            </div>
          </div>
          <p>
            ¿El lote ya existe? <Link to="/search-lote">Buscar Lote</Link>
          </p>
          <button type="submit" className="button">
            Crear Lote
          </button>
        </form>
      </div>
    </>
  );
}

export default Lotes;
