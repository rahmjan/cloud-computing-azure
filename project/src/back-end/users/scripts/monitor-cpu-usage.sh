#!/bin/bash -
#===============================================================================
#
#          FILE: monitor-cpu-usage.sh
#
#         USAGE: ./monitor-cpu-usage.sh
#
#   DESCRIPTION:
#
#       OPTIONS: ---

#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: Raziel Carvajal-Gomez (), raziel.carvajal@uclouvain.be
#  ORGANIZATION:
#       CREATED: 10/17/2018 10:20
#      REVISION:  ---
#===============================================================================
set -o nounset # Treat unset variables as an error
CPU_LIMIT="0.12"
MAX_TRY_N=2
# get a worker node
monitored_node='node'
echo "Monitoring node: ${monitored_node}"

tries_no=0
while :
do
  # Fetch CPU usage from one node
  cpu=`docker-machine ssh ${monitored_node} uptime | \
    awk '{print $(NF-2)}' | grep -Eo '[0-9].[0-9]{1,2}'`
  echo "CPU usage in last second: ${cpu}"
  status=`bc <<< "scale=2; if(${cpu} >= ${CPU_LIMIT}) print 0 else print 1 ;"`
  echo "CPU status: ${status}"
  if [ "${status}" == "0" ] ; then
    echo "Increasing number of tries..."
    let tries_no=tries_no+1
    if [ ${tries_no} -gt ${MAX_TRY_N} ] ; then
      echo "Adding more auth_server..."
      docker service scale authentication_users-daemon=6
      echo "END of ${0}"
      exit 0
    fi
  fi
  sleep 1
done

echo "End of ${0}."
