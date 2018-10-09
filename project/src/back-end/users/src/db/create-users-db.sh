#!/bin/bash -
#===============================================================================
#
#          FILE: create-users-db.sh
#
#         USAGE: ./create-users-db.sh
#
#   DESCRIPTION:
#     Waits until the deamon of CouchDB starts to create a database. The
#     environment variable DB_URL contains more details of such DB
#     (name, authentication information of administrator, etc).
#       OPTIONS: ---
#  REQUIREMENTS: This script makes use of the environment variables DB_NAME and
#     DB_URL, be sure that such variables were defined before running this script.
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: Raziel Carvajal-Gomez (), raziel.carvajal@uclouvain.be
#  ORGANIZATION:
#       CREATED: 10/08/2018 09:20
#      REVISION:  ---
#===============================================================================

set -o nounset                              # Treat unset variables as an error
echo "Launch CouchDB"
couchdb &>/dev/null &

echo "Wait until the CouchDB deamon starts."


echo ${DB_URL}
until curl -X PUT ${DB_URL} ; do
  echo -e "\t Database wasn't created - trying again later..."
  sleep 1
done
curl http://127.0.0.1:5984
echo "Database [${DB_NAME}] created !"
echo "End of ${0}"
