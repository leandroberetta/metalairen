FROM node:18-alpine

WORKDIR /app

COPY .next ./.next
COPY public ./public
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY prisma ./prisma
COPY .env ./.env
COPY next.config.ts ./next.config.ts

RUN npm ci --only=production

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
