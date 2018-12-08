# :books: Setting up the VM for Spark lab
LINGI2145 Spring 2018 -- Etienne Rivière, Raziel Carvajal-Gómez and Paolo Laffranchini

The lab session on Spark requires you to set up a pre-configured Virtual Machine (VM). This deployment uses some well-known tools for automatically creating and provisioning development environments: [Vagrant](https://www.vagrantup.com/intro/index.html) and [Puppet](https://puppet.com/).

:pencil: **Note.** You will not interact with the details of these tools, just follow the instructions and they will do the job for you.

# Creating and provisioning the VM with Vagrant

These instructions will help you to set up an Ubuntu VM with Spark, Hadoop and other useful tools.


1. Install VirtualBox (if you don't already have it) from [here](https://www.virtualbox.org/wiki/Downloads).

1. Install Vagrant from the official packages provided [here](https://www.vagrantup.com/downloads.html).

1. The following configuration files are required to deploy a VM.

	- `src/vagrantfile` Template of a VM that Vagrant requires
	- `src/manifest/base.pp` Software to be installed on the VM by Puppet

You are now ready to deploy the VM, follow these steps:

1. Go to the `src` directory and type down `vagrant up`. This will create the VM, run Puppet to configure such VM and install all required software.

	- :warning: Do not attempt to use the VM until Vagrant returns the shell to you on host OS

	- :warning: **Be patient.** This procedure takes approximately 30 minutes.

1. **Log into the VM**. The default login and password are both **vagrant**.

:pencil: **Note.** The `src` directory serves as a shared directory between the VM and your laptop. On the VM, this directory is mounted under `/vagrant` and `SparkLab` lab folder is mounted at `/labs`.

# Useful vagrant commands for reference

- `vagrant up`: starts the VM and provisions the vagrant environment
- `vagrant halt`: stops the VM
- `vagrant suspend`: suspends the VM
- `vagrant resume`: resume a suspended vagrant machine
- `vagrant reload`: restarts vagrant machine, loads new Vagrantfile configuration

:pencil: **Note.** If you try to log in before the machine is set up initially, you can get the cursor back in host OS by pressing right `ctrl` key (Ubuntu) or left `command` key (Mac).
