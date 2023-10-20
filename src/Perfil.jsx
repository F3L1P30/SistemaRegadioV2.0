import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function Perfil() {
    const [usuario, setUsuario] = useState(null);
  
    useEffect(() => {
      // Obtener el usuario almacenado en localStorage
      const usuarioAlmacenado = JSON.parse(localStorage.getItem('authUser'));
      if (usuarioAlmacenado) {
        setUsuario(usuarioAlmacenado);
      }
    }, []);
  
    return (
      <div>
        <Menu/>
            <Tabs defaultActiveKey="profile" id="fill-tab-example" className="mb-3" fill>
            <Tab eventKey="home" title="Home">
                Tab content for Home
            </Tab>
            <Tab eventKey="profile" title="Profile">
                Tab content for Profile
            </Tab>
            </Tabs>
      </div>
    );
}

export default Perfil;