# Project 2: Designing a recommender service for shopping-cart application
LINGI2145 Autumn, 2018 -- Etienne Rivière and Raziel Carvajal-Gómez

Having completed the first part of LINGI2145 project, you now have a scalable shopping cart application with a backend formed of multiple microservices.
One of these services is the logging service: it collects information about the operation of microservices, but in particular it should log the purchases made by the users.
In this second part we will leverage the availability of this information to add new functionalities to the application.

:warning:
As mentioned in the previous project, the second part of the project accounts for 40% of the final project grade.
The grading requirements and details are available [in the same file as for the first project](Grading.md#Second-deliverable-recommendation-service).

## Your mission

You must build a recommendation feature for your application.
The goal of this feature is twofold: (1) to make the navigation experience better for the users, allowing them to fill-in their carts faster when they make choices similar to the majority and (2) to increase sales by presenting products of likely interest to the users.

The minimum feature of the recommendation engine is to display the items that are the most-frequently bought together with the item currently browsed by the user.
For instance, if apples are often bought together with bananas, the presentation of the banana should present apple as frequently-bought items, and vice-versa.

More advanced recommendation features will grant more points.
Considering the current content of the cart to avoid showing items the user has already selected is a natural enhancement of the feature.
More advanced recommendation principles, such as those considering the history of purchases of different users, or the history of navigation, can grant additional bonus points.

This second part of the project will require to modify both the back-end of the application, building new microservices, and the front-end, adding the display of the recommended items to the user.

This second part depends on the availability of a proper implementation of the logging service as required in the first part.
Note that if you did not have a proper version of this service for the first deliverable, it is still time to develop it at the beginning of this second part.
You will get less points than for developing it in the first part but will get some anyway.

## User requirements

The recommendation engine should provide the following user interface and functionality:

- It should add next to the product presentation, a set of thumbnails (ideal) or a list of text names (minimal) of recommended products to be bought alongside this one.
- This list should be updated after purchases are made to reflect the new buying trends on the platform.
- If a product is already in the cart, we would ideally like to not see it in the recommended products.

## Technical requirements

The implementation of the recommendation engine must respect the following technical requirements:

- The computation of the recommendations must happen periodically using one or several Map/Reduce job(s). For performance and costs reasons, it is not reasonable that the recommendations be updated every time someone checks out, and the computation must be kept out of the query/response loop of the user who is checking out.
- The recommendation engine must be implemented as a new microservice, isolated from the logging service.
- It must be accessible through a RESTful API accessible from other services. It must be properly documented.
- Services must be packaged as Docker containers, and use Docker networking to connect with their databases.

## Bonus points

Bonus points will be awarded for:

- any recommendation feature that goes beyond the "frequently-bought-with" characteristics. You can make use of your imagination, but examples could include using the history of purchases of the user (who may be interested in filling up with the same items, but also in new items), history of visits, etc.
- any significant extension of the front-end to support the display of recommendations.

## Grading and deliverable

The grading criteria are available in the [specific file](Grading.md) as for the first part.

*Note:*
Please feel free to send us a *pull request* with suggested changes in case you find any mistake in the code and/or
in the description.

Meaningful updates to the course GitHub repositories will be taken into account as a bonus when grading your project.
