#!/usr/bin/env bash

### Create local back-end ###
NUM_OF_NODES=2

# Creating nodes
echo "### Creating nodes ..."
for i in `seq 1 ${NUM_OF_NODES}`
do
    docker-machine create -d virtualbox node${i}
done

# Get IP from leader node
leader_ip=$(docker-machine ip node1)

# Init Docker Swarm node
echo "### Initializing Swarm node ..."
docker-machine ssh node1 "docker swarm init --advertise-addr ${leader_ip}"

# Swarm token
token=$(docker-machine ssh node1 "docker swarm join-token worker -q")

# Joining nodes
echo "### Joining nodes ..."
for i in `seq 2 ${NUM_OF_NODES}`cd cd
do
    docker-machine ssh node${i} "docker swarm join --token ${token} ${leader_ip}:2377"
done

# Copy data to manager
echo "### Copy data to manager ..."
docker-machine scp -r -d ./swarm_config.yml node1:./swarm_config.yml 1> /dev/null

# Deploying services
echo "### Deploying services ..."
docker-machine ssh node1 "docker stack deploy -c ./back-end/swarm_config.yml mySwarm"

# End
echo "### The swarm leader ip is: ${leader_ip}"
