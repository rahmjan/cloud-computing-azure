#!/bin/bash -

add_catalog () {
    WHERE=${DB_URL}
    WHAT='Content-Type: application/json'

    until curl -X GET ${WHERE} ; do
        sleep 1
    done

    DATA=$(cat ./scripts/catalog.json)
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
add_catalog &

# Launch
echo "Launch service"
npm start

