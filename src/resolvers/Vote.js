'use strict'

function link (parent, args, context) { return context.prisma.vote.findUnique({ where: { id: parent.id } }).link() }

function user (parent, args, context) { return context.prisma.vote.findUnique({ where: { id: parent.id } }).user() }

module.exports.link = link
module.exports.user = user
