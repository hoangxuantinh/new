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
    $ npm --version
   

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

### Yarn installation
  After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

---

## Install

    $ git clone https://github.com/hoangxuantinh/new.git
    $ cd project2/backend
    $ yarn install

## Running the project

    $ yarn start

### Open Redis

   - Open cmd: $ redis-server

## Running Test
    $ npx sequelize db:migrate --env test
    $ yarn test --coverage