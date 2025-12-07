FROM node:22


RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package*.json ./
RUN pnpm install
COPY . .

EXPOSE 8001
CMD ["node", "src/server.js"]
