import React from 'react';
import NavBare from './Menu';
import Footer from './Footer';
import { Link } from 'react-router-dom';

function Administrador() {
    return ( 
        <div className="wrapper">
            <header>
                <NavBare className="navbar-footer" />
            </header>
            <div className='text-center'>
                <h2>Administrador</h2>
            </div>
            
            <Link to="/Inicio" className="btn btn-primary">Volver a Inicio</Link>
            <Link to="/RegistrarUsuario" className="btn btn-primary">Registrar Usuario</Link>
            <Link to="/GestionarUsuarios" className="btn btn-primary">Gestionar Usuarios</Link>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}
export default Administrador;