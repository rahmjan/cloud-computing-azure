#!/bin/bash -

add_users () {
    WHERE=localhost:80/user

    until curl -X PUT ${WHERE} ; do
        sleep 1
    done

    DATA="username=tito&password=toti"
    curl -X POST --data ${DATA} ${WHERE}
    DATA="username=admin&password=admin"
    curl -X POST --data ${DATA} ${WHERE}
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


### Structure of DB
#{
#  _id: "name",
#  password: "hash",
#  isUser: true,
#  isAdmin: false
#}