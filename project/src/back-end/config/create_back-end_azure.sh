USER_NAME=myAdmin
ADMIN_PASS=Admin1234
GITHUB_ACC=rahmjan  ## you need to change it

### Create azure back-end ###
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
    ssh-keyscan -Ht rsa node${i}-${GITHUB_ACC}.francecentral.cloudapp.azure.com >> ~/.ssh/known_hosts
done

# Get IP from leader node
leader_ip=$(dig +short node1-${GITHUB_ACC}.francecentral.cloudapp.azure.com)

# Init Swarm node
echo "### Initializing Swarm node ..."
ssh -i ./ssh/rsa_key ${USER_NAME}@node1-${GITHUB_ACC}.francecentral.cloudapp.azure.com "docker swarm init --advertise-addr ${leader_ip}"

# Swarm token
token=$(ssh -i ./ssh/rsa_key ${USER_NAME}@node1-${GITHUB_ACC}.francecentral.cloudapp.azure.com "docker swarm join-token worker -q")

# Joining nodes
echo "### Joining nodes ..."
for i in `seq 2 ${NUM_OF_NODES}`
do
    MY_IP=$(dig +short node${i}-${GITHUB_ACC}.francecentral.cloudapp.azure.com)
    ssh -i ./ssh/rsa_key ${USER_NAME}@node${i}-${GITHUB_ACC}.francecentral.cloudapp.azure.com "docker swarm join --advertise-addr ${MY_IP} --token ${token} ${leader_ip}:2377"
done

# Set daemon type
for i in `seq 2 ${NUM_OF_NODES}`
do
    ssh -i ./ssh/rsa_key ${USER_NAME}@node1-${GITHUB_ACC}.francecentral.cloudapp.azure.com "docker node update --label-add type=daemon node${i}"
done

# Copy data to manager
echo "### Copy data to manager ..."
rsync -e "ssh -i ./ssh/rsa_key" -r ./users-application.yml ${USER_NAME}@node1-${GITHUB_ACC}.francecentral.cloudapp.azure.com:./users-application.yml
rsync -e "ssh -i ./ssh/rsa_key" -r ./elastic_scaling.sh ${USER_NAME}@node1-${GITHUB_ACC}.francecentral.cloudapp.azure.com:./elastic_scaling.sh


# Deploying services
echo "### Deploying services ..."
ssh -i ./ssh/rsa_key ${USER_NAME}@node1-${GITHUB_ACC}.francecentral.cloudapp.azure.com "docker stack deploy -c ./users-application.yml mySwarm"

# End
echo "### The swarm leader ip is: ${leader_ip} and address: node1-${GITHUB_ACC}.francecentral.cloudapp.azure.com"


# node1-rahmjan.francecentral.cloudapp.azure.com
# ssh -i ./ssh/rsa_key myAdmin@node1-rahmjan.francecentral.cloudapp.azure.com
#rsync -e "ssh -i ./ssh/rsa_key" -r ./../../../project/src/back-end/ myAdmin@node1-rahmjan.francecentral.cloudapp.azure.com:./back-end/
#ssh -i ./ssh/rsa_key myAdmin@node1-rahmjan.francecentral.cloudapp.azure.com "docker stack deploy -c ./back-end/users-application.yml mySwarm"