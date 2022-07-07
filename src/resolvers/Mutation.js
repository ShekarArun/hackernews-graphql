'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET } = require('../utils')

async function signup (parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.prisma.user.create({ data: { ...args, password } })
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return { token, user }
}

async function login (parent, args, context, info) {
  const user = await context.prisma.user.findUnique({ where: { email: args.email } })
  if (!user) throw new Error('No matching user found')

  const valid = bcrypt.compare(args.password, user.password)
  if (!valid) throw new Error('Incorrect password')

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return { token, user }
}

async function post (parent, args, context, info) {
  const { userId } = context
  return await context.prisma.link.create({ data: { url: args.url, description: args.description, postedBy: { connect: { id: userId } } } })
}

// async function updateLink (parent, args, context, info) {}
// async function deleteLink (parent, args, context, info) {}

module.exports.signup = signup
module.exports.login = login
module.exports.post = post
