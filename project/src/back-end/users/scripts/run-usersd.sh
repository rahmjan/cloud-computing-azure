#!/bin/bash -

set -o nounset                              # Treat unset variables as an error
echo "Wait until the CouchDB deamon starts and create database: ${DB_NAME}."

until curl -X PUT ${DB_URL} ; do
  echo -e "\t Database wasn't created - trying again later..."
  sleep 1
done
echo "Database [${DB_NAME}] created !"

# Add users
WHERE=localhost:80/user
DATA="username=tito&password=toti"
curl -X POST --data ${DATA} ${WHERE}
DATA="username=admin&password=admin"
curl -X POST --data ${DATA} ${WHERE}

# Launch
echo "Launch service deamon"
npm start

### Structure of DB
#{
#  id: "name",
#  password: "hash",
#  isUser: true,
#  isAdmin: false
#}