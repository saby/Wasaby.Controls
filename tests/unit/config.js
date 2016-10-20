var fromEnv = require('./lib/util').config.fromEnv,
   envType = process.env.TEST_ENV === undefined ? 'dev' : process.env.TEST_ENV,
   config = require('./config.' + envType);

if (!config) {
   throw new Error('Env type %s is undefined.', envType);
}

fromEnv(config, 'TEST');

module.exports = config;
