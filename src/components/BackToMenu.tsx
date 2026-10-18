import { Link } from 'react-router-dom';
import './BackToMenu.css';

function BackToMenu() {
  return (
    <Link to="/menu" className="back-to-menu">
      <span aria-hidden="true">←</span> Volver al menú
    </Link>
  );
}

export default BackToMenu;