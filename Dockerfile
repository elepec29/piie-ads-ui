FROM node:18.16-alpine

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_URL_DIRIGIR_EN_LOGIN_ADMIN
ARG NEXT_PUBLIC_URL_DIRIGIR_EN_LOGIN_ASISTENTE

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install

COPY . .

ENV NEXT_PUBLIC_API_URL ${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_URL_DIRIGIR_EN_LOGIN_ADMIN ${NEXT_PUBLIC_URL_DIRIGIR_EN_LOGIN_ADMIN}
ENV NEXT_PUBLIC_URL_DIRIGIR_EN_LOGIN_ASISTENTE ${NEXT_PUBLIC_URL_DIRIGIR_EN_LOGIN_ASISTENTE}

RUN npm run build

CMD ["npm", "start"]