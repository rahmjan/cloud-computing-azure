# Clean Docker client environment
echo "### Cleaning Docker client environment ..."
eval $(docker-machine env -u)

# Remove nodes
echo "### Removing nodes ..."
for c in {1..12} ; do
    docker-machine rm node$c --force &> /dev/null
done