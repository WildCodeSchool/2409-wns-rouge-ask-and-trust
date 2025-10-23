FROM node:23-alpine3.21

WORKDIR /app

# COPY only necessary files
COPY package.json ./

# Install dependencies
RUN npm install

# COPY tsconfig and nodemon config
COPY tsconfig.json nodemon.json ./

# COPY the entire src directory
COPY src ./src

CMD ["npm", "start"]
