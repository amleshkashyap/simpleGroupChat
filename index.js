const { PubSub, GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const typeDefs = require('./typedefs');
const resolvers = require('./resolvers');

dotenv.config();

const { MONGO_URL } = process.env;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => console.log("DB Connected"));;

const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });

// server.start().then(() => console.log("APP Connected"));
 mongoose.connection.once("open", () =>
   server.start().then(() => console.log("APP Connected"))
 );
