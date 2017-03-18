

# Clone the project
## install git 
then run the following command:

`git clone https://github.com/MadhuMuthumannan/blogg.git` in terminal

## Install some packages globally

1. nodejs 
1. npm
1. mongodb
1. nodemon (to automatically restart the server when changes are made in code)
1. robomongo (optional: to view databases and collections in UI)

### Getting into project

To install dependencies cd to the project directory here say blogg folder where package.json is present and run the following command:

` npm install`

> Now run the server by running the command

` nodemon server.js`

In case if you want to change the port change the port number in the file _config.js_ line number 2


**'port': process.env.PORT || 8080**














