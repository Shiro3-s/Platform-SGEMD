// src/components/EstudianteSidebar.jsx (Limpio)

import React from 'react';
// Importamos el componente genérico que hace todo el trabajo
import SidebarGeneric from './SidebarGeneric'; 
// Importamos los datos del menú del estudiante
import { ESTUDIANTE_MENU } from '../data/menuData'; 

const EstudianteSidebar = () => {
    // La única cosa que hace este componente es renderizar el genérico con sus props.
    return (
        <SidebarGeneric
            basePath="/estudiante"
            menuData={ESTUDIANTE_MENU}
            roleClass="sidebar" // Clase CSS definida en Estudiante.css
            // logoText="SGEP - Estudiante" 
        />
    );
};

export default EstudianteSidebar;