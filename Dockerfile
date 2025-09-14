FROM oven/bun:latest

WORKDIR /usr/src/app

COPY package.json ./

RUN bun install

COPY . .

CMD ["bun", "--hot", "run", "index.ts"]
