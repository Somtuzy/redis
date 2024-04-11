const {
  requestToKey,
  defaultOptions,
  readData,
  writeData
} = require("./cache_utils");

function cache(options) {
    return async (req, res, next) => {
        options =
            options && Object.keys(options).length > 0 ? options : defaultOptions;
          
      const key = requestToKey(req);
      // if there is some cached data, retrieve it and return it
      const cachedValue = await readData(key);
      if (cachedValue) {
        try {
          // if it is JSON data, then return it
          return res.json(cachedValue);
        } catch {
          // if it is not JSON data, then return it
          return res.send(cachedValue);
        }
      } else {
        console.log('herex4');
        // override how res.send behaves
        // to introduce the caching logic
        const oldSend = res.send;
        res.send = function (data) {
          // set the function back to avoid the 'double-send' effect
          res.send = oldSend;

          // cache the response only if it is successful
          if (res.statusCode.toString().startsWith("2")) {
            console.log('herex5');
            writeData(key, data, options).then();
          }

          return res.send(data);
        };
        // continue to the controller function
        next();
      }
  };
}

module.exports = cache
