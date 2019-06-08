const { GraphQLServer } = require('graphql-yoga');
const { MongoClient } = require('mongodb');
const { mongodbUri } = require('./secrets');

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Customer = require('./resolvers/Customer');

const resolvers = {
  Query,
  Mutation,
  Customer,
};

const client = new MongoClient(mongodbUri, { useNewUrlParser: true });
client.connect(err => {
  if (err) throw new Error('Failed to connect to MongoDB Cluster')
  else console.log('Connected to MongoDB Cluster')
  const db = client.db("test");
  
  const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers,
    context: request => ({ db, ...request }),
  });
  
  const options = {
    port: 4000,
  };
  
  server.start(options, ({ port }) =>
  console.log(`Server started, listening on port ${port} for incoming requests.`),
  )
});