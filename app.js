var root = process.cwd(),
   rootFixed = root.replace('\\', '/'),
   baseRequire = require,
   fs = require('fs'),
   path = require('path');

var global = (function() {
   return this || (0, eval)('this');
})();

var requirejs = require(path.join(root, 'node_modules', 'saby-units', 'lib', 'requirejs', 'r.js'));
global.requirejs = requirejs;

// Configuring requirejs
var createConfig = require(path.join(root, 'node_modules', 'sbis3-ws', 'WS.Core', 'ext', 'requirejs', 'config.js'));
var config = createConfig(
   path.join(root, 'application'),
   path.join(root, 'application', 'WS.Core'),
   path.join(root, 'application')
);
requirejs.config(config);

/**
 * Look ma, it cp -R.
 * @param {string} src The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
var copyRecursiveSync = function(src, dest) {
   var exists = fs.existsSync(src);
   var stats = exists && fs.statSync(src);
   var isDirectory = exists && stats.isDirectory();
   if (exists && isDirectory) {
      if (!fs.existsSync(dest)) {
         fs.mkdirSync(dest);
      }
      fs.readdirSync(src).forEach(function(childItemName) {
         copyRecursiveSync(path.join(src, childItemName),
            path.join(dest, childItemName));
      });
   } else {
      if (!fs.existsSync(dest)) {
         fs.linkSync(src, dest);
      }
   }
};

var express = require('express'),
   http = require('http'),
   https = require('https'),
   cookieParser = require('cookie-parser'),
   spawn = require('child_process').spawn,
   bodyParser = require('body-parser'),
   serveStatic = require('serve-static'),
   app = express();

var resourcesPath = path.join('', 'application');

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', serveStatic(resourcesPath));
app.use('/cdn/', serveStatic('./node_modules/cdn'));


var port = process.env.PORT || 777;
var server = app.listen(port);

console.log('app available on port ' + port);



console.log('path rjs');

global.require = global.requirejs = require = requirejs;

console.log('start init');
require(['Core/core-init'], function(){
   console.log('core init success');
}, function(err){
   console.log(err);
   console.log('core init failed');
});

/*server side render*/
app.get('/:moduleName/*', function(req, res){

   req.compatible=false;
   if (!process.domain) {
      process.domain = {
         enter: function(){},
         exit: function(){}
      };
   }
   process.domain.req = req;
   process.domain.res = res;

   var tpl = require('wml!Controls/Application/Route');
   var originalUrl = req.originalUrl;

   var path = req.originalUrl.split('/');
   var cmp = path?path[1]:'Index';
   cmp += '/Index';

   try {
      require(cmp);
   } catch(e){
      res.writeHead(404, {'Content-Type': 'text/html'});
      res.end('');
      return;
   }

   require('Env/Env').constants.resourceRoot = '/';

   var html = tpl({
      lite: true,
      wsRoot: '/WS.Core/',
      resourceRoot: '/',
      application: cmp,
      appRoot: '/'
   });

   if (html.addCallback) {
      html.addCallback(function(htmlres){
         res.writeHead(200, {'Content-Type': 'text/html'});
         res.end(htmlres);
      });
   } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(html);
   }
});
