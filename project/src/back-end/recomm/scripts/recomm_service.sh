#!/usr/bin/env bash

### Load map/reduce queries ###
LOG_DB=http://admin:admin@logging-db:5984/logs

# Wait for LOG DB
until curl -X GET ${LOG_DB} ; do
	sleep 1
done

# Format *.js
echo "Apply a formatter for each view"
mkdir ./scripts/formatter_output
DEBUG=views* node ./scripts/func_to_string.js
if [[ ${?} != 0 ]]; then
  echo -e "ERROR: during the creation of views\nEND OF \{0}"
  exit 1
fi
echo -e "\tDONE"

# Push *.js to DB
cd ./scripts/formatter_output
echo "Creation of views for DB"
for view in `ls *.js`; do
  curl -X PUT "${LOG_DB}/_design/queries" --upload-file ${view}

  if [[ ${?} != 0 ]]; then
    echo -e "ERROR: during the creation of view ${view}\nEND OF ${0}"
    exit 1
  fi
done
echo -e "\tDONE"


### Run loop ###
SERVICE_ADDRESS=http://recomm:80
WHAT='Content-Type: application/json'

while true
do
	QUERY=$(curl "${LOG_DB}/_design/queries/_view/bestPurchases?group=true")
	curl -X POST -d "${QUERY}" -H "${WHAT}" ${SERVICE_ADDRESS}/recomm/update
	sleep 10
done

#######################################
#curl "${LOG_DB}/_design/queries/_view/bestPurchases?group=true"
#http://admin:admin@recomm-db:5984/recomms

#prodID=6
#REV=$(curl ${DB_URL}/${prodID} | jq -r ._rev)

#product_data=$(cat ./purchases.json)
#WHAT='Content-Type: application/json'
#SERVICE_ADDRESS=localhost
#curl -X GET -d "${product_data}" -H "${WHAT}" ${SERVICE_ADDRESS}:1005/recomm

#LOG_DB=http://admin:admin@localhost:6004/logs
#
#SERVICE_ADDRESS=localhost:1005