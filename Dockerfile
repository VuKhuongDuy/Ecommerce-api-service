FROM node:16
WORKDIR /usr/src/app
ARG PORT
RUN apt-get update && \
    apt-get install -y \
        wait-for-it \
        socat \
    && \
    apt-get clean

COPY package*.json ./
RUN yarn install --quiet

COPY . .

EXPOSE $PORT

CMD ["yarn", "run", "start:dev"]
