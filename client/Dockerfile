FROM node:18.16.0

WORKDIR /app

COPY package.json .

RUN npm i -g pnpm
RUN pnpm i

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]