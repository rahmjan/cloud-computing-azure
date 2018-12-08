#!/bin/bash
# any environment variable in this script is defined, this should
# be done during the deployment of a service or in a Dockerfile

curl -X GET ${COUCHDB_URL}/_design/queries/_view/items_no_per_department?group=true >> result_set.json

Rscript plot.R

mv *.pdf plots
