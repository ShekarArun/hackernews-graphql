'use strict'

const jwt = require('jsonwebtoken')
const APP_SECRET = 'My-own-very-un1qu3-s3cret'

function getTokenPayload (token) { return jwt.verify(token, APP_SECRET) }

function getUserId (req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      if (!token) throw new Error('No token found')
      const { userId } = getTokenPayload(token)
      return userId
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken)
    return userId
  }
}

module.exports.APP_SECRET = APP_SECRET
module.exports.getUserId = getUserId
