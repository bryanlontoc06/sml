FROM node:14-alpine3.16

RUN npm install -g nodemon

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3500
# required for docker desktop port mapping

CMD ["npm", "run", "dev"]