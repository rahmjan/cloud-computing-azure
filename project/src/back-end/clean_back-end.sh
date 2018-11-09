#!/usr/bin/env bash

DNS_NAME=(authentication logging)

# Clean Docker client environment
echo "### Cleaning Docker client environment ..."
eval $(docker-machine env -u)

# Remove nodes
echo "### Removing nodes ..."
for c in {0..10} ; do
    docker-machine rm node$c --force &> /dev/null
done