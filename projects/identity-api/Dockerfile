FROM node:20-alpine AS builder

USER node

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

RUN npm run build

ENV NODE_ENV production

RUN npm ci --omit=dev

FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/package.json ./
COPY --chown=node:node --from=builder /usr/src/app/src/infra/db/prisma ./prisma
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

CMD [ "npm", "run", "start:prod" ]
