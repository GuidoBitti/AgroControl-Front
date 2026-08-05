import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Ingresso</Link>
      <Link to="/record">Registro</Link>
      <Link to="/insumos">Insumos</Link>
    </nav>
  );
}

export default Navbar;
