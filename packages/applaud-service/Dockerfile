FROM mhart/alpine-node:12.15

WORKDIR /app
COPY package.json package-lock.json tsconfig.json tslint.json ./
RUN npm install --silent
COPY ./src ./src
RUN npm run build

FROM mhart/alpine-node:12.15
WORKDIR /app
COPY --from=0 /app/package.json /app/package-lock.json ./
RUN npm install --production --silent
COPY --from=0 /app/build ./build

EXPOSE 3000
CMD ["node", "build/index.js"]