
import { useAuth } from './AuthContext';
import React from 'react';
import Menu from './Menu';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function Perfil() {
    const { user } = useAuth();
    const tipoDeUsuario = () => {
        if (user.rol === 0) {
            return 'administrador';
        } else {
            return 'usuario';
        }
    };

    return (
        <div className="wrapper">
            <Menu/>
            <main className="content">
                <div className="container text-center">
                    <h1 className="title">Perfil</h1>
                    <div>
                        <p>Nombre: {user.nombre}</p>
                        <p>Apellidos: {user.apellidos}</p>
                        <p>Tipo de usuario: {tipoDeUsuario()}</p>
                        <p>Sistema: {user.id_sistema}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Perfil;