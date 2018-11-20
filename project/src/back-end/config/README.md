# Configuration
Each of the configuration has it's own creation script `./create_back-end_[build_script].sh`
and clean script `./clean_back-end_[build_script].sh`.

#### Local
The local configuration only run `docker-compose up --build` command with default `docker-compose.yml` config file.
This file contains all the docker setting for containers deployment.

The main point of this configuration is testing and developing of back-end services without worrying about connection problems. 

#### Local VMs
This configuration is mean for simulation of Azure VMs in local setting. It creates local VMs 
(the number of VM can be change in the script) and deploy them in the docker stack. 

Configuration file is `./swarm_config.yml`. This config also deploy Visualizer where we can check
the status of containers. It runs on port `8080`.

Unfortunately this configuration is not fully functional because we have encountered a problem where containers refuse to 
communicate between VMs and also between VM and localhost. This is the reason why we decided to focus on development on Azure platform.

#### Azure
The Azure configuration deploys back-end to Microsoft Azure solution. It will ask you to log in, after it will
create resource group *lingi2145.fr* and VMs with parameters:
```
USER_NAME=myAdmin
ADMIN_PASS=Admin1234
ADDRESS=francecentral.cloudapp.azure.com
SSH_KEY=./ssh/rsa_key
GITHUB_ACC=rahmjan
NUM_OF_NODES=4         #// Number of VMs
```
After the creations, script will put rsa fingerprints of VMs inside your `~/.ssh/known_hosts`.
This way, script can continue without interruption and deploy docker stack. Configuration file is also `./swarm_config.yml`.

In the folder `./ssh/`, there are private and public key for ssh connection to the VMs.
File `./azure-docker-vm.json` is template of VM which are used for creation of VM.

###### Blob 
Blob configuration script (`./blob_config.sh`) will create Azure blob for storage of images.
It will also try to upload test image *mango.jpg*.

- How to [upload image](../catalog/README.md).

#### Elastic scaling
All of our services support elastic scalability, even their databases. For this purpose we run script `./elastic_scaling_azure.sh` on manager node.
It access all the nodes and compute the total usage of CPU for one service. If it surpass threshold value,
it will change the number of instance of service.

Scalability was tested by Artillery test tool which uses workload injection. The configuration file for
testing can be found in `/back-end/[service_name]/tests/[name_of_test].yml`.

