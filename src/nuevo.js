import Dropdown from 'react-bootstrap/Dropdown';
import { useAuth } from './AuthContext';
import { NavLink } from 'react-router-dom';

function BasicExample() {
  const buttonStyle = {
    color: 'white',
    marginLeft: '10px', // Ajusta el margen izquierdo como desees
  };

  const { logout, valorRol } = useAuth();

  const handleLogout = () => {
    logout();
  };


  return (
    <Dropdown>
      <Dropdown.Toggle style={buttonStyle} variant="transparent" id="dropdown-basic"> Usuario </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item as={NavLink} to="/Perfil">Perfil</Dropdown.Item>
        {valorRol === 0 && (
                    <Dropdown.Item as={NavLink} to="/Administrador" activeClassName="active">Administrador</Dropdown.Item>
                  )}
        <Dropdown.Item onClick={handleLogout}>Cerrar Sesion</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default BasicExample;

