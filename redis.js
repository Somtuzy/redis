const Redis = require("ioredis")

function getRedisUrl(){
  const url = process.env.REDIS_URI
  if(!url){
    throw new Error("Please provide a redis connection url")
  }

  return url
}

module.exports = new Redis(getRedisUrl());
