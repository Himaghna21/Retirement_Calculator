FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Since it's a Next.js API, we need to build it
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
