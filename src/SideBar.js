import React from 'react';
import * as FiIcons from 'react-icons/fi';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from "react-icons/bi";
import * as Icons5 from "react-icons/io5";

export const SidebarData = [
  {
    title: 'Inicio',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Contacto',
    path: '/Contacto',
    icon: <BiIcons.BiSolidContact/>,
    cName: 'nav-text'
  },
  {
    title: 'Medidores',
    path: '/Medidor',
    icon: <Icons5.IoSpeedometerSharp/>,
    cName: 'nav-text'
  },
  {
    title: 'Geolocalización',
    path: '/Geo',
    icon: <Icons5.IoLocationSharp/>,
    cName: 'nav-text'
  },
  {
    title: 'Válvula',
    path: '/Valvula',
    icon: <Icons5.IoLocationSharp/>,
    cName: 'nav-text'
  },
  {
    title: 'Configuracion',
    path: '/Perfil',
    icon: <FiIcons.FiSettings />,
    cName: 'nav-text'
  },
  {
    title: 'Cerrar sesión',
    path: '/InicioSesion',
    icon: <BiIcons.BiExit />,
    cName: 'nav-text'
  }
];