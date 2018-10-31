FROM node:latest
MAINTAINER Raziel Carvajal-Gomez <raziel.carvajal-gomez@uclouvain.be>

WORKDIR /usr/src/app
ENV COUCHDB_URL http://admin:admin@instacart_sample:5984/instacart_db
RUN apt-get update -y && apt-get install -y --no-install-recommends curl tar
RUN npm install debug
COPY jsons ./jsons
COPY views ./views
COPY func_to_string.js ./
COPY wait-for-couchdb.sh ./
