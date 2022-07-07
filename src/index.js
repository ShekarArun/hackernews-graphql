const { ApolloServer, PubSub } = require('apollo-server')
const { PrismaClient } = require('@prisma/client')

const fs = require('fs')
const path = require('path')

const { getUserId } = require('./utils')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Link = require('./resolvers/Link')
const User = require('./resolvers/User')
const Subscription = require('./resolvers/Subscription')
const Vote = require('./resolvers/Vote');

// const { randomUUID } = require('crypto');

// const links = [{
//   id: '123',
//   url: 'www.howtographql.com',
//   description: 'Fullstack tutorial for GraphQL'
// }];

(async () => {
  const prisma = new PrismaClient()
  const pubsub = new PubSub()
  const resolvers = { Query, Mutation, Subscription, User, Link, Vote }

  const apolloServer = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
    resolvers,
    context: ({ req }) => {
      return {
        ...req,
        prisma,
        pubsub,
        userId: req && req.headers.authorization ? getUserId(req) : null
      }
    }
  })

  const { url } = await apolloServer.listen()
  console.log(`Server running on ${url}`)
})()
