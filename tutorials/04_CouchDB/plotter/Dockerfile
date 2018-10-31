FROM r-base:latest
MAINTAINER Raziel Carvajal-Gomez <raziel.carvajal-gomez@uclouvain.be>

WORKDIR /usr/app
ENV COUCHDB_URL http://admin:admin@instacart_sample:5984/instacart_db

RUN apt-get update -y && apt-get install -y --no-install-recommends curl

COPY r-plotter-pkgs.R ./
RUN R CMD BATCH r-plotter-pkgs.R

COPY plot.R ./
COPY plot.sh ./
