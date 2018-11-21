FROM node:latest
MAINTAINER Raziel Carvajal-Gomez <raziel.carvajal-gomez@uclouvain.be>, Paolo Laffranchini <paolo.laffranchini@student.uclouvain.be>

WORKDIR /usr/src/app

ENV COUCHDB_URL http://admin:admin@ml_db:5984/movielens_db

RUN apt-get update -y && apt-get install -y --no-install-recommends curl

RUN npm install debug

COPY dataset ./dataset
COPY views ./views
COPY func_to_string.js ./
COPY fill_db.sh ./
COPY wait-for-couchdb.sh ./
