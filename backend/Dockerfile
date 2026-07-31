FROM node:24-alpine

WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json ./
RUN npm install --omit=dev

COPY backend/server.js ./
COPY frontend /app/frontend

ENV PORT=3001
EXPOSE 3001

CMD ["node", "server.js"]
