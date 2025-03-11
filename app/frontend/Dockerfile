FROM node:23-alpine3.21

WORKDIR /app

# COPY only necessary files
COPY package.json ./

# Install dependencies
RUN npm install

# COPY tsconfig files
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./

# COPY vite and other config files
COPY vite.config.ts postcss.config.mjs components.json ./

# COPY HTML and public files
COPY index.html ./index.html
COPY public ./public

# COPY the src and components directories
COPY src ./src

# Expose port
EXPOSE 5173

CMD ["npm", "run", "dev", "--host"]
