# :books: LINGI2145 Project: bootstrap tutorial

:warning: **If you have not read the** [general description](../README.md) **of the project, do it before going through this tutorial.**

This tutorial will guide you through the technologies and necessary tools to run the front-end.
The provided version uses a non persistent storage to save users' data (such as credentials or cart content) in the form of JSON objects.

# :book: Technologies involved in this project

This section gives you a list of pointers to other tutorials you can follow to be familiar with the technology used in the project.

- The front-end is written with HTML/CSS and Javascript. The [w3schools.com](https://www.w3schools.com/default.asp) web sites is a useful source of documentation;
- Learn all you want about Javascript, the programming language of the web with this book: [Eloquent Javascript](http://eloquentjavascript.net/); additionally, you can use this [interactive tutorial](https://javascript.info/);
- Start using Node.js with [this guide](https://nodejs.org/en/docs/guides/getting-started-guide/);
- Official documentation of the [NPM package manager](https://docs.npmjs.com/)
  - :pencil: **Note.** We encourage you to go through (at least) the following sections:
      1. [What is npm?](https://docs.npmjs.com/getting-started/what-is-npm);
      1. [How to Install Local Packages](https://docs.npmjs.com/getting-started/installing-npm-packages-locally);
      1. [Working with package.json](https://docs.npmjs.com/getting-started/using-a-package.json).
- The front-end is based on [React](https://reactjs.org/) a Javascript framework for building dynamic web interfaces.
  - :pencil: **Note.** Start reading its [official documentation](https://reactjs.org/docs/hello-world.html), and try its [interactive tutorial](https://reactjs.org/tutorial/tutorial.html).

**Do not panic**, all these documentation may seem a lot of content but it is an investment that will reward you later.
For example, you will continue to develop with Javascript, node.js and NPM for the back-end development.

## Installing node.js

Javascript is the recommended programming language for the entire project (though you are free to use the language of your choice in the backend).
You must install an interpreter in order to run your programs locally.

We recommend to install [node.js](https://nodejs.org/en/).
Locate instructions for your system on [the official download page](https://nodejs.org/en/download/).

:bulb: **Linux users.** Install node.js via the package manager (instructions available [here](https://nodejs.org/en/download/package-manager/#installing-node-js-via-package-manager)).

:bulb: **MacOS users** can use the official installer.
node.js comes with its package manager [NPM](https://www.npmjs.com/), that we will use frequently.

Now you are ready to deploy the front-end, find further instructions in [front-end tutorial](02_ProjectSetup_FrontEnd.md) to start working with the Shopping Cart Application (SCApp).
