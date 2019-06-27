# Farmers' Market Platform - backend server

A platform for Customer to discover their local farmers' markets, and pre-order produce for market day. It allows Market Administrator to share information about their Market and organise the Trader of the stalls in one location. The Traders can also share information about themselves, more importantly they can list their stall wares, for Customers to browse and pre-order produce.

## Getting Started

After making a copy of the Repo you will need to create a secrets.js file in the src folder (src/secrets.js). This will need to export;
1. mongodbUri - The Uri for the MongoDB server
2. APP_SECRET - Secret to Sign JWT Token

```
module.exports = {
  mongodbUri,
  APP_SECRET,
}
```

There server will by default use port 4000, this can be changed in src/index.js

### Prerequisites

You will need a MongoDB Database, a free MongoDB Atlas M0 database is all that is needed. Once you have a cluster up and running you can connect the application via MongoDB instructions. The Uri provided is the one that you need to place in the src/secrets.js file.


### Installing

You will need to install the dependencies first with the comand 
```
npm install
```

Once you have created the secrets.js file you can launch the server from repo in the terminal with the command

```
node src/index.js
```

The server is designed to be the backend for the repo fm-client. Though by navigation in your browser to localhost/4000 you can test the functionality in GraphQL playground provided by graphql-yoga.


## Built With

* [graphql-yoga](https://github.com/prisma/graphql-yoga) -  Fully-featured GraphQL Server
* [mongodb](https://github.com/mongodb/node-mongodb-native) - Mongo DB Native NodeJS Driver 
* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#readme) - JsonWebToken implementation for node.js
* [bcryptjs](https://github.com/dcodeIO/bcrypt.js#readme)

## Authors

* **Cully Curwen** - *Initial work*
