const { GraphQLServer } = require('graphql-yoga');
const { MongoClient } = require('mongodb');
const { mongodbUri } = require('./secrets');

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Customer = require('./resolvers/Customer');
const MarketAdmin = require('./resolvers/MarketAdmin');
const MarketAdminAuthPayload = require('./resolvers/MarketAdminAuthPayload');
const TraderAdmin = require('./resolvers/TraderAdmin');
const TraderAdminAuthPayload = require('./resolvers/TraderAdminAuthPayload');
const Market = require('./resolvers/Market');
const TraderCard = require('./resolvers/TraderCard');

const resolvers = {
  Query,
  Mutation,
  Customer,
  MarketAdmin,
  MarketAdminAuthPayload,
  TraderAdmin,
  TraderAdminAuthPayload,
  Market,
  TraderCard,
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