const hash = require("object-hash");
const { deflate, inflate } = require("pako");
const client = require("./redis");

function requestToKey(req) {
  // build a custom object to use as part of the Redis key
  const reqDataToHash = {
    query: req.query,
    body: req.body,
  };

  // `${req.path}@...` to make it easier to find
  // keys on a Redis client
  return `${req.path}@${hash.sha1(reqDataToHash)}`;
}

const defaultOptions = {
  EX: 21600, // the specified expire time in seconds
  // PX, // the specified expire time in milliseconds
  // EXAT, // the specified Unix time at which the key will expire, in seconds
  // PXAT, // the specified Unix time at which the key will expire, in milliseconds
  // NX, // write the data only if the key does not already exist
  // XX, // write the data only if the key already exists
  // KEEPTTL, // retain the TTL associated with the key
  // GET, // return the old string stored at key, or "undefined" if key did not exist
};

async function writeData(key, data, options) {
  try {
    await client.set(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to cache data for key=${key}`, e);
  }
}

async function readData(key) {
  try {
    return JSON.parse(await client.get(key));
  } catch (e) {
    console.error(`Failed to get data for key=${key}`, e);
  }
}

module.exports = {
  requestToKey,
  defaultOptions,
  writeData,
  readData,
};
