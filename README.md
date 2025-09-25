# 🎯 Ask&Trust

**Professional Online Survey Platform**

![Version](https://img.shields.io/badge/version-1.3.3-blue.svg)
![License](https://img.shields.io/badge/license-GPL--2.0-green.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

> A modern, full-stack survey platform built with React, TypeScript, and GraphQL. Create, manage, and preview professional surveys with integrated payment system.

## 🛠️ Tech Stack

### **Frontend**

| Technology        | Version | Purpose            |
| ----------------- | ------- | ------------------ |
| **React**         | 19.0.0  | UI Framework       |
| **TypeScript**    | 5.7.2   | Type Safety        |
| **Vite**          | 6.1.0   | Build Tool         |
| **TailwindCSS**   | Latest  | Styling            |
| **Apollo Client** | 3.13.0  | GraphQL Client     |
| **React Router**  | 7.5.2   | Routing            |
| **Radix UI**      | Latest  | UI Components      |
| **Stripe.js**     | 7.0.0   | Payment Processing |
| **React Helmet**  | 6.1.0   | SEO Management     |
| **Sonner**        | 2.0.3   | Notifications      |

### **Backend**

| Technology        | Version    | Purpose            |
| ----------------- | ---------- | ------------------ |
| **Node.js**       | Latest     | Runtime            |
| **TypeScript**    | 5.7.3      | Type Safety        |
| **Apollo Server** | 4.11.3     | GraphQL API        |
| **TypeORM**       | 0.3.2      | Database ORM       |
| **PostgreSQL**    | 15         | Database           |
| **Type-GraphQL**  | 2.0.0-rc.2 | GraphQL Schema     |
| **Stripe**        | 18.0.0     | Payment Processing |
| **JWT**           | 9.0.2      | Authentication     |
| **Argon2**        | 0.41.1     | Password Hashing   |

### **Infrastructure**

- **Docker** & **Docker Compose** for containerization
- **Nginx** for reverse proxy and static file serving
- **PostgreSQL 15** for data persistence
- **Husky** for Git hooks
- **ESLint** & **Prettier** for code quality

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm**
- **Docker** and **Docker Compose**
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/WildCodeSchool/2409-wns-rouge-ask-and-trust.git
cd ask-and-trust
```

### 2. Setup Environment Variables

```bash
# Install dependencies and start all services
cp /app/backend/.env.sample /app/backend/.env
cp /app/frontend/database.env.sample /app/frontend/database.env
```

### 3. Start the Application

```bash
# Install dependencies and start all services
npm install
npm run start
```

### 4. Access the Application

- **Frontend**: http://localhost:8080
- **Backend GraphQL**: http://localhost:8080/api/v1
- **Database**: 5432

### 5. Default Admin Account

An admin account is automatically created:

- **Email**: `admin@askandtrust.com`
- **Password**: `Password123!`

## 🧪 Development Commands

```bash
# Install dependencies
npm install

# Install setup
npm run prepare

# Start development environment
npm run start

# Code formatting
npm run format
npm run prettier:check

# Linting
npm run lint

# Documentation generation
npm run docs

# Release management
npm run release              # Auto-increment version
npm run release:patch        # Patch version (1.0.1)
npm run release:minor        # Minor version (1.1.0)
npm run release:major        # Major version (2.0.0)

# Conventional commits
npm run commit               # Interactive commit with commitizen
```

## 📖 Documentation

- **API Documentation**: https://wildcodeschool.github.io/2409-wns-rouge-ask-and-trust/
- **TypeDoc**: Generated automatically with `npm run docs`
- **Changelog**: See [CHANGELOG.md](CHANGELOG.md)

- /docs/deploiement.md
- /docs/migrations.md
- /docs/sécurité.md
- /docs/eco-conception.md
- /docs/disaster-recovery-plan.md

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`npm run commit`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

## 📄 License

This project is licensed under the **GPL-2.0** License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Authors**: YohanGH, AlexDDevv, ArthurVS05, corenthin95  
**School**: Simplon - 2409 WNS Rouge

## 🆘 Support

For support and questions:

1. Check the [documentation](https://wildcodeschool.github.io/2409-wns-rouge-ask-and-trust/)
2. Open an [issue](https://github.com/WildCodeSchool/2409-wns-rouge-ask-and-trust/issues)
3. Contact the development team

---

Made with ❤️ by the Ask&Trust team 😁
