import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Ingresso</Link>
      <Link to="/record">Registro</Link>
      <Link to="/insumos">Insumos</Link>
      <Link to="/search-insumos">Buscar Insumos</Link>
      <Link to="/search-lote">Buscar Lotes</Link>
      <Link to="/lotes">Agregar Lotes</Link>
    </nav>
  );
}

export default Navbar;
