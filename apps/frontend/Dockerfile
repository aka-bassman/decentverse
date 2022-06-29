
FROM node:16
RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

RUN mkdir -p /frontend
WORKDIR /frontend

# ADD . /app
COPY .next ./.next
COPY public ./public
COPY package.json ./package.json
COPY next.config.js ./next.config.js
COPY .env ./.env
ENV PORT 4200
RUN npm i --production
RUN npm i --save @nrwl/next
RUN npm i -g next
CMD next start -p $PORT
