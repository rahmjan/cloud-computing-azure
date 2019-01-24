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
To clean project and destroy VMs: `make [build_script]-clean`.

#### Technology

Each service is written in *javascript* and uses the *CouchDB* database.
The *CouchDB* was selected because it natively supports *JSON* format and it has *REST* API for its control.
The *admin* identity for database is `admin` with password `admin`.

#### Services

- **Users** - Registration, authentication and authorization of users.
- **Shopping cart** - Stores details of user's shopping cart.
- **Purchase** - Allows make purchase and store its history.
- **Logging** - Logs almost everything that happens.
- **Catalog** - Stores catalog of products and allows its change.

For more details or API of services you can find in *README.md* file
of their respective source folders in `./project/src/back-end/[service]`.

<!--
You did an excellent job in terms of development. Your scripts/test allow to deploy your application with almost no efforts for reviewers. Besides, there is no documentation in the sources that allows to understand the propose of each REST call.

I may suggest to improve the way you present any project. Even if the documentation is enough to describe every service, the lack of a description in a first document do not show that you have manage to complete what was demanded.  
-->
