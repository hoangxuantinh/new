# Project Title

Project Demo (Registation Classes)

## Technology

-Nodejs/Express
-DataBase : MySql And Redis

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.


- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    $ v16.13.1
   
### Yarn installation
  After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

---
## Prerequisites
-Open Xampp Or WAMP
-Create 2 New Database With Named [Class] For Develop And [Test] For Test Envirorment

## Install

    $ git clone https://github.com/hoangxuantinh/new.git
    $ cd project2/backend
    $ yarn install

### Open Redis

   - Open cmd run: $ redis-server

## Running the project

    $ yarn start


### Sequelize Migrate

    $ npx sequelize db:migrate // for develop
    $ npx sequelize db:migrate --env test // for test

## Running Test
    
    $ yarn test --coverage