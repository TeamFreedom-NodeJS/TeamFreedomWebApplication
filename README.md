
# Course Project
_Web applications with Node.js_

## Team "Freedom"
*************************************************
Cooking e-Web Application is a standard Web application developed by Team "Freedom" as part of the "Web Applications with Node.js" course at Telerik Academy 2016 - Spring.

##Team
| Nickname  | Name |
| ------------- | ------------- |
| IvanAngelov  | Иван Ангелов  |
| todor_ia  | Тодор Арабаджиев  |
| dushka.dragoeva | Душка Драгоева  |
| Azonic  | Васил Пенев  |
| Ellapt  | Ангела Тенева  |

##Application Desription 

The main purp?se of the application is to help the user easy to find cooking recipes and interesting articles on food topics. Paging and well organized, structured functionality allow the user to easily navigate around the application. He can easily find fantastic gourmet recipes, simple or sophisticated, then label the best ones as favorite, and even share them with friends via Facebook.
The "Cooking e-Web Application" was designed and implemented using [Node.js](http://nodejs.org), [Express](expressjs.com) and [MongoDB](https://www.mongodb.com/).

## Application Logics

"Cooking e-Web Application" consist of the 2 main parts:

- **public part** (accessible without authentication)
- **private part** (available for registered users)

### Public Part

The **public part** is **visible without authentication**. This public part includes the following pages:

- the application start page: contains public menu options and a search option;
- user login page: login possible through user's site account or through Facebook account;
- user registration page;
- categories page: buttons with links for each category; when clicked, the the recipes of this category are displayed;
- page with articles on cooking and alimentary topics;
- recipes by category chosen from the category page. 
 
### Private Part (Registered users area)

**Registered users** have personal area in the web application accessible after **successful login**.
This area holds the following pages:

- the user's profiles management functionality;
- pages for database CRUD operations on cooking recipes and categories;
- pages for database CRUD operations on popular cooking articles;
- "My author's recipes" page;  
- "My favorite recipes" page; 
- recipes by category chosen from the category page; 
- application statistics page

## Technical Implementation

Technologies, frameworks and development techniques used in the "Cooking e-Web Application" project:

### Application Back-end (Server)

- 6 different **public dynamic web pages**
  - Using [Pug](https://pugjs.org/)
- 6 different **private (authenticated) dynamic web pages**
  - Using [Pug](https://pugjs.org/)
  
- **5 different public RESTful routes** for AJAX: 
  - home-router
  - article-router
  - category-router
  - recipe-router
  - search-router
- **1 private (authenticated) route** for AJAX:
  - authentication-router

- **Express** framework is used for the server side of the application providing a minimal and flexible set of features for web and mobile applications.
  - In order to implement a testable high-quality Web-application, "Cooking e-Web Application" was designed using an **MVC** pattern;
  
- Cooking recipes data base was designed using **MongoDB**'s data storage, and data/service layer for accessing the database was created

- [Passport](http://passportjs.org/) strategy was applied for managing **users**
  - Registered users have role **user**
  - Administrator has role **Admin**

### Application front-end (client)

- **Twitter Bootstrap** and **Materialize** are used as UI frameworks for the front-end responsive design.
- **AJAX form communication** was implemented.
- **More than 10 different unit tests** were written for the controllers and data logics
- In order to avoid crashes when invalid data is entered, **error handling** and **data validation** were implemented 
- Special strategies are applied to prevent the application from **security** holes (XSS, XSRF, Parameter Tampering)
  - The **special HTML chaTracters** and tags like `<script>`, `<br />`, etc. are handled correctly.

##  General Requirements

- Used Git repository:

  https://github.com/TeamFreedom-NodeJS/TeamFreedomWebApplication

- "Cooking e-Web Application" uploaded in the cloud: 

 https://teamfreedomwebapp.herokuapp.com/
 
### Implementation of Optional Requirements

- Team **Freedom** have made special efforts to achieve nice looking UI supporting of all modern and old Web browsers.
- Our UI is easy to use and it looks beautiful - so we hope you will like it.

