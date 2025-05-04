FROM node:20

WORKDIR /usr/src/app

# Install SQLite and build tools
RUN apt-get update && apt-get install -y \
    sqlite3 \
    libsqlite3-dev \
    python3 \
    make \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with forced native build
RUN npm install --unsafe-perm && npm rebuild sqlite3 --build-from-source

# Copy the full application code
COPY . .

# Ensure SQLite data directory exists and is writable
RUN mkdir -p data && chmod 777 data

# Build the application
RUN npm run build

# Optional: Confirm sqlite3 version at build time
# (can be removed in production)
RUN node -e "console.log('SQLite3 version:', require('sqlite3').VERSION)"

EXPOSE 3000

CMD ["npm", "run", "start:prod"]