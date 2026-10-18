import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createLote } from '../../api/lote.ts';
import BackToMenu from '../../components/BackToMenu.js';
import './lotes.css';

function Lotes() {
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (![tipo, descripcion].every((value) => value.trim())) {
      alert('Completá todos los campos.');
      return;
    }

    try {
      await createLote({
        tipo: tipo.trim(),
        descripcion,
      });

      alert('Lote creado correctamente');

      setTipo('');
      setDescripcion('');
    } catch (error) {
      console.error(error);
      alert('Error al crear el lote');
    }
  };

  return (
    <div className="Pagina">
      <div className="container">
        <BackToMenu />
        <h2 className="title">INGRESO LOTES</h2>
        <form onSubmit={handleSubmit}>
          <div className="padre">
            <div className="tipo">
              <label htmlFor="tipo">Tipo:</label>
              <input
                type="text"
                id="tipo"
                name="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                placeholder="Ingresa el tipo"
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
    </div>
  );
}

export default Lotes;
