#!/bin/bash -

USER_NAME=myAdmin
ADDRESS=francecentral.cloudapp.azure.com
SSH_KEY=./ssh/rsa_key
GITHUB_ACC=rahmjan
NUM_OF_NODES=2

declare -A SERVICES
SERVICES=(["users-daemon"]="1" ["users-db"]="1" ["catalog"]="1" ["catalog-db"]="1" \
          ["shopping_cart"]="1" ["shopping_cart-db"]="1" ["logging"]="1" ["logging-db"]="1" \
          ["purchase"]="1" ["purchase-db"]="1")

# Add key to know_hosts
for i in `seq 1 ${NUM_OF_NODES}`
do
    ssh-keyscan -Ht rsa node${i}-${GITHUB_ACC}.${ADDRESS} >> ~/.ssh/known_hosts
done

# Check CPU
while true
do
    for service in "${SERVICES[@]}"
    do
        cpu_usage=0
        scale_to=0

        for i in `seq 1 ${NUM_OF_NODES}`
        do
            value=$(ssh -i ${SSH_KEY} ${USER_NAME}@node${i}-${GITHUB_ACC}.${ADDRESS} "docker stats --no-stream | grep ${service} | awk '{sum += \$3} END {print sum}'")
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

        if (( "${SERVICES[$service]}" != "${scale_to}" ))
        then
            SERVICES[$service]=${scale_to}
            echo "${service}: ${cpu_usage}% cpu, scale to number of services: ${scale_to}"
            docker service scale mySwarm_${service}=${scale_to} 1> /dev/null
        fi
    done
done
