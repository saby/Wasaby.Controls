var config = require('./config');

require('./lib/isolated').run(config, {
   wsRoot: 'sbis3-ws/ws/',
   resourceRoot: 'components/',
   nostyle: true,
   globalConfigSupport: false
});