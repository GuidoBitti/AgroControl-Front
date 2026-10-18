import { Link, useNavigate } from 'react-router-dom';
import { useEffect,useState } from 'react';
import './record.css';
import { createUsuario } from '../../api/usuario.ts';
import { fetchWithAuth } from '../../api/fetchWithAuth.ts';
import type { Rol } from '../../api/rol.ts';
import BackToMenu from '../../components/BackToMenu';

const API_URL = import.meta.env.VITE_API_URL

type FormField = 'nombre' | 'apellido' | 'correo' | 'contraseña' | 'telefono' | 'direccion' | 'nacimiento' | 'rolId';

const validateField = (field: FormField, value: string | number): string => {
  if (field === 'rolId') {
    return value === 0 ? 'Seleccioná un rol.' : '';
  }

  const text = String(value).trim();
  if (!text) {
    const labels: Record<Exclude<FormField, 'rolId'>, string> = {
      nombre: 'El nombre es obligatorio.',
      apellido: 'El apellido es obligatorio.',
      correo: 'El correo es obligatorio.',
      contraseña: 'La contraseña es obligatoria.',
      telefono: 'El teléfono es obligatorio.',
      direccion: 'La dirección es obligatoria.',
      nacimiento: 'La fecha de nacimiento es obligatoria.',
    };
    return labels[field];
  }

  if (field === 'correo' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
    return 'Ingresá un correo válido.';
  }

  return '';
};

