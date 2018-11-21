#!/bin/bash -
#===============================================================================
#
#          FILE: fill_db.sh
#
#         USAGE: ./fill_db.sh
#
#   DESCRIPTION:
#
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: Raziel Carvajal-Gomez (), raziel.carvajal@uclouvain.be
#  ORGANIZATION:
#       CREATED: 04/19/2018 20:24
#      REVISION:  ---
#===============================================================================

set -o nounset                              # Treat unset variables as an error
url=${1}
dir=${2}
lines=`wc -l ${dir}/output.json | awk '{print $1}'`
i=1
while [ ${i} -lt ${lines} ] ; do
  doc=`head -${i} ${dir}/output.json | tail -1`
  curl -X POST --data "${doc}" -H "Content-Type: application/json" ${url}
  let i=i+1
done

echo "END OF ${0}"
