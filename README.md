# LINGI2145 - Cloud Computing

This is overview of our project for Cloud Computing.

#### Build

We created tree scripts for deployment of back-end:

- **Local** - In your local machine will create with *docker-compose* containers for services.  
              How to deploy: `make local`.
- **Local VMs** - It will create local VMs and deploy docker-swarm. This should simulate Azure solution.  
                  How to deploy: `make local-VMs`.
- **Azure** - This script will create machine at Azure and deploy swarm.  
              How to deploy: `make azure`.

All configurations is located in folder `./project/src/back-end/config/`.  
The **Makefile** you can find in `./project/`.

#### Technology

Each service is written in *javascript* and uses the *CouchDB* database.

#### Services

- **Users** - Registration, authentication and authorization of users.
- **Shopping cart** - Stores details of user's shopping cart.
- **Purchase** - Allows make purchase and store its history.
- **Logging** - Logs almost everything that happens.
- **Catalog** - Stores catalog of products and allows its change.

For more details or API of services you can find in *README.md* file
of their respective source folder in `./project/src/back-end/[service]`.


