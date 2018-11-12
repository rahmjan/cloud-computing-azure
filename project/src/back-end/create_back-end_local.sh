#!/usr/bin/env bash

NET_INTERFACE=wlp2s0  ## you need to change it

### Create local back-end ###
NUM_OF_NODES=2

# Creating nodes
echo "### Creating nodes ..."
for i in `seq 2 ${NUM_OF_NODES}`
do
    docker-machine create -d virtualbox node${i}
done

# Get IP from leader node
leader_ip=$( ip address | grep ${NET_INTERFACE} | grep inet | awk '{print $2}' | tr '/' ' ' | awk '{print $1}')

# Init Docker Swarm node
echo "### Initializing Swarm node ..."
docker swarm init --advertise-addr ${leader_ip}

# Swarm token
token=$(docker swarm join-token worker -q)

# Joining nodes
echo "### Joining nodes ..."
for i in `seq 2 ${NUM_OF_NODES}`
do
    MY_IP=$(docker-machine ip node${i})
    docker-machine ssh node${i} "docker swarm join --advertise-addr ${MY_IP} --token ${token} ${leader_ip}:2377"
done

# Set daemon type
echo "### Set daemon type ..."
for i in `seq 2 ${NUM_OF_NODES}`
do
    docker node update --label-add type=daemon node${i}
done

# Deploying services
echo "### Deploying services ..."
docker stack deploy -c ./users-application.yml authentication

# End
echo "### The swarm leader ip is: ${leader_ip}"
