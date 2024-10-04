FROM node:22.9.0-slim 

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

WORKDIR /app/dist

CMD ["node", "index.js"]
