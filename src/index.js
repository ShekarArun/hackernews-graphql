const { ApolloServer } = require('apollo-server')
const { PrismaClient } = require('@prisma/client')

const fs = require('fs')
const path = require('path');

// const { randomUUID } = require('crypto');

// const links = [{
//   id: '123',
//   url: 'www.howtographql.com',
//   description: 'Fullstack tutorial for GraphQL'
// }];

(async () => {
  const prisma = new PrismaClient()
  const resolvers = {
    Query: {
      info: () => 'Welcome to my very own Hackernews Clone!',
      feed: async (parent, args, context) => { return context.prisma.link.findMany() },
      link: async (parent, args, context) => {
        // return links.find(link => link.id === args.id)
        return context.prisma.link.findUnique({ where: { id: parseInt(args.id) } })
      }
    },
    Mutation: {
      post: async (parent, args, context) => {
        // const link = { id: randomUUID(), description: args.description, url: args.url }
        const link = context.prisma.link.create({ data: { description: args.description, url: args.url } })
        // links.push(link)
        // console.log('Links')
        // console.log(links)
        return link
      },
      updateLink: async (parent, args, context) => {
        const link = context.prisma.link.update({ where: { id: parseInt(args.id) }, data: { description: args.description, url: args.url } })
        // return links.find((link, index) => {
        //   let res
        //   if (link.id === args.id) {
        //     if (args.description) links[index].description = args.description
        //     if (args.url) links[index].url = args.url
        //     res = link
        //   }
        //   return res || false
        // })
        return link
      },
      deleteLink: async (parent, args, context) => {
        const link = context.prisma.link.delete({ where: { id: parseInt(args.id) } })
        // const link = links.find((link, index) => {
        //   let res
        //   if (link.id === args.id) {
        //     res = link
        //     links.splice(index)
        //   }
        //   return res || false
        // })
        return link
      }
    }
    // Link: { id: (parent) => parent.id, description: (parent) => parent.description, url: (parent) => parent.url }
  }

  const apolloServer = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
    resolvers,
    context: { prisma }
  })

  const { url } = await apolloServer.listen()
  console.log(`Server running on ${url}`)
})()
