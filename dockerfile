FROM alpine:alpine3.20

WORKDIR /usr/scr/app

COPY . .

RUN npm i

EXPOSE 3333

CMD npm run start