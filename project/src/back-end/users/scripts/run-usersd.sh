#!/bin/bash -

add_users () {
    WHERE=http://localhost:80/user
    WHAT='Content-Type: application/json'

    until curl -X GET ${WHERE} ; do
        sleep 1
    done

    DATA='{"username": "tito", "password": "toti", "isUser": true, "isAdmin": false}'
    curl -X POST --data "${DATA}" -H "${WHAT}" ${WHERE}
    DATA='{"username": "admin", "password": "admin", "isUser": true, "isAdmin": true}'
    curl -X POST --data "${DATA}" -H "${WHAT}" ${WHERE}
}

# Treat unset variables as an error
set -o nounset

# Create Database
echo "Wait until the CouchDB deamon starts and create database: ${DB_NAME}."
until curl -X PUT ${DB_URL} ; do
  echo -e "\t Database wasn't created - trying again later..."
  sleep 1
done
echo "Database [${DB_NAME}] created !"

# Add users
add_users &

# Launch
echo "Launch service deamon"
npm start