function Record() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [nacimiento, setNacimiento] = useState('');
  const [error, setError] = useState<string>('');
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Rol[]>([])
  const [rolId, setRolId] = useState(0);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        console.log()
        const response = await fetchWithAuth(`${API_URL}/rol`)
        const data = await response.json()
        setRoles(data)
      } catch (error) {
        console.error('Error al cargar roles:', error)
      }
    }

    fetchRoles()
  }, [])

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const values: Record<FormField, string | number> = {
      nombre,
      apellido,
      correo,
      contraseña,
      telefono,
      direccion,
      nacimiento,
      rolId,
    };
    const nextErrors: Partial<Record<FormField, string>> = {};
    for (const field of Object.keys(values) as FormField[]) {
      const message = validateField(field, values[field]);
      if (message) nextErrors[field] = message;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await createUsuario({
        nombre,
        apellido,
        email: correo,
        password: contraseña,
        telefono: telefono,
        direccion,
        fechaNacimiento: nacimiento,
        rolId: rolId,
        //organizacion: 1, // Asignar un valor predeterminado para la organización
      });
      navigate('/');
    } catch (error) {
      console.log(error)
      setError(error instanceof Error ? error.message : 'Error al registrar el usuario');
    }
  };

  return (
    <>
      <div className="container">
        <BackToMenu />
        <h2 className="title">REGISTRO USUARIO</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="padre">
            <div className="nombre">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (errors.nombre) setErrors((current) => ({ ...current, nombre: validateField('nombre', e.target.value) }));
                }}
                onBlur={() => setErrors((current) => ({ ...current, nombre: validateField('nombre', nombre) }))}
                aria-invalid={Boolean(errors.nombre)}
                aria-describedby="nombre-error"
                placeholder="Ingresa tu nombre"
                required
              />
              {errors.nombre && <span className="field-error" id="nombre-error">{errors.nombre}</span>}
            </div>
            <div className="apellido">
              <label htmlFor="apellido">Apellido:</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={apellido}
                onChange={(e) => {
                  setApellido(e.target.value);
                  if (errors.apellido) setErrors((current) => ({ ...current, apellido: validateField('apellido', e.target.value) }));
                }}
                onBlur={() => setErrors((current) => ({ ...current, apellido: validateField('apellido', apellido) }))}
                aria-invalid={Boolean(errors.apellido)}
                aria-describedby="apellido-error"
                placeholder="Ingresa tu apellido"
                required
              />
              {errors.apellido && <span className="field-error" id="apellido-error">{errors.apellido}</span>}
            </div>
            <div className="correo">
              <label htmlFor="correo">Correo:</label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  if (errors.correo) setErrors((current) => ({ ...current, correo: validateField('correo', e.target.value) }));
                }}
                onBlur={() => setErrors((current) => ({ ...current, correo: validateField('correo', correo) }))}
                aria-invalid={Boolean(errors.correo)}
                aria-describedby="correo-error"
                placeholder="Ingresa tu correo"
                required
              />
              {errors.correo && <span className="field-error" id="correo-error">{errors.correo}</span>}
            </div>
            <div className="contraseña">
              <label htmlFor="contraseña">Contraseña:</label>
              <input
                type="password"
                id="contraseña"
                name="contraseña"
                value={contraseña}
                onChange={(e) => {
                  setContraseña(e.target.value);
                  if (errors.contraseña) setErrors((current) => ({ ...current, contraseña: validateField('contraseña', e.target.value) }));
                }}
                onBlur={() => setErrors((current) => ({ ...current, contraseña: validateField('contraseña', contraseña) }))}
                aria-invalid={Boolean(errors.contraseña)}
                aria-describedby="contraseña-error"
                placeholder="Ingresa tu contraseña"
                required
              />
              {errors.contraseña && <span className="field-error" id="contraseña-error">{errors.contraseña}</span>}
            </div>
            <div className="telefono">
              <label htmlFor="telefono">Teléfono:</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={telefono}
                onChange={(e) => {
                  setTelefono(e.target.value);
                  if (errors.telefono) setErrors((current) => ({ ...current, telefono: validateField('telefono', e.target.value) }));
                }}
                onBlur={() => setErrors((current) => ({ ...current, telefono: validateField('telefono', telefono) }))}
                aria-invalid={Boolean(errors.telefono)}
                aria-describedby="telefono-error"
                placeholder="Ingresa tu teléfono"
                required
              />
              {errors.telefono && <span className="field-error" id="telefono-error">{errors.telefono}</span>}
            </div>
            <div className="direccion">
              <label htmlFor="direccion">Dirección:</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={direccion}
                onChange={(e) => {
                  setDireccion(e.target.value);
                  if (errors.direccion) setErrors((current) => ({ ...current, direccion: validateField('direccion', e.target.value) }));
                }}
                onBlur={() => setErrors((current) => ({ ...current, direccion: validateField('direccion', direccion) }))}
                aria-invalid={Boolean(errors.direccion)}
                aria-describedby="direccion-error"
                placeholder="Ingresa tu dirección"
                required
              />
              {errors.direccion && <span className="field-error" id="direccion-error">{errors.direccion}</span>}
            </div>
            <div className="nacimiento">
              <label htmlFor="nacimiento">Fecha de Nacimiento:</label>
              <input
                type="date"
                id="nacimiento"
                name="nacimiento"
                value={nacimiento}
                onChange={(e) => {
                  setNacimiento(e.target.value);
                  if (errors.nacimiento) setErrors((current) => ({ ...current, nacimiento: validateField('nacimiento', e.target.value) }));
                }}
                onBlur={() => setErrors((current) => ({ ...current, nacimiento: validateField('nacimiento', nacimiento) }))}
                aria-invalid={Boolean(errors.nacimiento)}
                aria-describedby="nacimiento-error"
                placeholder="Selecciona tu fecha de nacimiento"
                required
              />
              {errors.nacimiento && <span className="field-error" id="nacimiento-error">{errors.nacimiento}</span>}
            </div>
            <div className="rol">
              <label htmlFor="rol">Rol:</label>
              <select
                id="rol"
                value={rolId}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setRolId(value);
                  if (errors.rolId) setErrors((current) => ({ ...current, rolId: validateField('rolId', value) }));
                }}
                onBlur={() => setErrors((current) => ({ ...current, rolId: validateField('rolId', rolId) }))}
                aria-invalid={Boolean(errors.rolId)}
                aria-describedby="rol-error"
                required
              >
                <option value={0} disabled>
                  Seleccioná un rol
                </option>
                {roles.map((rol: Rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.descripcion}
                  </option>
                ))}
              </select>
              {errors.rolId && <span className="field-error" id="rol-error">{errors.rolId}</span>}
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}
            <p>
              ¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link>
            </p>
            <button type="submit" className="button">
              Registrar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Record;
