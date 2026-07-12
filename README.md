# Banco de Alimentos MVP — Backend

API REST para la gestión integral de un banco de alimentos: control de inventario, registro de donantes y beneficiarios, seguimiento de donaciones y entregas, reportes operativos y un dashboard de estadísticas. Construida con Node.js, Express y PostgreSQL.

## Stack técnico

- **Runtime:** Node.js
- **Framework:** Express 5
- **Base de datos:** PostgreSQL
- **ORM:** Sequelize
- **Autenticación:** JSON Web Tokens (JWT) + bcrypt.js para el hash de contraseñas
- **Otros:** CORS, dotenv, Nodemon (entorno de desarrollo)
- **Despliegue:** Render (backend) — conectado a un frontend en React desplegado en Vercel

## Funcionalidades principales

- **Autenticación y roles**: login con JWT, roles `administrador` y `voluntario`, rutas protegidas por token y por rol.
- **Gestión de inventario**: alta, edición y baja de productos, clasificados como perecederos o no perecederos, con fecha de vencimiento y estado.
- **Donantes y donaciones**: registro de donantes, donaciones asociadas a uno o varios productos, incluyendo un endpoint público para recibir donaciones sin necesidad de autenticación.
- **Beneficiarios y entregas**: registro de beneficiarios y entregas de productos vinculadas a cada uno.
- **Reportes**: productos próximos a vencer, stock bajo, donaciones por donante, entregas por beneficiario y resumen general.
- **Dashboard**: estadísticas agregadas (totales en stock, productos por vencer/vencidos, productos por categoría, donaciones por mes, entregas por beneficiario).

## Modelo de datos

| Entidad | Descripción | Relaciones |
|---|---|---|
| `Usuario` | Administradores y voluntarios que operan el sistema | Tiene muchas `Donacion` |
| `Donante` | Personas u organizaciones que donan alimentos | Tiene muchas `Donacion` |
| `Producto` | Ítems de inventario (perecedero / no perecedero) | Muchos a muchos con `Donacion` y `Entrega` |
| `Beneficiario` | Personas u organizaciones que reciben alimentos | Tiene muchas `Entrega` |
| `Donacion` | Regiqstro de una donación, con productos asociados | Pertenece a `Usuario` y `Donante`; muchos a muchos con `Producto` |
| `Entrega` | Registro de una entrega, con productos asociados | Pertenece a `Beneficiario`; muchos a muchos con `Producto` |

## Endpoints principales

Todas las rutas cuelgan del prefijo `/api`.

**Autenticación** — `/api/auth`
| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/login` | Inicia sesión y devuelve un JWT | Público |
| POST | `/registrar` | Crea un nuevo usuario | Solo administrador |
| GET | `/perfil` | Devuelve el perfil del usuario autenticado | Autenticado |
| PUT | `/perfil` | Actualiza nombre/teléfono del usuario autenticado | Autenticado |
| PUT | `/cambiar-password` | Cambia la contraseña del usuario autenticado | Autenticado |

**Recursos** (patrón CRUD estándar: `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`)
| Recurso | Ruta base | Notas |
|---|---|---|
| Productos | `/api/productos` | Incluye `GET /por-vencer` |
| Donantes | `/api/donantes` | — |
| Beneficiarios | `/api/beneficiarios` | — |
| Donaciones | `/api/donaciones` | Incluye `POST /public` (donación sin autenticación) |
| Entregas | `/api/entregas` | — |
| Usuarios | `/api/usuarios` | Solo administrador |

**Reportes** — `/api/reportes`
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/resumen` | Resumen general del sistema |
| GET | `/productos-por-vencer` | Filtra por próximos N días (`?dias=`) |
| GET | `/stock-bajo` | Productos con inventario bajo |
| GET | `/donaciones-por-donante` | Totales agrupados por donante |
| GET | `/entregas-por-beneficiario` | Totales agrupados por beneficiario |

**Dashboard** — `/api/dashboard` (requiere autenticación)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/estadisticas` | Totales de stock, productos por vencer y vencidos |
| GET | `/productos-por-categoria` | Distribución de inventario por categoría |
| GET | `/donaciones-por-mes` | Serie temporal de donaciones |
| GET | `/entregas-por-beneficiario` | Entregas agregadas por beneficiario |

##  Variables de entorno

Crea un archivo `.env` en la raíz con:

```
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=5432
JWT_SECRET=
PORT=3000
```

> El proyecto detecta automáticamente si la base de datos está alojada en Aiven Cloud (`DB_HOST` contiene `aivencloud.com`) y activa SSL en ese caso.

## Instalación y uso local

```bash
# Clonar el repositorio
git clone https://github.com/VivineyD1az/Banco_de_Alimentos_Back.git
cd Banco_de_Alimentos_Back

# Instalar dependencias
npm install

# Configurar variables de entorno (ver sección anterior)
cp .env.example .env

# Levantar el servidor en modo desarrollo (con recarga automática)
npm run dev

# O en modo producción
npm start
```

El servidor queda disponible en `http://localhost:3000`.

### Poblar la base de datos con datos de prueba

```bash
node seed.js
```

Esto crea usuarios, productos, donantes y donaciones de ejemplo, incluyendo un usuario administrador (`admin@bancoalimentos.org`) para probar las rutas protegidas.

## Despliegue

- **Backend:** desplegado en [Render](https://render.com). Enlace desplegado: https://banco-de-alimentos-back.onrender.com/
- **Frontend:** desplegado en [Vercel](https://vercel.com), consumiendo esta API. Enlace desplegado: https://banco-alimentos.vercel.app/

##  Créditos

Proyecto académico desarrollado en equipo como sistema de gestión para bancos de alimentos.

- Implementación de autenticación (JWT), controladores centrales del negocio (donaciones, beneficiarios, entregas, inventario y reportes) y modelado de datos en Sequelize: **Daniel Guerra**
- Configuración inicial del proyecto: conexión a base de datos, middleware de autenticación y modelos base (Usuario, Donante, Producto): **Viviney Diaz**
— Modelo y controlador de Entrega, relación EntregaProducto, modelo de Beneficiario e integración de Pull Requests: **Ana Bojato**
  
Notas
Este es un proyecto académico (MVP) sin datos ni usuarios reales en producción.
