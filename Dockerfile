FROM node:18.16-alpine

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_URL_TRAMITACION

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install

COPY . .

ENV NEXT_PUBLIC_API_URL ${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_URL_TRAMITACION ${NEXT_PUBLIC_URL_TRAMITACION}

RUN npm run build

CMD ["npm", "start"]