var path = require('path');

require('./lib/unit').test.buildList(
   path.join(__dirname, 'list.js'),
   '../../'
);