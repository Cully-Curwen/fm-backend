const { GraphQLServer } = require('graphql-yoga');
const { MongoClient } = require('mongodb');
const { mongodbUri } = require('./secrets');


const resolvers = {

};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: request => ({ ...request }),
});

const options = {
  port: 4000,
};

const uri = mongodbUri;
const client = new MongoClient(uri, { useNewUrlParser: true });

server.start(options, ({ port }) =>
  console.log(`Server started, listening on port ${port} for incoming requests.`),
)

client.connect(err => {
  const dbname = "test";
  const collectionName = "helloWorld";

  const collection = client.db(dbname).collection(collectionName);
    // works
  client.close();
});