FROM node:alpine
WORKDIR /usr/nndak-api
COPY package.json .
RUN npm install typescript yarn -g --force
RUN yarn install
COPY . .
RUN yarn prisma:generate
RUN yarn build
EXPOSE 8080
EXPOSE 5555
CMD ["node", "./build/index.js"]