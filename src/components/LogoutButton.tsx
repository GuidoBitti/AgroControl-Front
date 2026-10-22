import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogoutButton.css';

function LogoutButton() {
  const [confirming, setConfirming] = useState(false);
  const navigate = useNavigate();

  function closeSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userNombre');
    localStorage.removeItem('userApellido');
    navigate('/', { replace: true });
  }

  return (
    <>
      <button
        className="logout-button"
        type="button"
        onClick={() => setConfirming(true)}
      >
        Cerrar sesión
      </button>
      {confirming && (
        <div className="logout-dialog-backdrop">
          <section
            className="logout-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
            aria-describedby="logout-dialog-description"
          >
            <h2 id="logout-dialog-title">¿Estás seguro?</h2>
            <p id="logout-dialog-description">¿Querés cerrar sesión?</p>
            <div className="logout-dialog-actions">
              <button type="button" className="logout-cancel" onClick={() => setConfirming(false)}>
                Cancelar
              </button>
              <button type="button" onClick={closeSession}>
                Cerrar sesión
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default LogoutButton;
