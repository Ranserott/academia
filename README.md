# TechAcademy - Plataforma de Educación Online

TechAcademy es una plataforma moderna de educación tecnológica diseñada para ofrecer cursos de alta calidad en desarrollo web, ciencia de datos, diseño UX y más. El proyecto cuenta con un ecosistema completo para visitantes, estudiantes y administradores.

## 🚀 Tecnologías Utilizadas

- **Next.js 15+** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (Diseño moderno y utilitario)
- **Lucide React** (Iconografía)

## 🛠️ Estructura del Proyecto

### Componentes del Sistema (`/components`)

- **UI Base**:
    - `Button.tsx`: Componente de botón flexible y reutilizable.
    - `Input.tsx`: Componente de entrada con soporte para estados de error.
- **Landing Page**:
    - `Navbar.tsx`, `Hero.tsx`, `Benefits.tsx`, `Roadmap.tsx`, `Courses.tsx`, `Testimonials.tsx`, `Footer.tsx`.
- **Panel de Administración (`/admin`)**:
    - `AdminSidebar.tsx`: Navegación lateral con gestión de roles.
    - `AdminHeader.tsx`: Encabezado con búsqueda y notificaciones.
    - `StatsCard.tsx`: Visualización de métricas y KPIs.
    - `CourseTable.tsx`: Tabla avanzada de gestión de cursos.
- **Panel del Estudiante (`/student`)**:
    - `StudentSidebar.tsx`: Navegación personalizada "EduSaaS".
    - `StudentDashboard.tsx`: Vista principal con progreso y actividad semanal.

### Rutas de la Aplicación (`/app`)

#### 🌐 Público
- `/`: Landing page principal.
- `/cursos`: Catálogo completo con filtrado avanzado (categoría, nivel, precio).
- `/cursos/[id]`: Detalle del curso, currículum y vista previa.
- `/login` / `/register`: Autenticación de usuarios.

#### 👨‍🎓 Estudiante (Dashboard)
- `/dashboard`: Resumen de actividad, progreso y recomendaciones.
- `/dashboard/courses`: Grid de cursos inscritos y favoritos.
- `/dashboard/paths`: Rutas de aprendizaje y roadmaps interactivos.
- `/dashboard/certificates`: Gestión y descarga de certificados obtenidos.
- `/dashboard/profile`: Ajustes de cuenta y perfil público.

#### 🔐 Administrador (Admin Panel)
- `/admin`: Dashboard global con métricas de ingresos y ventas.
- `/admin/courses`: Control total del catálogo de cursos.
- `/admin/students`: Gestión de alumnos y seguimiento de inscripciones.
- `/admin/analytics`: Análisis avanzado de rendimiento y engagement.

## 🎨 Características de Diseño
- **Premium Dark Theme**: Estética moderna basada en `slate-950` y acentos azules.
- **Glassmorphism**: Uso extensivo de `backdrop-blur` y bordes sutiles.
- **Visualización de Datos**: Gráficos personalizados y KPIs interactivos.
- **Totalmente Responsivo**: Adaptado para móviles, tablets y escritorio.

## 🏁 Cómo empezar

1.  Instala las dependencias:
    ```bash
    npm install
    ```

2.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

3.  Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---
© 2024 TechAcademy Inc. Proyecto desarrollado con pasión por la educación tecnológica.
