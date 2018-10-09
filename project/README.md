# :books: LINGI2145 Project: a scalable shopping-cart application

LINGI2145 Autumn, 2018 -- Etienne Rivière and Raziel Carvajal-Gómez

The LINGI2145 project will last for most of the quadrimester, and is structured in two parts.

- In this first part, you will learn how to build the backend services of the application in a scalable manner and host it on Microsoft Cloud Computing platform: [Azure](https://azure.microsoft.com/en-us/global-infrastructure/).
- In a second part, you will learn how to implement efficient processing on the logs of the application, allowing new features for the application.

:pencil: **Note.** the second part description will be available later as a separate file.
<!-- [is available as a separate file](README-part2.md). -->

The description of the project on this page focuses on the general objectives and requirements.
You should first read this document carefully.
Then, you can proceed to the three practical bootstrap tutorials (links at the end of this document).

:pencil: **Note.** The grading rules for the project are available in a separate file [Grading.md](Grading.md).

# Your mission

Your team of two developers has been assigned with the design and implementation of the *backend* of a shopping-cart application (SCApp for short).
SCApp allows users to browse for items.
Once a user is logged in, he or she can add items to a shopping cart, and eventually checkout and buy the products.

The front-end development team already built a reactive Web interface using a modern framework, [React.js](https://reactjs.org).
This front-end prototype is already functional: it allows browsing through a pre-defined set of objects, and it emulates the cart and checkout functionalities.
However, it only uses local storage: the set of items in the shop (including their characteristics, their photo, etc.) and the state associated with the user session (content of the cart, etc.) are downloaded as static content, or maintained as local state in the client browser.

Obviously, this is not how a SCApp should work in practice: the list of items, their characteristics, availability, their photo etc. must be obtained dynamically from a remote back end service running in the Cloud.
Information about the user activity, such as her/his shopping cart content, must also be maintained and kept in the Cloud.
This is where your role starts.

Starting from the provided front-end, you will build a series of microservices running in the Cloud and supporting the *back-end* of the application.
In the following you will find the requirements that the management team has set up for the application.

# Functional requirements

SCApp recognizes three user roles:

- **Non-authenticated users** browse and see items, but they cannot add anything to their cart;
- **Authenticated users** add items to their cart, and proceed to checkout;
- **Administrators** have the possibility to change the information about existing items and to add new items to the catalog.

The first service you will need to build is therefore an *authentication service*.
Actually, this step is the focus of the [third bootstrap tutorial](tutorials/03_ProjectSetup_AuthenticationService.md) where we show how to build and run the service using [node.js](https://nodejs.org/en/) in a container running in Azure.
The tutorial also details how to connect the front-end to the back-end for this service.

The service allows **authenticated users** to perform the following actions.

- Browse through a collection of items, and see a page for each item individually.
- Add/Remove items to/from a shopping cart.
- Perform a purchase (checking out).
- Make purchases persistent. When a user leaves the application and later reconnects (possibly from another browser) the history of purchases must be preserved as well as the content of the cart.

The following functionalities are restricted to *administrators*.

- Use an interface for updating the characteristics of an item (price, description). Ideally, this interface could be a Web interface, but it is accepted that it is only a simple HTML form. A command-line API, or a RESTful API used with the `curl` tool is also acceptable.
- An interface for adding new items to the cart, including a new description, and a new photo.

# Technical requirements

The realization of your back-end must respect the following technical conventions:

- It must use a set of microservices offering RESTful APIs over HTTP.
- Each microservice must employ its own database, and this database must be able to scale to handle a (potentially large) number of future clients. In particular, we strongly recommend the use of [CouchDB](http://couchdb.apache.org).
- Microservices must be packaged as Docker containers, and use Docker networking to connect with their database.
- Every microservice must be properly documented and tested.

The storage of the images of the products must be externalized to [Azure Storage](https://docs.microsoft.com/en-us/azure/storage/).
When a new product is entered using the administrator's interface, the provided image must be uploaded to Azure Storage.

:gift: **Bonus.** A first version of your admin interface can consider that the format of the image provided by the administrator is correct (same height/width, JPEG format, and sufficiently small in size to display fast in the front-end application).
In a second version, you may process, validate and possibly resize/rescale the image before storing it in Azure Storage.
This can be done in a dedicated microservice, or using server-less processing with [Azure Functions](https://azure.microsoft.com/en-us/services/functions/).

#### Logging

In order to facilitate debugging and later allow processing of user-generated data, you must also provide a *logging microservice*.
Other microservices will asynchronously send logs to this service, who will store them in a CouchDB database as JSON objects.

:pencil: **Note.** For this service, we impose the use of the CouchDB as it will be necessary in the second part of the project.
You remain free to user other databases for your other microservices.

The logging service must log the following information:

- User actions, such as viewing an item, adding an item to the cart, buying an item, etc.
- Performance measurements, such as the time spent for answering a call by each microservice, the nature of the call, and the role of the client.
- Any other information you think can have an interest for the marketing department and for performance insights for the deployment team.

#### Elastic scaling

The load that each microservice will support over time can change, depending on the number of active users.
We therefore want to be able to add and remove instances of each microservice dynamically, a property known as *elastic scaling*.

Each of your microservice will be formed of a pair: a stateless service implementation (in node.js or a language of your choice) and a database.
The database and the service implementation must be able to scale independently.
For instance, the authentication service may decide to add a node to the database it uses (CouchDB) while keeping the number of service instances the same, or reversely use more service instances while keeping the database as it is.

# Deliverable

Your deliverable should target the deployment team (as well as the front end team), who should be able to set up and run your entire back-end on Azure using an account different than your own.

This will take the form of a private GitHub repository that the deployment and front-end teams will be able to access (in your case, the team of instructors for LINGI2145).
This repository is initialized as a fork of this one (which you already have if you followed the bootstrap tutorials).
You can pull changes made to the reference repository to your own, e.g. to get the instructions for the second part of the project.

The version that will be considered is the one available at the deadline (announced in class and on Moodle).
You will announce the availability of your deliverable by filling in an assignment on Moodle with the name of your repository and the confirmation that you have invited the three of us to access it.

Your deliverable must include:

- The code for each microservice, the Docker configuration files and any script allowing its easy deployment;
- Instructions on the necessary Azure setup (or even better, a script performing those automatically);
- Each microservice must be described in the README.md file of its source folder, including its role, limitations, and its complete API specification.

:pencil: **Note.** Feel free to send us a *pull request* with suggested changes.
Meaningful updates to the course GitHub repositories can be taken into account as a bonus when grading your project.

# Bootstrap tutorials

You must follow the next tutorials to get started on the project:

1. The [bootstrap tutorial](tutorials/01_ProjectSetup_Requirements.md) gives pointers to useful documentation and details what should be installed on your development machine;
1. The [front end tutorial](tutorials/02_ProjectSetup_FrontEnd.md) details how to run the provided front end for the application.
1. The [authentication microservice tutorial](tutorials/03_ProjectSetup_AuthenticationService.md) shows how to run a first microservice for the backend of the application and to connect this microservice from the application;
1. The CouchDB tutorial (**available soon**) details how to use the CouchDB NoSQL database for your microservices;
