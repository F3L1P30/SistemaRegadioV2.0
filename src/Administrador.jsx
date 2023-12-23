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
            <main className="content">
                <div className="container text-center">
                    <div className="mb-3">
                        <h2 className="title">Administrador</h2>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-md-7">
                            <div className="mb-3">
                                <Link to="/RegistrarUsuario" className="btn btn-primary btn-block" style={{ width: '50%' }}>Registrar Usuario</Link>
                            </div>
                            <div className="mb-3">
                                <Link to="/GestionarUsuarios" className="btn btn-primary btn-block" style={{ width: '50%' }}>Gestionar Usuarios</Link>
                            </div>
                            <div className="mb-3">
                                <Link to="/Inicio" className="btn btn-secondary btn-block" style={{ width: '50%' }}>Volver al Inicio</Link>
                            </div>
                        </div>
                    </div>
                </div> 
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    );
}
export default Administrador;