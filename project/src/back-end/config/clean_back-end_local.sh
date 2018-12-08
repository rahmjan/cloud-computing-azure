#!/usr/bin/env bash

docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

docker rmi --force $(docker images -a | grep "rahmjan" | awk '{print $3}')
docker rmi --force $(docker images -a | grep "config_" | awk '{print $3}')
docker rmi --force $(docker images -a | grep "<none>" | awk '{print $3}')
