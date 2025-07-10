# 🎯 Ask&Trust

**Professional Online Survey Platform**

![Version](https://img.shields.io/badge/version-1.3.3-blue.svg)
![License](https://img.shields.io/badge/license-GPL--2.0-green.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

> A modern, full-stack survey platform built with React, TypeScript, and GraphQL. Create, manage, and preview professional surveys with integrated payment system.

## ✨ Features

### 🔐 **Authentication & User Management**

- User registration and login with JWT authentication
- Role-based access control (User, Admin)
- Protected routes and secure sessions

### 📊 **Survey Management**

- **Create surveys** with custom titles, descriptions, and categories
- **Visual survey builder** with drag-and-drop toolbox
- **Question types**: Text input, Multiple choice, Select dropdown, Boolean (Yes/No)
- **Survey preview** with professional template showcase
- **Survey status management** (Draft, Published, Archived)

### 💳 **Payment Integration**

- **Stripe integration** for secure payments
- **Survey pack purchase** (50 surveys for €29.99, 100 surveys for €59.99)
- Payment confirmation and user quota management
- Test mode with card: `4242 4242 4242 4242`

### 🎨 **User Experience**

- **Responsive design** with mobile-first approach
- **Dark/Light theme** support via CSS variables
- **SEO optimized** with React Helmet
- **Loading states** and error handling
- **Professional templates** for survey inspiration

### 📱 **Pages & Navigation**

- Landing page with feature showcase
- Survey listing and management
- Visual survey creator with toolbox
- Survey preview with template examples
- Payment processing
- Contact form
- Terms of service

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

**Backend** (`app/backend/.env`):

```bash
# Database Configuration
DB_HOST=db
DB_PORT=5432
POSTGRES_DB=ask_and_trust
POSTGRES_USER=ask_and_trust
POSTGRES_PASSWORD=superpassword

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Server Configuration
PORT=3310
NODE_ENV=development
```

**Frontend** (`app/frontend/.env`):

```bash
VITE_GRAPHQL_ENDPOINT=http://localhost:8080/graphql
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 3. Start the Application

```bash
# Install dependencies and start all services
npm run start
```

This command will:

- Build and start the **Frontend** (React + Vite)
- Build and start the **Backend** (Node.js + Apollo Server)
- Start **PostgreSQL** database
- Start **Nginx** reverse proxy

### 4. Access the Application

- **Frontend**: http://localhost:8080
- **Backend GraphQL Playground**: http://localhost:8080/graphql
- **Database**: localhost:5432

### 5. Default Admin Account

An admin account is automatically created:

- **Email**: `admin@askandtrust.com`
- **Password**: `Password123!`

## 📁 Project Structure

```
ask-and-trust/
├── app/
│   ├── frontend/                 # React TypeScript Frontend
│   │   ├── src/
│   │   │   ├── components/       # Reusable UI components
│   │   │   │   ├── sections/     # Page-specific components
│   │   │   │   │   ├── auth/     # Authentication forms
│   │   │   │   │   ├── landing/  # Landing page sections
│   │   │   │   │   ├── surveys/  # Survey management
│   │   │   │   │   ├── preview/  # Survey preview components
│   │   │   │   │   └── payment/  # Payment components
│   │   │   │   └── ui/           # Basic UI components
│   │   │   ├── pages/            # Page components
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── contexts/         # React contexts
│   │   │   ├── graphql/          # GraphQL queries/mutations
│   │   │   ├── config/           # App configuration
│   │   │   ├── types/            # TypeScript type definitions
│   │   │   └── styles/           # Global styles
│   │   ├── public/               # Static assets
│   │   └── package.json
│   │
│   └── backend/                  # Node.js GraphQL Backend
│       ├── src/
│       │   ├── database/         # Database configuration
│       │   │   ├── entities/     # TypeORM entities
│       │   │   │   ├── survey/   # Survey-related entities
│       │   │   │   ├── user.ts   # User entity
│       │   │   │   └── payment.ts # Payment entity
│       │   │   └── config/       # Database config
│       │   ├── graphql/          # GraphQL schema
│       │   │   ├── resolvers/    # GraphQL resolvers
│       │   │   └── inputs/       # Input type definitions
│       │   ├── services/         # Business logic services
│       │   ├── middlewares/      # Express middlewares
│       │   ├── scripts/          # Utility scripts
│       │   └── server.ts         # Application entry point
│       └── package.json
│
├── nginx/                        # Nginx configuration
├── docs/                         # Project documentation
├── docker-compose.yaml           # Docker services configuration
├── docker-compose.prod.yaml      # Production configuration
└── package.json                  # Root package.json for workspaces
```

## 🧪 Development Commands

```bash
# Install dependencies and setup
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

## 📊 GraphQL API

### **Authentication Mutations**

```graphql
# Register a new user
mutation RegisterUser($data: CreateAuthInput!) {
	register(data: $data) {
		id
		email
		role
	}
}

# Login user
mutation LoginUser($data: CreateAuthInput!) {
	login(data: $data) {
		user {
			id
			email
			role
		}
		token
	}
}
```

### **Survey Queries & Mutations**

```graphql
# Get all surveys
query GetSurveys {
	surveys {
		id
		title
		description
		public
		category {
			name
		}
		questions {
			id
			title
			type
			answers {
				value
			}
		}
	}
}

# Create a survey
mutation CreateSurvey($data: CreateSurveyInput!) {
	createSurvey(data: $data) {
		id
		title
		description
	}
}
```

### **Payment Mutations**

```graphql
# Create payment intent
mutation CreatePaymentIntent($data: CreatePaymentInput!) {
	createPaymentIntent(data: $data)
}
```

## 🔄 Survey Preview System

The platform includes a comprehensive survey preview system:

### **Template Access**

- **Mock Survey**: `http://localhost:8080/surveys/preview/mock`
- **Real Surveys**: `http://localhost:8080/surveys/preview/0`, `/1`, `/2`, etc.

### **Professional Template**

The mock survey showcases a complete customer satisfaction survey with:

- 12 professional questions
- All question types (text, select, multiple choice, boolean)
- Organized sections with emojis
- Real-world scenarios and industry best practices

## 🔐 Security Features

- **JWT Authentication** with secure cookie handling
- **Password hashing** with Argon2
- **Role-based authorization** (User, Admin)
- **Input validation** with class-validator
- **SQL injection protection** via TypeORM
- **CORS configuration** for API security
- **Environment variable protection**

## 🚢 Deployment

### Production Deployment

```bash
# Build and start production environment
docker-compose -f compose.prod.yaml up --build
```

### Environment Variables for Production

Update the production environment files with:

- Real Stripe API keys
- Strong JWT secrets
- Production database credentials
- Proper CORS origins

## 📖 Documentation

- **API Documentation**: https://wildcodeschool.github.io/2409-wns-rouge-ask-and-trust/
- **TypeDoc**: Generated automatically with `npm run docs`
- **Changelog**: See [CHANGELOG.md](CHANGELOG.md)

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
**School**: Wild Code School - 2409 WNS Rouge

## 🆘 Support

For support and questions:

1. Check the [documentation](https://wildcodeschool.github.io/2409-wns-rouge-ask-and-trust/)
2. Open an [issue](https://github.com/WildCodeSchool/2409-wns-rouge-ask-and-trust/issues)
3. Contact the development team

---

Made with ❤️ by the Ask&Trust team 😁
