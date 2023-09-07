FROM node:18.16-alpine

ARG NEXT_PUBLIC_API_URL

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install

COPY . .

ENV NEXT_PUBLIC_API_URL ${NEXT_PUBLIC_API_URL}

RUN npm run build

CMD ["npm", "start"]