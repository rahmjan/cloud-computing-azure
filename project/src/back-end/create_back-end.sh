#!/usr/bin/env bash

# Stop everything
docker stop $(docker ps -aq) &> /dev/null
docker rm $(docker ps -aq) &> /dev/null

## Start with authentication services ##
NETWORK=docker-network
IMAGE_USERS=image-auth
IMAGE_USERS_DB=image-auth-db
SERVICE_USER=users
SERVICE_USER_DB=users-db

# Create network
docker network create ${NETWORK}

# Build images
docker build -t ${IMAGE_USERS} ./users/
docker build -t ${IMAGE_USERS_DB} ./users/src/db/

# Run
docker run --network ${NETWORK} -p 3000:80 --name ${SERVICE_USER} -d ${IMAGE_USERS}
docker run --network ${NETWORK} --name ${SERVICE_USER_DB} -p 5984:5984 -d ${IMAGE_USERS_DB}

