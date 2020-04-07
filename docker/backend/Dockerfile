FROM node:12.8-slim

RUN apt update && apt -y install procps bzip2 build-essential chrpath libssl-dev libxft-dev libfreetype6 libfreetype6-dev \
    libfontconfig1 libfontconfig1-dev cron

COPY ./docker/backend/entrypoint.sh /

WORKDIR /app

ARG ENV=dev
ENV ENV=${ENV}

ADD . /app

RUN npm install -g yarn

ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]