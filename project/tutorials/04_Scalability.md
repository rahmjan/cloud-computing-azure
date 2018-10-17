# :books: Lab Session 4: Elastic authentication service
LINGI2145 Autumn, 2018 -- Etienne Rivière and Raziel Carvajal-Gómez

# Objectives
In this tutorial, you will learn how to configure a cluster of Virtual Machines (VMs) and deploy the provided authentication service (from the project), within this cluster. We implement a basic policy of elastic scaling that monitors the CPU usage of your authentication service to instantiate new resources.

:warning: **Requirements.** Follow the installation installation instructions of [docker-machine](https://docs.docker.com/machine/install-machine/) and [docker-compose](https://docs.docker.com/compose/install/), both tools are required for this tutorial.

:warning: The working directory for this tutorial is `project/src/back-end/users`

# Service deployment with `docker stack`

Until now you have deployed services by:

1. **building the images** that your service requires
2. **creating a network** of containers
3. **running and linking containers** within your network

In docker stack, all these steps can be performed with a single command:

- `docker stack deploy -c SERVICE_TEMPLATE SERVICE_NAME`

This command asks Docker to instantiate the service `SERVICE_NAME` described in the configuration file `SERVICE_TEMPLATE`. Every detail about your service (Docker images, dependencies between containers, exposed ports, etc...) is written in the file `SERVICE_TEMPLATE`.
Here you have a first template for our authentication service (file `users-application.yml`):

```yml
version: "3"  # docker-compose version
networks:
  users-app:  # we rely on only one network
services:     # list all services for your application
  # database of users
  users-db:
    # fetch pre-build image from a registry on Docker Hub (https://hub.docker.com/)
    image: mexicalli/users-db:latest
    # relative location of Dockerfile
    build: src/db
    networks: ["users-app"]
    # expose port 5984 of host node
    ports: [ "5984:5984" ]
    deploy:
      replicas: 1
      resources:
        limits:
          cpus: "0.1" # use up to 10% of CPU over cores in a host node
          memory: 50M # use up to 50MB of memory in a host node
      restart_policy: # restart if something went wrong
        condition: on-failure
  # server that listens HTTP requests
  users-daemon:
    image: mexicalli/users-daemon:latest
    build: ./
    # wait until service db is up
    depends_on: [ "users-db" ]
    networks: ["users-app"]
    # expose port 80 of host node
    ports: [ "80:80" ]
    deploy:
      replicas: 1
      resources:
        limits:
          cpus: "0.1"
          memory: 50M
      # placement:
      #   constraints:
      #     - node.labels.type == daemon
  # Docker user interface for swarms
  visualizer:
    image: dockersamples/visualizer:stable
    ports: [ "8080:8080" ]
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
    deploy:
      placement:
        constraints:
          - node.role == manager

```
**A service template is easy to follow**.
In our authentication service, we require a database (service `users-db`) and a server (`users-daemon`) that accepts HTTP requests on port `80`.

Recall, an instance of `users-daemon` listens on port `80`.
Having the tag `ports: [ "80:80" ]` means that a machine hosting `users-daemon` exposes port `80` and forwards incoming traffic to port `80` where the container actually listens.
Given that authentication information is stored in a database, the tag `depends_on: [ "users-db" ]` makes the database reachable from the HTTP server.

#### Deploy your cluster with Docker swarm

A swarm in Docker is basically a cluster of nodes (VMs or physical machines) that host containers.
Nodes within a swarm are linked by a network, that is, any pair of nodes from a swarm can communicate with each other.
Nodes in swarm can be either **managers** or **workers**.
Generally, there must be at least one node with the role of manager and any number of workers per swarm.

With all this in mind, you are ready to create your swarm. Create a swarm with `docker swarm init`.

:warning: If you have more than one network interface, you should type `docker swarm init --advertise-addr <ONE_VALID_IP_ON_YOUR_LAPTOP>` to instantiate a swarm manager.

You should get an output similar to this one:

```bash
Swarm initialized: current node (c2knf2tb3ct0gza9k1fujq5ct) is now a manager.

To add a worker to this swarm, run the following command:

    'docker swarm join --token <TOKEN_ID> <IP_OF_YOUR_LOCAL_HOST>:2377'

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```

At this point you have a swarm with a single node, your local host that acts as a swarm manager too.
For now, we keep working with this swarm of one node.

A new service `visualizer` was added to the configuration file of our authentication service to fetch information from the swarm manager.
This is a GUI (Graphical User Interface) that Docker provides to have a global view of swarms.

:warning: Even if this new service is within the template of our authentication service, notice that `visualizer` does not interact with any other service.

Now we have all we need to deploy our **authentication service** using:

- `docker stack deploy -c users-application.yml authentication`

Use `visualizer` to get a view of your swarm, by visiting `127.0.0.1:8080` in a web browser.
You should get a page similar to this:

![image](images/auth-stack.png)

You can now confirm that your swarm contains a single node and all containers of the authentication service are running on it.
Now let's learn how to add more nodes to your swarm.

:warning: Stop this basic deployment with `docker stack rm authentication` and leave the swarm with `docker swarm leave --force`.

# Increase the size of your Swarm

In this section you will create a virtual machine (VM), running on your local host, and add it to your swarm.
This requires you to install [VirtualBox](https://www.virtualbox.org/wiki/Downloads) and [docker-machine](https://docs.docker.com/machine/install-machine/).
In next lab sessions, we will guide you to add VMs running on Microsoft Azure.

#### Set up Docker machine to create VMs

In this section you will create a virtual machine (VM), running on your local host, which will be used to create your swarm. Docker Machine lets you install Docker Engine on virtual hosts, and manage the hosts with `docker-machine` commands.

1. Install [Docker Machine](https://docs.docker.com/machine/install-machine/).
    - MacOS users should already have docker machine installed with their docker installation.
1. Test if docker-machine is working:
    - `docker-machine version`
1. We need to install virtualBox in order to create linux-VMs with docker. If you do not have virtualBox already installed in your machine, install from [here](https://www.virtualbox.org/wiki/Downloads).
1. Create a VM called `node` as follows:
    - `docker-machine create node`
    - You can now list all running VMs with `docker-machine ls`
1. Create a new swarm with: `docker swarm init`
1. Add `node` to your swarm as follows, replacing `<TOKEN>` and `<SWARM_MANAGER_IP>` with the output of the swarm initialization you got in the previous step (step 7):
    - `docker-machine ssh node "docker swarm join --token <TOKEN>  <SWARM_MANAGER_IP>:2377"`
    - Find more details to increase your swarm size in the [official documentation](https://docs.docker.com/get-started/part4/#understanding-swarm-clusters).
1. You can monitor any node within your swarm from the swarm manager via `docker node`.
    - list all nodes with `docker node ls`
    - you may update each node configuration, for instance, alter labels of our new node with `docker node update --label-add type=daemon node`
      - :bulb: you can now place containers in any node tagged as a daemon (search for this tag in `users-application.yml`)
      - :warning: You can now uncomment the option `placement:` in `users-application.yml`
1. Deploy your service again:
    - `docker stack deploy -c users-application.yml authentication`
1. Monitor your service with:
    - `docker stack ps authentication`
    - `docker service ls`
1. With the visualizer, you can now confirm that your swarm contains two nodes and all containers of the authentication service are running.  

Create a new user on your service via the REST API:
- `curl -X POST --data 'username=bob&password=xyz' <swarm-manager-IP>/user`

desired output: `{"status":"success","token":<a_super_long_token_here>}`

#### Add resources as needed (elastic scaling)

Last but not least, we show you how to add containers on-the-fly by monitoring the CPU usage of your authentication service.

You might notice that the manager node keeps track of workers and containers within a swarm. We take advantage of this global observer to monitor CPU usage of nodes, to implement a simple rule of scalability: *when a certain threshold of CPU usage within nodes is reached, more containers are deployed*. Here you have the code that implements this rule (file: `scripts/monitor-cpu-usage.sh`):

```bash
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
      docker service scale auth_micro_service_auth_server=6
      echo "END of ${0}"
      exit 0
    fi
  fi
  sleep 1
done

echo "End of ${0}."
```

In order to see our rule of scalability in practice, we will inject traffic to our authentication service with the program [artillery](https://artillery.io/); you can install this tool by doing: `npm -g install artillery`. Now open a new terminal and do as follows:

1. In a new terminal
    - get a shell of your docker swarm with: `eval $(docker-machine env swarm-manager)`
    - in the directory `scripts` launch the monitor of CPU usage with `./monitor-cpu-usage.sh`
1. In another terminal
    - register a new user with: ``curl -X POST -d 'username=xx&password=yy' <swarm-manager-IP>/user``
    - in the directory `tests` you will find a YML file that tells `artillery` how to perform HTTP requests to our authentication microservice
      - deploy such use case of traffic injection via: `artillery run login-user-load-test.yml`


 Eventually, you'll see that the CPU usage increases looking at the logs of the bash script and then, you must observe the log `Adding more users-daemon...`

 Looking at the docker visualizer you'll see new instances of the HTTP server running within your swarm, as shown here:

 ![image](images/load-balancing-result.png)


:checkered_flag: **Congratulations**, you have now a micro-service that elastically scales when needed.


:warning: **Delete everything.**
If you're done and want to clean the containers and VMs :

- Remove the authentication microservice:
  - `docker stack rm authentication`
- And finally, remove the virtual machines you created:
  - `docker-machine rm name_of_the_machine`
  - Remember you can list your VMs with: `docker-machine ls`
