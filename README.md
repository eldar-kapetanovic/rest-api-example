# rest-api-example

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.2.

## Setup environment for Angular

[Download and install Node.js with npm](https://nodejs.org/en/)

Open terminal (Command prompt)

Check if Node.js is installed correctly:
`node -v`

Check if npm is installed correctly:
`npm -v`

Install Angular CLI
`npm install -g @angular/cli`

## Clone or Download project

[Download project](https://github.com/eldar-kapetanovic/rest-api-example/archive/master.zip) 
or clone project using `git clone https://github.com/eldar-kapetanovic/rest-api-example.git` command.

## Run project locally (Development server)

Open terminal (Command prompt)
Navigate to project directory `cd <path/to/project>/rest-api-example`
Run `ng serve` for a dev server. Open `http://localhost:4200/` in your Web browser.

## Build project for deployment

Open terminal (Command prompt)
Navigate to project directory `cd <path/to/project>/rest-api-example`
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## About project
Project is based on meaningless data from [JSONPlaceholder](https://jsonplaceholder.typicode.com/) page. Two set of data `/posts` and `/comments` 
are used for this project. Sample data is formatted in order to have child list of comments in post object. This data is then saved to `Google
Firebase` database. 

Read access is granted for all, so anyone can read posts and comments. Only authenticated users can edit data. For login application uses 
Email and password based authentication from Firebase SDK. 

Test account for this application is:
username: `test@test.com`
password: `Test1234`

Application contain 7 components. `app.component` is used for Firebase SDK initialization, initial app store data and global actions (Login, Logout, 
Export...). `login-dialog.component` for Login functionality. `posts.component` is parent component for displaying posts with usage of 
`post.component`. `post-details.component` and `edit.post.component` for viewing and editing post and related comment data. 
`confirm-action.component` is used for Delete and Logout actions confirmation.

Application uses store to keep data on application level. Changes on data are coordinated through this class. By subscribing to state, components
are able to track changes on post / comments data. Store is also used for tracking of authentication state of user.

Post service `post.service` is used for retrieving and saving data from Google Firebase database using GET and PUT REST operations. 
`auth.interceptor` is used to add authentication key to PUT operation. `pending-changes.guard` is used to warn user for unsaved data when he 
tries to leave page without saving all data.

Application contains 2 modules. `material-components.module` for sharing Angular Material components. `app.module` is module used for declaring
and providing components and also for managing routes for Angular Router Module.

Through this application users can access posts and comments data, and they can export this data in JSON format by clicking on `EXPORT TO JSON` on 
main page. Authenticated users can add, edit and delete all data.
