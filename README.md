# create-tpexpress

```
████████╗██████╗ ███████╗██╗  ██╗██████╗ ██████╗ ███████╗███████╗███████╗
╚══██╔══╝██╔══██╗██╔════╝╚██╗██╔╝██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝
   ██║   ██████╔╝█████╗   ╚███╔╝ ██████╔╝██████╔╝█████╗  ███████╗███████╗
   ██║   ██╔═══╝ ██╔══╝   ██╔██╗ ██╔═══╝ ██╔══██╗██╔══╝  ╚════██║╚════██║
   ██║   ██║     ███████╗██╔╝ ██╗██║     ██║  ██║███████╗███████║███████║
   ╚═╝   ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝
```

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)

[![npm version](https://badge.fury.io/js/create-tpexpress.svg)](https://www.npmjs.com/package/create-tpexpress)
[![npm](https://img.shields.io/npm/dt/create-tpexpress.svg)](https://www.npmjs.com/package/create-tpexpress)
[![GitHub license](https://img.shields.io/github/license/imvikashkk/create-tpexpress.svg)](https://github.com/imvikashkk/create-tpexpress/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/imvikashkk/create-tpexpress.svg?style=social&label=Star)](https://github.com/imvikashkk/create-tpexpress/stargazers/)

**The fastest way to scaffold a modern TypeScript + Node.js + Express.js project**

_Production-ready boilerplate with batteries included_ 🚀

</div>

---

## 🚀 Quick Start

### Create a new project

```bash
    npm create tpexpress@latest

```

OR

```bash
npm create tpexpress@latest my-awesome-project
cd my-awesome-project
```

### Development mode (with hot reload)

```bash
# Setup environment variables
.env setup

# Start development server
npm run dev
```

### Production mode

```bash
# Build the project
npm run build

# Start production server
npm run start
```

---

## ✨ What's Included

### 🔧 **Core Technologies**

- 🔥 **TypeScript** - Full TypeScript support with strict configuration
- ⚡ **Express.js** - Fast, unopinionated web framework
- 🚀 **Node.js** - JavaScript runtime built on Chrome's V8 engine

### 🛠️ **Development Experience**

- ⚡ **Fast Development** - Hot reload with `tsx` for instant feedback
- 📏 **Code Quality** - ESLint with TypeScript rules
- 🔍 **Type Checking** - Strict TypeScript configuration
- 🪝 **Git Hooks** - Pre-commit hooks with Husky
- 🧹 **Clean Scripts** - Comprehensive npm scripts for all tasks

### 🗄️ **Database Options** (Choose what fits your needs)

- **Drizzle ORM** with PostgreSQL - Type-safe SQL toolkit
- **Mongoose ODM** with MongoDB - Elegant MongoDB object modeling
- **Prisma ORM** with PostgreSQL - Next-generation ORM
- **Raw PostgreSQL** - Direct database connection

### 💾 **In-Memory Database**

- **Redis** - For caching and session storage with `connect-redis`

### 📦 **Essential Packages with Demo Implementation**

#### Security & Performance

- 🛡️ **helmet** - Security middleware for Express
- 🚦 **cors** - Cross-Origin Resource Sharing
- ⏱️ **express-rate-limit** - Rate limiting middleware
- 🐌 **express-slow-down** - Gradual response delay
- 🔐 **bcrypt** - Password hashing

#### Session & Authentication

- 🔑 **express-session** - Session middleware
- 🍪 **cookie-parser** - Parse cookies
- 🎟️ **jsonwebtoken** - JWT implementation
- 🌐 **connect-redis** - Redis session store

#### Utilities & Validation

- ✅ **zod** - TypeScript-first schema validation
- 📡 **axios** - HTTP client
- 🌍 **geoip-lite** - IP geolocation
- 🎨 **ejs** - Embedded JavaScript templating
- 📝 **morgan** - HTTP request logger

### ⚙️ **Modern Setup Features**

- 📦 **ES Modules** - Modern JavaScript module system
- 🔄 **@ alias imports** - Import from `@/` instead of `../../../`
- 🌍 **Environment files** - `.env` configuration
- 🏗️ **tsc-alias** - Path mapping for compiled JavaScript
- 🔥 **tsx** - Fast TypeScript execution for development
- 🏭 **tsc** - TypeScript compiler for production builds

---

## 📋 System Requirements

| Requirement | Version     |
| ----------- | ----------- |
| **Node.js** | `v22.0.0` + |
| **npm**     | `10.0.0` +  |

---

## 📚 Project Structure (4 Database Options)

Choose your preferred database setup from these professionally configured options:

- **Drizzle ORM** with PostgreSQL - Modern, type-safe SQL toolkit with excellent TypeScript integration
- **Mongoose ODM** with MongoDB - Feature-rich MongoDB object modeling with built-in validation
- **Prisma ORM** with PostgreSQL - Auto-generated type-safe client with powerful migration system
- **Raw PostgreSQL** - Direct database connection for maximum control and performance

```
my-awesome-project/
├── .husky/                             # Git hooks automation
│   └── pre-commit                      # Pre-commit linting and formatting checks
├── dist/                               # Compiled TypeScript output (production build)
├── prisma/                             # 🔹 Prisma ORM configuration (Prisma setup only)
│   ├── migrations/                     # Database schema migration history
│   └── schema.prisma                   # Database schema definition and client config
├── public/                             # Static assets served directly by Express
├── src/                                # Main application source code
│   ├── config/                         # Application configuration and database connections
│   │   ├── dbs/                        # Database connection configurations
│   │   │   ├── drizzlepgsql.ts         # 🔹 Drizzle ORM + PostgreSQL setup
│   │   │   ├── mongo.ts                # 🔹 MongoDB connection with Mongoose
│   │   │   ├── prismapgsql.ts          # 🔹 Prisma client initialization
│   │   │   └── pgsql.ts                # 🔹 Raw PostgreSQL connection pool
│   │   └── redis.ts                    # Redis cache configuration
│   │   └── env.ts                      # Environment variables validation and parsing
│   ├── controllers/                    # Request handlers and business logic orchestration
│   │   └── userControllers.ts          # User-related HTTP request controllers
│   ├── drizzle/                        # 🔹 Drizzle ORM specific files (Drizzle setup only)
│   │   ├── meta/                       # Migration metadata and state tracking
│   │   └── schema.ts                   # Database schema definitions with TypeScript types
│   ├── lib/                            # Core utility libraries and common functionality
│   │   ├── AppError.ts                 # Custom application error classes
│   │   ├── callBy.ts                   # Function caller identification utility
│   │   ├── callFrom.ts                 # Request origin tracking utility
│   │   ├── globalErrorHandler.ts       # Centralized error handling middleware
│   │   ├── HttpStatusCode.ts           # HTTP status code constants and helpers
│   │   ├── InvalidateCache.ts          # Cache invalidation strategies
│   │   └── notFoundHandler.ts          # 404 error handling middleware
│   ├── middlewares/                    # Express middleware functions
│   │   ├── auth/                       # Authentication and authorization
│   │   │   └── AuthenticateUser.ts     # JWT token validation and user verification
│   │   ├── log/                        # Request logging and monitoring
│   │   │   └── morgan.ts               # HTTP request logger configuration
│   │   └── security/                   # Security-focused middleware
│   │       ├── cors.ts                 # Cross-Origin Resource Sharing configuration
│   │       ├── helmet.ts               # Security headers and protection
│   │       ├── ratelimiter.ts          # API rate limiting and abuse prevention
│   │       ├── session.ts              # Session management and storage
│   │       └── slowdowner.ts           # Request throttling for DDoS protection
│   ├── model/                          # 🔹 Database models (Mongoose/MongoDB only)
│   │   └── User.ts                     # User schema and model definitions
│   ├── routes/                         # API endpoint definitions and routing
│   │   ├── RouteManager.ts             # Centralized route registration and management
│   │   └── userRoute.ts                # User-related API endpoints
│   ├── services/                       # Business logic and data access layer
│   │   └── userServices.ts             # User-related business operations
│   ├── types/                          # TypeScript type definitions and extensions
│   │   ├── express-session.d.ts        # Session object type extensions
│   │   ├── express.d.ts                # Express request/response type extensions
│   │   └── global.d.ts                 # Global type declarations
│   ├── utils/                          # Helper functions and utilities
│   │   ├── generateToken.ts            # JWT token generation and management
│   │   └── getPublicIP.ts              # Client IP address extraction utility
│   ├── validators/                     # Input validation and sanitization
│   │   ├── requestSchema/              # Request validation schemas
│   │   │   └── userSchemaValidation.ts # User input validation rules
│   │   └── validate.ts                 # Validation middleware and error handling
│   ├── views/                          # Frontend templates and static assets
│   │   ├── assets/                     # Static files (CSS, images, icons)
│   │   │   ├── favicon.ico             # Website favicon
│   │   │   └── home.css                # Homepage styling
│   │   └── home.ejs                    # Homepage template (EJS templating)
│   ├── app.ts                          # Application setup and Express configuration
│   └── index.ts                        # Main application setup and Clusterization and Start Point
├── .env                                # Environment variables (keep this secure!)
├── .gitignore                          # Git ignore patterns for excluded files
├── drizzle.config.ts                   # 🔹 Drizzle migration and generation config
├── eslint.config.js                    # ESLint code quality and style rules
├── package.json                        # Project dependencies and npm scripts
├── Readme.md                           # Project documentation and setup guide
└── tsconfig.json                       # TypeScript compiler configuration
```

## 🔹 Database-Specific Files Legend:

- Files marked with 🔹 are **conditionally included** based on your chosen database option
- Each setup includes only the relevant database configuration files
- All other files remain consistent across all database choices

---

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload (using tsx)

# Build
npm run build        # Compile TypeScript to JavaScript (using tsc)
npm run start        # Start production server

# Code Quality & test
npm run lint         # Run ESLint to check code quality
npm run lint:fix     # Automatically fix ESLint errors
npm run typecheck    # Run TypeScript compiler type checking
npm run test         # Run tests and validate environment files

# CI
npm run ci           # Run complete CI pipeline (lint, typecheck, test, build)

# Husky
npm run prepare      # Setup Git hooks with Husky (runs automatically on install)

# Database (depending on chosen option Drizzle or Prisma Only)
npm run db:generate  # Generate database schema and types
npm run db:migrate   # Apply database migrations
npm run db:studio    # Open database studio for visual management

```

---

## 🔧 Configuration Examples

### Environment Variables (.env)

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_ISSUER=your-url #eg. http://localhost:3000

# Session
SESSION_SECRET=your-session-secret

# Password
PASSWORD_SALT_ROUNDS=10
PASSWORD_PEPPER="<password-pepper>" #eg.: hfje43809ijk54545&^hjg

# CORS
CORS_ORIGINS="http://localhost:3000,http://localhost:5173"
```

### TypeScript Configuration

The project includes a strict TypeScript configuration with:

- Path mapping (`@/*` → `src/*`)
- ES2024 target
- Strict type checking
- Decorators support
- Source maps for debugging

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Setup

```bash
git clone https://github.com/imvikashkk/create-tpexpress.git
cd create-tpexpress
npm install
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links & Resources

| Resource                 | Link                                                                          |
| ------------------------ | ----------------------------------------------------------------------------- |
| 📦 **npm Package**       | [create-tpexpress](https://www.npmjs.com/package/create-tpexpress)            |
| 🌐 **Web**               | [Wiki](https://tpexpress.vercel.com)                                          |
| 💾 **GitHub Repository** | [imvikashkk/create-tpexpress](https://github.com/imvikashkk/create-tpexpress) |
| 🐛 **Issues & Bugs**     | [Report Issues](https://github.com/imvikashkk/create-tpexpress/issues)        |
| 👤 **Author Profile**    | [@imvikashkk](https://github.com/imvikashkk)                                  |

---

## 📊 Package Statistics

<div align="center">

[![npm](https://img.shields.io/npm/v/create-tpexpress.svg)](https://www.npmjs.com/package/create-tpexpress)
[![npm](https://img.shields.io/npm/dm/create-tpexpress.svg)](https://www.npmjs.com/package/create-tpexpress)
[![GitHub issues](https://img.shields.io/github/issues/imvikashkk/create-tpexpress.svg)](https://github.com/imvikashkk/create-tpexpress/issues)
[![GitHub forks](https://img.shields.io/github/forks/imvikashkk/create-tpexpress.svg?style=social&label=Fork)](https://GitHub.com/imvikashkk/create-tpexpress/network/)

</div>

---

## ❤️ Support

If this project helped you, please consider:

- ⭐ **Starring** the repository
- 🐛 **Reporting** bugs and issues
- 💡 **Suggesting** new features
- 📢 **Sharing** with the community

---

<div align="center">

**Built with ❤️ by [Vikash Kumar Khunte](https://github.com/imvikashkk)**

_Making TypeScript + Express development faster and more enjoyable_

</div>
