// src/data/menuData.js

// === Menú para Emprendedor ===
export const Emprendedor_MENU = [
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

  { name: "Asesores", path: "/asesores" },
  { name: "Asesorías", path: "/asesorias" },

  {
    name: "Eventos",
    submenus: [
      { name: "Consultar Eventos", path: "/eventos" }
    ]
  }
];

// === Menú para Asesor ===
export const Asesor_MENU = [
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
      { name: "Asesores", path: "/gestionar/asesores" },
      { name: "Emprendedores", path: "/gestionar/emprendedores" },
      { name: "Asignación de Asesores", path: "/gestionar/asignacion" }
    ]
  },

  { name: "Eventos", path: "/eventos" }
];



