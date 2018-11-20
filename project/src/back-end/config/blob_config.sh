#!/usr/bin/env bash

### Create Azure Blob ###
echo "### Creating Azure Blob"

# Resource group
az group create --name lingi2145.fr \
                --location francecentral

# Storage
az storage account create \
                --name myblob9 \
                --location francecentral \
                --resource-group lingi2145.fr \
                --sku Standard_LRS \
                --kind blobstorage --access-tier hot

# Key
blobStorageAccountKey=$(az storage account keys list -g lingi2145.fr \
                        -n myblob9 --query [0].value --output tsv)

# Container
az storage container create \
                -n images \
                --account-name myblob9 \
                --public-access container \
                --account-key ${blobStorageAccountKey}

echo "The pictures are accessible on: https://myblob9.blob.core.windows.net/images/"


### Test upload of image ###
echo "### Test upload of image"
IMAGE=mango.jpg

# Download image
curl -X GET https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/${IMAGE} \
            --output ${IMAGE}

# SAS key
SAS=$(az storage blob generate-sas \
                --account-name myblob9 \
                --account-key ${blobStorageAccountKey} \
                --container-name images \
                --name ${IMAGE} \
                --permissions acdrw \
                --expiry 2020-05-15 )

SAS=$(echo $SAS | tr -d '"')

# Upload
echo "### Uploading..."
curl -X PUT -T ${IMAGE} -H "x-ms-date: $(date -u)" -H "x-ms-blob-type: BlockBlob" "https://myblob9.blob.core.windows.net/images/${IMAGE}?${SAS}"

rm ${IMAGE}
echo "The test picture of mango is accessible on: https://myblob9.blob.core.windows.net/images/mango.jpg"