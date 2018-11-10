USER_NAME=admin
ADMIN_PASS=Admin1234
GITHUB_ACC=rahmjan

### Create azure back-end ###
NUM_OF_NODES=2
NUM_OF_NODES=$((NUM_OF_NODES-1))

# Please login - AZURE
az login

# Create VM
for i in `seq 0 ${NUM_OF_NODES}`
do
    az group deployment create --resource-group lingi2145.fr \
                               --template-file ./azure-docker-vm.json \
                               --parameters "{\"adminUsername\": {\"value\": \"${USER_NAME}\"},
                                              \"adminPassword\": {\"value\": \"${ADMIN_PASS}\"},
                                              \"gitHubAccount\": {\"value\": \"${GITHUB_ACC}\"},
                                              \"dnsNameForPublicIP\": {\"value\": \"node${i}\"}}"
done