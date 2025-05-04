FROM node:20

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    sqlite3 \
    libsqlite3-dev \
    python3 \
    make \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install --unsafe-perm && npm rebuild sqlite3 --build-from-source

COPY . .

RUN mkdir -p data && chmod 777 data

RUN npm run build

RUN node -e "console.log('SQLite3 version:', require('sqlite3').VERSION)"

EXPOSE 3000

CMD ["npm", "run", "start:prod"]