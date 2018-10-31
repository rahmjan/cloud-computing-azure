# :books: NoSQL databases
LINGI2145 Autumn 2018 -- Etienne Rivière and Raziel Carvajal-Gómez

# Introduction

This tutorial shows you how to query the content of a NoSQL database.
You will use a public dataset stored in form of JSON documents as real-life scenario.

:warning: We ask you to complete several tasks, based on what you have learn in previous tutorials.
These tasks are tagged with the symbol :pencil2:

### CouchDB in a Nutshell

[CouchDB](http://docs.couchdb.org/en/stable/index.html) is a NoSQL database system where data is kept in form of JSON documents.
Every aspect of such system, as well as the information stored on it, is controlled via HTTP requests.
In other words, CouchDB provides an HTTP REST API to interact with it.


With the `curl` utility, you have access to the HTTP protocol in your command-line.
For instance, you may fetch information about a CouchDB daemon with:

```bash
# by default curl performs a GET request
curl http://${HOST_RUNNING_COUCHDB}:5984
```

to get the following output.

```json
{
  "couchdb": "Welcome",
  "version": "2.0.0",
  "vendor": {
    "name": "The Apache Software Foundation"
  }
}
```
Here you have a list of useful commands:

- Create a database
    - `curl -x PUT http://${HOST_RUNNING_COUCHDB}:5984/${DB_NAME}`
- List available databases
    - `curl http://${HOST_RUNNING_COUCHDB}:5984/_all_dbs`
- Delete a database
    - `curl -x DELETE http://${HOST_RUNNING_COUCHDB}:5984/${DB_NAME}`
- Store a JSON document in a database
    - `curl -X POST --data "${JSON_DOC}" -H "Content-Type: application/json" http://${HOST_RUNNING_COUCHDB}:5984/${DB_NAME}`
        - Where `${JSON_DOC}` is an string of a JSON object, for instance: `JSON_DOC={"date": "01/01/1968", "event": "watch-tv"}`

:pencil: **Note.** This is just an introduction of CouchDB, in the next section you will learn how to query stored JSON documents. Find more details about how to handle databases in theses links:
- [Get started guide](http://docs.couchdb.org/en/stable/intro/tour.html#getting-started)
- [Design of JSON documents](http://docs.couchdb.org/en/stable/ddocs/ddocs.html#design-documents)

We will show the use of [Fauxton](http://docs.couchdb.org/en/stable/intro/tour.html?highlight=fauxton#welcome-to-fauxton), the built-in Web interface of CouchDB, to create queries of a database following a concrete example.

# :pencil2: Exercise: Analysis of Grocery Orders

As member of the World Health Organization (WHO), you are in charge of reporting the amount of products that US citizens buy on-line, grouped by product categories (commonly known as departments).
You are provided with a sample of the Open Source dataset of [Instacart](https://tech.instacart.com/3-million-instacart-orders-open-sourced-d40d29ead6f2), a service to buy groceries on-line.
This dataset is provided in form of a Docker container of CouchDB where orders (purchases) follow this format:

```json
{
  "order_id": 4,
  "product_id": 46842,
  "product_name": "Plain Pre-Sliced Bagels",
  "department_name": "bakery"
}
```

You can start exploring this dataset using the following steps:

1. A simple application of three services is list in the file `instacart-example.yml` where:
    - **instacart_sample** is a CouchDB container
    - **init_db** fills the database with a sample of the Insacart dataset
    - **plotter** creates an histogram
1. Build containers.
1. Initialize two containers via:
    - `docker-compose -f ${YML_FILE} up -d instacart_sample init_db`
    - :warning: It takes some minutes to initialize the database, check the logs of service `init_db` to see what is going on
1. Open Fauxton by visiting the address `127.0.0.1:5984/_utils` in your Web browser
    - :warning: The dataset is protected with the following credentials: `user=admin` & `password=admin`
1. Once you log in, click on the database **instacart_db**

The database already contains the view **departments** to list all available products departments.
You can see the output of this view by clicking on ***queries > departments*** right below the category ***Design Documents***.
This screen shows the expected output:

![image](images/departments.png)

Observe that a function is JavaScript is required to select all departments.
You can see the implementation of such query by clicking on the wrench icon (:wrench:) next to  ***departments*** and then select the edit option to get this output:

![image](images/edit-view.png)

The later function is executed over all documents stored in the database (*line 1*).
One document refers to a department **if an only if** the fields `department_id` & `department_name` are present (*line 2*).
Finally, the emit function (*line 3*) add an entry of interest to the result set with the department identifier as key and the name of the department as value (remember, documents in CouchDB are key-value objects).

### Querying user-generated data

To accomplish your mission as member of WHO, we will simply create an histogram where the number of purchased products are grouped by department over the whole dataset.

Given that we need to count the number of products per department, our JavaScript function will simply report `1` when a product from a certain department is found. Here you have the implementation of such query:

```javascript
function (doc) {
  // we assure that [doc] refers to one purchase
  if ( doc.order_id && doc.department_name ) {
    // we report once the department of a product
    emit(doc.department_name, 1);
  }
}
```

Now we just have to sum the number of occurrences per department. To do so, we will use the built-in `SUM` function of CouchDB. Follow the next steps to implement our view:

1. Click on the icon of plus (**+**) next to **queries**, right below **Design Documents** and select **New View**
1. In the field **Index name** write the name of our view: **items_no_per_department**
1. Replace the code within the field **Map function** with the snippet shown before
1. Chose **_sum** as reduce function
1. Save the view by clicking on **Create Document and then Build Index**

That's it, you already known how many products were bought per department.
Corroborate the output of the query writing down in a terminal the next command:

`curl -X GET "http://admin:admin@127.0.0.1:5984/instacart_db/_design/queries/_view/items_no_per_department?group=true"`

you will get an output similar to this one:

```javascript
{"rows":[
{"key":"babies","value":2},
{"key":"bakery","value":5},
{"key":"beverages","value":8},
{"key":"breakfast","value":5},
{"key":"canned goods","value":3},
{"key":"dairy eggs","value":13},
{"key":"deli","value":2},
{"key":"dry goods pasta","value":2},
{"key":"frozen","value":2},
{"key":"household","value":5},
{"key":"international","value":1},
{"key":"meat seafood","value":3},
{"key":"pantry","value":9},
{"key":"personal care","value":2},
{"key":"produce","value":27},
{"key":"snacks","value":10}
]}
```
Discuss your findings with your colleagues at the WHO by presenting them the result of your query in form of an histogram, similar to this one:

![image](images/histogram.png)

:pencil2: Create your own histogram launching the `plotter` service . You will find the file `plots/histogram.pdf` once the execution of the service is complete.

:checkered_flag: **Congratulations**, you have now a better understanding of how to query the content of a NoSQL database.
