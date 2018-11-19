#!/bin/bash -

USER_NAME=myAdmin
ADDRESS=francecentral.cloudapp.azure.com
SSH_KEY=./ssh/rsa_key
GITHUB_ACC=rahmjan
NUM_OF_NODES=4

declare -A SERVICES_OF_NODE
declare -A SERVICES
SERVICES=(["users-daemon"]=0 ["users-db"]=0 ["catalog"]=0 ["catalog-db"]=0 \
          ["shopping_cart"]=0 ["shopping_cart-db"]=0 ["logging"]=0 ["logging-db"]=0 \
          ["purchase"]=0 ["purchase-db"]=0 )

# Add key to know_hosts
for i in `seq 1 ${NUM_OF_NODES}`
do
    ssh-keyscan -Ht rsa node${i}-${GITHUB_ACC}.${ADDRESS} >> ~/.ssh/known_hosts
done

# Set SERVICES_OF_NODE array
for i in `seq 1 ${NUM_OF_NODES}`
do
    SERVICES_OF_NODE+=([$i]="0")
done

# Get number of services
for service in "${!SERVICES[@]}"
do
    SERVICES[$service]=$(docker service ls | grep "${service} " | awk '{print $4}'| awk -F '/' '{print $2}')
done

# Check CPU
while true
do
    # Get stats from nodes
    for i in `seq 1 ${NUM_OF_NODES}`
    do
        SERVICES_OF_NODE[$i]=$(ssh -i ${SSH_KEY} ${USER_NAME}@node${i}-${GITHUB_ACC}.${ADDRESS} "docker stats --no-stream")
    done

    # Parse and check
    for service in "${!SERVICES[@]}"
    do
        cpu_usage=0
        scale_to=0

        for i in `seq 1 ${NUM_OF_NODES}`
        do
            value=$(echo "${SERVICES_OF_NODE[$i]}" | grep "${service} " | awk '{sum += $3} END {print sum}')
            cpu_usage=$(echo "${cpu_usage} ${value}" | awk '{print $1 + $2}')
        done

        cpu_usage=$(echo "${cpu_usage} ${NUM_OF_NODES}" | awk '{print $1 / $2}')

        # Big Switch
        if (( $(echo "5 > $cpu_usage" | bc -l) ))
        then
            scale_to=1
        elif (( $(echo "10 > $cpu_usage" | bc -l) ))
        then
            scale_to=3
        elif (( $(echo "20 > $cpu_usage" | bc -l) ))
        then
            scale_to=6
        else
            scale_to=9
        fi

        if (( $(echo "${SERVICES[$service]} != ${scale_to}" | bc -l) ))
        then
            SERVICES[$service]=${scale_to}
            echo "${service}: ${cpu_usage}% cpu, scale to number of services: ${scale_to}"
            docker service scale mySwarm_${service}=${scale_to} 1> /dev/null
        fi
    done
done
