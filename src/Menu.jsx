import React, { useState } from 'react';
import * as HiIcons from 'react-icons/hi2';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './SideBar';
import './Navbar.css';
import logo from './logo/Recurso-1.png';
import { IconContext } from 'react-icons';
import Perfil from './nuevo';

function Menu() {
  const [sidebar, setSidebar] = useState(false);
  const [menuContraido, setMenuContraido] = useState(false);

  const showSidebar = () => {
    setSidebar(!sidebar);
    setMenuContraido(!menuContraido);
  };

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className={`navbar ${menuContraido ? 'navbar-contraido' : ''}`}>
          <Link to='#' className='menu-bars'>
            <HiIcons.HiBars3 onClick={showSidebar} />
            <img src={logo} alt="Logo" className="navbar-logo" />
          </Link>
          <Perfil></Perfil>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className={`nav-menu-items ${menuContraido ? 'nav-menu-contraido' : ''}`} onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose/>
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Menu;