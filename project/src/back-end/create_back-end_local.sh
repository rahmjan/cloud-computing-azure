#!/usr/bin/env bash

### Create local back-end ###
NUM_OF_NODES=2
NUM_OF_NODES=$((NUM_OF_NODES-1))

# Creating nodes
echo "### Creating nodes ..."
for i in `seq 0 ${NUM_OF_NODES}`
do
    docker-machine create -d virtualbox node${i}
done

# Get IP from leader node
leader_ip=$(docker-machine ip node0)

# Init Docker Swarm node
echo "### Initializing Swarm node ..."
docker-machine ssh node0 "docker swarm init --advertise-addr ${leader_ip}"

# Swarm token
token=$(docker-machine ssh node0 "docker swarm join-token worker -q")

# Joining nodes
echo "### Joining nodes ..."
for i in `seq 1 ${NUM_OF_NODES}`
do
    docker-machine ssh node${i} "docker swarm join --token ${token} ${leader_ip}:2377"
done

# Set daemon type
for i in `seq 1 ${NUM_OF_NODES}`
do
    docker-machine ssh node0 "docker node update --label-add type=daemon node${i}"
done

# Copy data to manager
echo "### Copy data to manager ..."
docker-machine scp -r -d ./../../../project/src/back-end/ node0:./back-end/ 1> /dev/null

# Deploying services
echo "### Deploying services ..."
docker-machine ssh node0 "docker stack deploy -c ./back-end/users-application.yml authentication"

# End
echo "### The swarm leader ip is: ${leader_ip}"
