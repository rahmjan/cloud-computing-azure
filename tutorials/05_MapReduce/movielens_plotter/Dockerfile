FROM r-base:latest
MAINTAINER Raziel Carvajal-Gomez <raziel.carvajal-gomez@uclouvain.be>, Paolo Laffranchini <paolo.laffranchini@student.uclouvain.be>

WORKDIR /usr/app
ENV COUCHDB_URL http://admin:admin@ml_db:5984/movielens_db

RUN apt-get update -y && apt-get install -y --allow-downgrades --no-install-recommends libcurl4=7.61.0-1 curl

COPY r-plotter-pkgs.R ./
RUN R CMD BATCH r-plotter-pkgs.R

COPY plot.R ./
COPY plot.sh ./
