import { Link } from 'react-router-dom';
import './BackToMenu.css';
import LogoutButton from './LogoutButton';

function BackToMenu() {
  return (
    <div className="page-actions">
      <Link to="/menu" className="back-to-menu">
        <span aria-hidden="true">←</span> Volver al menú
      </Link>
      <LogoutButton />
    </div>
  );
}

export default BackToMenu;