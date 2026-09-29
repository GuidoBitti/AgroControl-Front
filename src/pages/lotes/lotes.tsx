import { Link } from 'react-router-dom';
import './lotes.css';
import { useState } from 'react';

function Lotes() {
  const [numero, setNumero] = useState(0);
  const [tipoCultivo, setTipo] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [hectareas, setHectareas] = useState(0);
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Número:', numero);
    console.log('Tipo Cultivo:', tipoCultivo);
    console.log('Latitud:', lat);
    console.log('Longitud:', lng);
    console.log('Hectáreas:', hectareas);
    console.log('Descripción:', descripcion);
  };

  return (
    <>
      <div className="container">
        <h2 className="titulo">INGRESO LOTES</h2>
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
                onChange={(e) =>
                  setNumero(e.target.value.at(0) ? parseInt(e.target.value) : 0)
                }
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
              />

              <label htmlFor="lng">Longitud:</label>
              <input
                type="text"
                inputMode="decimal"
                id="lng"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="-58.3816"
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
                onChange={(e) =>
                  setHectareas(
                    e.target.value.at(0) ? parseInt(e.target.value) : 0,
                  )
                }
                placeholder="Ingresa las hectáreas"
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
              />
            </div>
          </div>
          <p>
            ¿El lote ya existe? <Link to="/search-lote">Buscar Lote</Link>
          </p>
          <button type="submit" className="button">
            Buscar
          </button>
        </form>
      </div>
    </>
  );
}

export default Lotes;
