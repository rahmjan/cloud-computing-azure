#!/usr/bin/env bash

USER_NAME=myAdmin
ADMIN_PASS=Admin1234
ADDRESS=francecentral.cloudapp.azure.com
SSH_KEY=./ssh/rsa_key
GITHUB_ACC=rahmjan
NUM_OF_NODES=2

# Please login
#az login
#
## Resource group
#az group create --name lingi2145.fr --location francecentral
#
## Create VM
#for i in `seq 1 ${NUM_OF_NODES}`
#do
#    az group deployment create --resource-group lingi2145.fr \
#                               --template-file ./azure-docker-vm.json \
#                               --parameters "{\"adminUsername\": {\"value\": \"${USER_NAME}\"},
#                                              \"adminPassword\": {\"value\": \"${ADMIN_PASS}\"},
#                                              \"gitHubAccount\": {\"value\": \"${GITHUB_ACC}\"},
#                                              \"dnsNameForPublicIP\": {\"value\": \"node${i}\"},
#                                              \"sshKeyData\": {\"value\": \"$(cat ./ssh/rsa_key.pub)\"}}"
#done

# Add key to know_hosts
for i in `seq 1 ${NUM_OF_NODES}`
do
    ssh-keyscan -Ht rsa node${i}-${GITHUB_ACC}.${ADDRESS} >> ~/.ssh/known_hosts
done

# Get IP from leader node
leader_ip=$(dig +short node1-${GITHUB_ACC}.${ADDRESS})

# Init Swarm node
echo "### Initializing Swarm node ..."
ssh -i ${SSH_KEY} ${USER_NAME}@node1-${GITHUB_ACC}.${ADDRESS} "docker swarm init --advertise-addr ${leader_ip}"

# Swarm token
token=$(ssh -i ${SSH_KEY} ${USER_NAME}@node1-${GITHUB_ACC}.${ADDRESS} "docker swarm join-token worker -q")

# Joining nodes
echo "### Joining nodes ..."
for i in `seq 2 ${NUM_OF_NODES}`
do
    MY_IP=$(dig +short node${i}-${GITHUB_ACC}.${ADDRESS})
    ssh -i ${SSH_KEY} ${USER_NAME}@node${i}-${GITHUB_ACC}.${ADDRESS} "docker swarm join --advertise-addr ${MY_IP} --token ${token} ${leader_ip}:2377"
done

# Copy data to manager
echo "### Copy data to manager ..."
rsync -e "ssh -i ${SSH_KEY}" -r ./swarm_config.yml ${USER_NAME}@node1-${GITHUB_ACC}.${ADDRESS}:./swarm_config.yml
rsync -e "ssh -i ${SSH_KEY}" -r ./ssh/ ${USER_NAME}@node1-${GITHUB_ACC}.${ADDRESS}:./ssh/
rsync -e "ssh -i ${SSH_KEY}" -r ./elastic_scaling_azure.sh ${USER_NAME}@node1-${GITHUB_ACC}.${ADDRESS}:./elastic_scaling_azure.sh

# Deploying services
echo "### Deploying services ..."
ssh -i ${SSH_KEY} ${USER_NAME}@node1-${GITHUB_ACC}.${ADDRESS} "docker stack deploy -c ./swarm_config.yml mySwarm"
ssh -i ${SSH_KEY} ${USER_NAME}@node1-${GITHUB_ACC}.${ADDRESS} "./elastic_scaling_azure.sh > output_elastic &" &> /dev/null

# End
echo "### The swarm leader ip is: ${leader_ip} and address: node1-${GITHUB_ACC}.${ADDRESS}"
