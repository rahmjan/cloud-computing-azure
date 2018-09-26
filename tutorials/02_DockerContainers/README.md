# :books: Lab Session 2: Docker Containers
LINGI2145 Autumn 2018 -- Etienne Rivière and Raziel Carvajal-Gómez

# Objectives

Learn how to use Docker.
As we did during the [first lab session](https://github.com/CloudLargeScale-UCLouvain/LINGI2145-2018-2019/tree/master/tutorials/01_VirtualMachines#books-lab-session-1-virtual-machines), we will deploy a representative application ([Wordpress](https://wordpress.com/)) and its support database but this time we will use Docker to build our virtual infrastructure.

By doing this tutorial you will learn:

- the basic commands of Docker;
- how to create and execute containers;
- how to set up a virtual network in Docker;
- how deploy a web application within a virtual infrastructure.

:warning:
We encourage you to follow the tutorial solo.

:warning:
As for all other tutorials and for the project in LINGI2145, this tutorial assumes you are using an operating system with a UNIX-like command line built-in, such as MacOS X or any flavor of GNU/Linux.

:warning:
This tutorial requires you to complete some exercises that are tagged with this icon :pencil2:

# Prerequisites
Depending on your Operating System (OS), use on of the following links and install Docker.

- [Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
- Docker for GNU/Linux flavors:
  - [Debian](https://docs.docker.com/install/linux/docker-ce/debian/);
  - [Fedora](https://docs.docker.com/install/linux/docker-ce/fedora/);
  - [Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/);

:warning:
**This message only concerns GNU/Linux users.**
Docker requires administrator's privileges. Avoid writing `sudo` or `su` before every Docker command by following the steps in section **Manage Docker as non-root user** of the official documentation ([available here](https://docs.docker.com/install/linux/linux-postinstall/)).

Test if your installation works correctly by running your first container with `docker run hello-world`.

**Note:**
You may wonder why running containers on Mac OS X is even possible, given that the underlying host OS is not Linux?
In fact, the Mac OS version of docker CE runs a lightweight virtual machine running a minimalistic Linux OS, just to host containers.

# Lightweight virtualization with Docker
Docker uses operating-system level virtualization to run applications inside *Linux containers*.
This type of virtualization is also often called *containerization*.

#### Containers and images
A container is an instance of an executable package or container *image* that stores all the files that are required to run an application.
For example, running `docker run hello-world` creates a container from the `hello-world` image.
This image is itself built based on a minimalistic GNU/Linux distribution together with a simple executable or shell script printing the message.

**Dockerfiles: configuration files for building new images.**
Docker builds images by reading instructions from a text file called the *Dockerfile*.
It contains all the necessary commands to build the environment for running the application.
The `docker build` command reads the Dockerfile and executes the commands in the order in which they appear in the file.
This creates the different layers of the image file system.

Start by creating a new file `Dockerfile` with the following content:

``` dockerfile
# base is a minimalistic GNU/Linux distribution
FROM alpine

# set the working directory
WORKDIR /usr/hello

# commands execute to create the environment
RUN echo "$(uname -s)!" > distro.txt

# this sets an environment variable
ENV CURRENT_DIR "/usr/hello"

# CMD is the command that will be executed when starting a container from this image
# Note that previously-set environment variables can be used
CMD echo -e "Welcome to $(cat ${CURRENT_DIR}/distro.txt)\nYour location is ${CURRENT_DIR}"
```

From the same directory, create your first image with `docker build -t image-hello . `.
Option `-t` names the image.
Docker looks for a `Dockerfile` in the directory given as the last argument (current directory with the period character).
Image `image-hello` is now part of your local catalog of images.
You can list all locally-available images with `docker images`.

:eyeglasses: You can read about the best practices for writing Dockerfiles ([link here](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)).

**Creating containers.**
You are now ready to create a new container from the previously-built image `image-hello`.
Do so using `docker run --name container-of-hello image-hello`.
As specified by the CMD line in the Dockerfile, once the container boots a welcome message is sent to the standard output.
The container then terminates.
In general, containers keep running applications in the background and we have to terminate them explicitly.
You can see the status of containers running on your host with `docker ps -a`.

:bulb: **Notice** that the status of `container-of-hello` is set to **Exited (0)**, which means that our container terminated normally.

#### Common Docker commands
To see all available Docker commands type `docker`.
Whenever you want to get more details about any command, your first reflex must be to take a look at its documentation.
Or you may consult the description of base commands ([available  here](https://docs.docker.com/engine/reference/commandline/docker/)).

# Deploy and run Wordpress with Docker
We will see now how to use Docker to deploy WordPress, just as we did in the first tutorial but in a simpler and more programmatic manner.
As seen in tutorial 1, we require a virtual infrastructure of two hosts.
One host will store the dynamic content of the application in a database and a second host will serve as web server.

:warning: We refer to other sections of the first tutorial, particularly, we will reuse several configuration files to deploy Wordpress.
If you weren't able to make it work, please, let the teaching assistants know about it.

It is good practice to create a Docker network per application and then attach containers to this network.
Create a new network for our application with `docker network create wordpress-network`.
We will use this network for the rest of this section.

#### Pulling images from Docker's public registry
When an image is not available in your local host, Docker pulls images from a public repository that contains ready-made images for several applications.
We will use existing images from that repository.

As we did in tutorial 1, for the database management system we use MariaDB (Docker image [available here](https://hub.docker.com/_/mariadb/)) and all required packages to deploy a Wordpress server are contained in a Docker image too ([available here](https://hub.docker.com/_/wordpress/)).

#### Setting up the database
Using a database system for the first time requires to set a password for the DB system manager (also called `root`).
Root users have the necessary rights to create/update DBs.
The following Dockerfile configures MariaDB.

``` Dockerfile
# we rely on a ready-made image of MariaDB
FROM mariadb

# this is how we set the password of a DB system manager
ENV MYSQL_ROOT_PASSWORD mariadb

# we create the DB that Wordpress need
ENV MYSQL_DATABASE wordpress
```

Notice that all environment variables defined in a Dockerfile are available in containers.
Create an image of this Dockerfile with `docker build -t mariadb-with-wp-db .`

:question: **Question.**
Say whether the next affirmation is correct or not; argue your answer.
*There is no `cmd` instruction in the previous Dockerfile, therefore, a container of this image terminates after its creation.*

:warning: You may verify the status of your container with `docker ps -aq`.

:warning: If something went wrong, you can get the logs of the execution with `docker logs container-of-wp-db`.

You can now create a container from your new image and attach it to the network we create in [Section 2](#deploy-and-run-wordpress-with-docker) as follows: `docker run --name wordpress-db --network wordpress-network -d mariadb-with-wp-db`

At this point, you must see your container running.
**That's it**, you just configured a DB ready to be plugged with a Wordpress server.

:pencil2: **Exercise.**
Based on what you have learn from tutorial 1 ([link here](https://github.com/CloudLargeScale-UCLouvain/LINGI2145-2018-2019/tree/master/tutorials/01_VirtualMachines#setting-up-the-database-host)), you are asked to list all DBs within our new container.
Read at the help of command `docker exec --help` and confirm that `wordpress` is part of the availables DBs.

#### Setting up a WordPress server
Until this point, we show you how to create containers from a Dockerfile.
For some images, it is possible to instantiate a containerized application with a single command.
This is the case of the Wordpress image for Docker.
In this section we show you how to create a container of Wordpress and link it to our network, that currently has one MariaDB container attached to it.

We can now instantiate a Wordpress container using the next command.

`docker run --name wordpress --network wordpress-network -e WORDPRESS_DB_PASSWORD=mariadb --link wodpress-db:mysql -p 80:80 -d wordpress`

Here you have more details about every option.

- `-e WORDPRESS_DB_PASSWORD=...` password we specify during the creation of image `mariadb-with-wp-db`
- `-p HostPort:ContainerPort` opens and publishes port from the Docker container on the Docker host (OS where your Docker daemon is running). Here, port `80` of host is redirected to port `80` of the container
- `--link` flag takes the form: `--link <name-of-db-container>:alias`

That's it, you should be able to see your WordPress deployment in action at [http://127.0.0.1](http://127.0.0.1).

# :pencil2: Exercise: Add a web interface for MySQL
We want to add a second HTTP server, PHPMyAdmin, offering a web interface for MariaDB.
PHPMyAdmin is a free software tool written in PHP, intended to handle the administration of MariaDB (or any MYSQL-like database) over a Web interface.
We will use the phpMyAdmin image ([available here](https://hub.docker.com/r/phpmyadmin/phpmyadmin/)) from the Docker repository and connect it to our DB container.

:pencil: **Note.**
We will let you do this by yourself.
Follow the instructions at the link we provide to create a container of PHPMyAdmin. You can create a Dockerfile or instantiate the image in a single command.
Once this is done, attach your new container to the virtual network `wordpress-network`, run it and make the port 8081 available to access PHPMyAdmin from your web browser.

You can now see and manage your SQL databases via a web browser with the URL  [http://127.0.0.1:8081](http://127.0.0.1:8081) as shown below.

![image](figs/phpMyAdmin.png)

**Log in using the root credentials of MariaDB!**
You should be able to see the `wordpress` database in the list of databases, and explore its content.

### Cleaning up the local setup

- Stop all the containers
	`docker stop $(docker ps -aq)`
- Delete the containers
	`docker rm $(docker ps -aq)`

Optionally, you can delete the Docker images using `docker rmi <image-name>`

:checkered_flag: **Congratulations, you made it !**
You now have the basics of how to deploy applications with Docker.
For further reading, we invite you to complete the Get started tutorial of Docker ([available here](https://docs.docker.com/get-started/part2/)).
