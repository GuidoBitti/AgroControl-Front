import './insumos.css';
import { useState } from 'react';

function Insumos() {
  const [codigo, setCodigo] = useState(0);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [stock, setStock] = useState(0);
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Código:', codigo);
    console.log('Nombre:', nombre);
    console.log('Tipo:', tipo);
    console.log('Stock:', stock);
    console.log('Descripción:', descripcion);
  };

  return (
    <>
      <div className="container">
        <h2 className="titulo">INGRESO INSUMOS</h2>
        <form onSubmit={handleSubmit}>
          <div className="padre">
            <div className="codigo">
              <label htmlFor="codigo">Código:</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="codigo"
                name="codigo"
                value={codigo}
                onChange={(e) =>
                  setCodigo(e.target.value.at(0) ? parseInt(e.target.value) : 0)
                }
                placeholder="Ingresa el código"
                required
              />
            </div>
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
              <label htmlFor="stock">Stock:</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="stock"
                name="stock"
                value={stock}
                onChange={(e) =>
                  setStock(e.target.value ? parseInt(e.target.value) : 0)
                }
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
              />
            </div>
          </div>
          <br></br>
          <button type="submit" className="button">
            Guardar
          </button>
        </form>
      </div>
    </>
  );
}

export default Insumos;
