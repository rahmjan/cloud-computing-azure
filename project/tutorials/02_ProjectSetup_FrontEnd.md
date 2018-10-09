# :books: LINGI2145 Project: front-end

The front-end source code is in the folder `../src/front_end`.
The source is organized as follows:

```
front_end
├── package.json      << front-end configuration file
├── public/           << HTML/CSS content
│   ├── favicon.ico
│   ├── index.html    << main web page
│   └── style.css
└── src/
    ├── interfaces/   << interfaces to micro-services    
    ├── web_page_sections/  << dynamic content
    ├── shopping-cart/      << classes of SCApp point
    ├── App.jsx             << main source file
    └── index.js            << project entry
```

While your goal is not to make significant changes to the front-end, it is better to understand its structure in order to link it with your backend services.

`package.json` is a configuration file that contains instructions to deploy, build and install dependencies for this project.
We start by installing the project dependencies:
Go to the directory `project/front_end` and type `npm install`.
You can then start the application with `npm start`.

A web-page will pop up with the content of our application.

:warning: If it is not the case visit `http://localhost:3006/` with your browser.

# Description of shopping cart application

The structure of the application is kept simple.
The main page is a catalog of items grouped by categories.
You will notice a shopping bag ![image](images/bag.png) (your cart), which stores every item you add using **ADD TO CART**.

:warning: Notice that you cannot add items in your cart yet.
You must first create an account by clicking on **Sign up**.

Once you registered and picked some items, start the checkout procedure by clicking on your bag and then on the button  **PROCEED TO CHECKOUT**.
Another page will appear with the history of your purchases.
Whether you confirm or cancel your latest purchase, you will be back to the items catalog.

:warning: Your purchases and your credentials **are not persistent**.
If you close the main page, all information is lost.

#### Understand your development environment

By doing `npm start` a [development server](https://docs.nexcess.net/article/what-is-a-development-server.html) assembles and runs SCApp along with its dependencies, keeping track of every change you make in the source files.
You can now start modifying the source code using your favorite text editor.
Every change you save is reflected live in the running application, as long as your application code is valid.

### SCApp front-end is a React application

In [React](https://reactjs.org), javascript classes are embedded in HTML tags (called *components*) to handle events within a web interface.
An intuitive way to navigate between pages is by the use of *routes*.
The *origin* of every route in our front-end is at `src/index.js`, as you can see here:

``` javascript
const router = (
  <Router>
    <Route component={App} />
  </Router>
)

ReactDOM.render(
  router,
  document.getElementById('root')
)
```

This code tells React to embed our main component (`src/App.jsx`) within a HTML tag identified with the name `root`.
We now have an instance of the class `App` in our main web page.

The `render()` method React components allows to add *dynamic* HTML content.
Here is part of the method [App.render()](../src/front-end/src/App.jsx#L84):

``` html
<!-- [...] -->
<Route exact path='/' render={() => (
  isAuthenticated
    ? <ShoppingCartApp
      user={window.localStorage.getItem('username')}
      />
    : <Redirect to={{pathname: '/login'}} />
)} />
<!-- [...] -->
```

Observe that every `<Route />` tag refers to a single page of our application.
For instance, if a user is not authenticated then `isAuthenticated = false` and the `/login` page renders.
If the user is authenticated, an instance of `<ShoppingCartApp>` is created using the user's name as unique argument.

The majority of source files are React components.
Here is a list of them with a small description:

```
front_end/src/
├── interfaces
│   ├── AuthenticationService.jsx << local impl. of authentication service
│   └── LocalPurchases.js  << keep history of purchases in local
├── App.jsx
├── web_page_sections
│   ├── AdminForm.jsx
│   ├── FlashMessages.jsx  << pop ups a banner for messages
│   ├── LoginForm.jsx      << login page
│   ├── NotFound.jsx       << 404 page
│   ├── RegisterForm.jsx   << registration page
│   └── SearchBar.jsx
├── index.js
└── shopping-cart
    ├── components
    ├── empty-states
    ├── loaders
    ├── scss
    └── ShoppingCartApp.jsx  << main component of SCApp

```

SCApp mimics an authentication service by storing users credentials within the object `window.localStorage`.
Here you have a snippet of this standalone service (you can also check the [whole source code](../src/front-end/src/interfaces/AuthenticationService.jsx)).

``` javascript
  /*[...]*/
  registerUser (data, onErr) {
    /*[...]*/
    // we store authentication information of only one user
    window.localStorage.setItem('username', data.username)
    window.localStorage.setItem('password', data.password)
    /*[...]*/
    this.onSucc('You successfully registered!')
  }
  loginUser (data, onErr) {
    // when an admin logs in, the administration page is shown
    // instead of the items catalog
    if (data.username === 'admin' && data.password === 'admin') {
      /*[...]*/
    }
    /*[...]*/
    if (user && user === data.username) {
      if (window.localStorage.getItem('password') === data.password) {
        // shows catalog if items when users credentials match
        /*[...]*/
        this.onSucc('You successfully logged in!')
      } else {
        onErr("Your password doesn't match!")
      }
    }
    /*[...]*/
  }
```
:pencil2: **Note.** This code is a *stub* that we will replace in the next tutorial by an actual code to a back-end component.

:checkered_flag: **That's it.** Now, it's time to take a look at [authentication micro-service tutorial](03_ProjectSetup_AuthenticationService.md) to link our front-end application with a service running in the cloud.
