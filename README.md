# LINGI2145-2018-2019

The documentation must contain:

a list of services, detailing:
the role of the service;
the associated technologies;
how to build the container, or the description of a provided script that builds all containers automatically;
how to run a swarm of instances of the container in a VM hosted in the cloud (you do not need to tell us how to run VMs), or a pointer to the script that is doing this for us automatically;
the complete API of the service.
a justification of the technology choices for the different services;
a list of items logged in the logging service;
how to deploy all services on one or multiple VMs, preferably associated with a deployment script;
what is the required configuration on Microsoft Azure besides what the deployment scripts do (in particular, if there is need to deploy new Azure blobs, set up security groups, register Azure Functions, or anything else).
The code must contain:

all microservices under explicit folder names;
all scripts required to deploy and run the back-end, including configuration scripts for Azure using the command line interface or the programmable API (if you did not use these, there must be a HOW-TO explaining what to do on the web interface, but this is less convenient);
proper comments and presentation (indenting, no dead or commented code, etc.).

Your deliverable must include:

The code for each microservice, the Docker configuration files and any script allowing its easy deployment;
Instructions on the necessary Azure setup (or even better, a script performing those automatically);
Each microservice must be described in the README.md file of its source folder, including its role, limitations, and its complete API specification.