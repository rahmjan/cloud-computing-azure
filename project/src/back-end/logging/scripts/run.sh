#!/bin/bash -

add_logs () {
    WHERE=${DB_URL}
    WHAT='Content-Type: application/json'

    until curl -X GET ${WHERE} ; do
        sleep 1
    done

    DATA=$(cat ./scripts/logs.json)
    curl -X POST --data "${DATA}" -H "${WHAT}" ${WHERE}/_bulk_docs
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

# For recommendation service
curl -X DELETE ${DB_URL}
curl -X PUT ${DB_URL}

# Add users
add_logs &

# Launch
echo "Launch service"
npm start

