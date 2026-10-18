import './insumos.css';
import { useState } from 'react';
import { createInsumo } from '../../api/insumos';
import { Link } from 'react-router-dom';
import BackToMenu from '../../components/BackToMenu.js';

function Insumos() {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (![nombre, tipo, stock, descripcion].every((value) => value.trim())) {
      alert('Completá todos los campos.');
      return;
    }

    try {
      await createInsumo({ nombre, tipo, stock: Number(stock), descripcion });
      alert('Insumo guardado correctamente');

      setNombre('');
      setTipo('');
      setStock('');
      setDescripcion('');
    } catch (error) {
      console.error(error);
      alert('No se pudo guardar el insumo');
    }
  };

  return (
    <>
      <div className="container">
        <BackToMenu />
        <h2 className="title">INGRESO INSUMOS</h2>
        <form onSubmit={handleSubmit}>
          <div className="padre">
            <div className="nombre">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresa el nombre"
                required
              />
            </div>
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
            <div className="stock">
              <label htmlFor="stock">Stock (kg o litros):</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="stock"
                name="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Ingresa el stock"
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
          <br></br>
          <button type="submit" className="button">
            Guardar
          </button>
          <p>
            ¿Desea eliminar un insumo? {''}
            <Link to="/delete-insumos">Eliminar Insumo</Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Insumos;
