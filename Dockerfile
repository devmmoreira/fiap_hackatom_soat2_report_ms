FROM node:latest
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY --chown=node:node . .
EXPOSE 12967

RUN npx prisma generate

RUN npm run build
RUN npm i --global dotenv-cli