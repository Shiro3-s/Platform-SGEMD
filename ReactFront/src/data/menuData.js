// src/data/menuData.js

// === Menú para Estudiante ===
export const ESTUDIANTE_MENU = [
  { name: "Diagnóstico", path: "/" },

  {
    name: "Perfil",
    submenus: [
      { name: "Información Personal", path: "/perfil" }
    ]
  },

  {
    name: "Emprendimientos",
    submenus: [
      { name: "Perfil de Emprendimiento", path: "/emprendimiento/perfil" },
      { name: "Inscripción", path: "/emprendimiento/inscripcion" }
    ]
  },

  { name: "Plan de Trabajo", path: "/plan" },
  { name: "Estado de Seguimiento", path: "/seguimiento" },

  { name: "Docentes", path: "/docentes" },
  { name: "Asesorías", path: "/asesorias" },

  {
    name: "Eventos",
    submenus: [
      { name: "Consultar Eventos", path: "/eventos" }
    ]
  }
];

// === Menú para Maestro ===
export const MAESTRO_MENU = [
  { name: "Dashboard", path: "/" },

  {
    name: "Perfil",
    submenus: [
      { name: "Mi Perfil", path: "/perfil" }
    ]
  },

  {
    name: "Emprendimientos",
    submenus: [
      { name: "Perfil", path: "/emprendimientos/perfil" },
      { name: "Seguimiento", path: "/emprendimientos/seguimiento" }
    ]
  },

  { name: "Mis Asesorías", path: "/asesorias" },
  { name: "Crear Asesoría", path: "/asesorias/crear" }
];

// === Menú para Administrador ===
export const ADMIN_MENU = [
  { name: "Dashboard", path: "/" },

  {
    name: "Mi Cuenta",
    submenus: [
      { name: "Perfil", path: "/perfil" }
    ]
  },

  {
    name: "Gestión",
    submenus: [
      { name: "Docentes", path: "/gestionar/docentes" },
      { name: "Estudiantes", path: "/gestionar/estudiantes" },
      { name: "Asignación de Docentes", path: "/gestionar/asignacion" }
    ]
  },

  { name: "Eventos", path: "/eventos" }
];
