#!/usr/bin/env bash

#USER_NAME=admin
#ADMIN_PASS=Admin1234
#GITHUB_ACC=rahmjan
#DNS_NAME=(authentication logging)

## Please login - AZURE
#az login
#
## Create VM
#for dns_name in "${DNS_NAME[@]}"
#do
#    az group deployment create --resource-group lingi2145.fr \
#                               --template-file ./azure-docker-vm.json \
#                               --parameters "{\"adminUsername\": {\"value\": \"${USER_NAME}\"},
#                                              \"adminPassword\": {\"value\": \"${ADMIN_PASS}\"},
#                                              \"gitHubAccount\": {\"value\": \"${GITHUB_ACC}\"},
#                                              \"dnsNameForPublicIP\": {\"value\": \"${DNS_NAME}\"}}"
#done

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
manager_token=$(docker-machine ssh node0 "docker swarm join-token manager -q")

# Joining nodes
echo "### Joining nodes ..."
for i in `seq 1 ${NUM_OF_NODES}`
do
    docker-machine ssh node${i} "docker swarm join --token ${manager_token} ${leader_ip}:2377"
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
docker-machine ssh node0 "docker stack deploy -c ./back-end/users/users-application.yml authentication" ## here is something wrong...
#docker-machine ssh node0 "cd ./back-end/users && ./services.sh"

# End
echo "### The swarm leader ip is: ${leader_ip}"
