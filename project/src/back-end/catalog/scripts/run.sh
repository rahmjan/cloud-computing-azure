#!/bin/bash -
#===============================================================================
#
#          FILE: run-usersd.sh
#
#         USAGE: ./run-usersd.sh
#
#   DESCRIPTION:
#
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: Raziel Carvajal-Gomez (), raziel.carvajal@uclouvain.be
#  ORGANIZATION:
#       CREATED: 10/08/2018 10:52
#      REVISION:  ---
#===============================================================================

set -o nounset                              # Treat unset variables as an error
echo "Wait until the CouchDB deamon starts and create database: ${DB_NAME}."
echo "Command: curl -X PUT ${DB_URL}"
until curl -X PUT ${DB_URL} ; do
  echo -e "\t Database wasn't created - trying again later..."
  echo -e "Command: curl -X PUT ${DB_URL}"
  sleep 1
done
echo "Database [${DB_NAME}] created !"
curl http://127.0.0.1:5984

echo "Launch service deamon"
npm start
