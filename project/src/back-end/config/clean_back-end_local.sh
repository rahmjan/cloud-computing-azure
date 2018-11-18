#!/usr/bin/env bash

#docker stack rm authentication
#docker swarm leave --force
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
#docker rmi $(docker images -aq)
docker rmi --force $(docker images -a | grep "<none>" | awk '{print $3}')
#
## Clean Docker client environment
#echo "### Cleaning Docker client environment ..."
#eval $(docker-machine env -u)
#
## Remove nodes
#echo "### Removing nodes ..."
#for c in {2..10} ; do
#    docker-machine rm node$c --force &> /dev/null
#done