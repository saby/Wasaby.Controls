var root = process.cwd(),
   rootFixed = root.replace('\\', '/'),
   baseRequire = require,
   fs = require('fs'),
   path = require('path');

var global = (function() {
   return this || (0, eval)('this');
})();

var requirejs = require(path.join(root, 'node_modules', 'sbis3-ws', 'ws', 'ext', 'requirejs', 'r.js'));

global.requirejs = requirejs;

// Configuring requirejs
var createConfig = require(path.join(root, 'node_modules', 'sbis3-ws', 'ws', 'ext', 'requirejs', 'config.js'));
var config = createConfig(root + '\\application\\',
   root + '\\application\\WS.Core\\',
   root + '\\application\\',
   { lite: true });
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

var port = process.env.PORT || 777;
var server = app.listen(port);

console.log('app available on port ' + port);

// // Кошерный редирект на CDN, который РАБОТАЕТ
app.get('/cdn*', function(req, res) {
   res.redirect('http://fix-online.sbis.ru' + req.url);
});

// Простой прокси для перенаправления запросов от демо к сервисам Sbis.ru
var simpleProxy = function(proxyParams, req, res) {
   var subReq = function(host, args, content, onResult) {
      args.host = host;
      args.hostname = host;
      args.port = req.port || 443;
      args.headers = args.headers || {};
      args.headers.host = host;
      args.headers.origin = 'https://' + host;
      args.headers.referer = 'https://' + host + '/';
      args.headers['x-requested-with'] = 'XMLHttpRequest';
      var data;
      if (content && typeof content === 'object' && Object.keys(content).length) {
         data = new Buffer(JSON.stringify(content));
         args.headers['content-type'] = 'application/json; charset=UTF-8';
         args.headers['content-length'] = data.length;
      }
      var rq = https.request(
         args,
         function(rs) {
            rs.on('data', function(data) {
               onResult.call(null, rs.statusCode, rs.headers, data);
            });
         });
      rq.on('error', function(err) {
         console.error('Subrequest error: ' + err);
         res.sendStatus(500);
      });
      rq.end(data);
   };

   var pass = function(cookies, setCookies, fixPath) {
      var reqPath = fixPath ? fixPath(req.path, cookies) : req.path;
      if (req.route.path.charAt(req.route.path.length - 1) === '/' && reqPath.charAt(reqPath.length - 1) !== '/') {
         reqPath = reqPath + '/';
      }
      subReq(
         proxyParams.host,
         {
            method: req.method,
            path: reqPath,
            headers: Object.assign({}, req.headers, {
               cookie: Object.keys(cookies).map(function(n) {
                  return n + '=' + cookies[n];
               }).join('; ')
            })
         },
         req.body || null,
         function(status, headers, data) {
            if (setCookies) {
               var list = headers['set-cookie'] = headers['set-cookie'] || [];
               for (var i = 0; i < setCookies.length; i++) {
                  list.push(setCookies[i]);
               }
            }
            res.set(headers);
            res.status(status).send(data);
         }
      );
   };

   var cookieNames = ['sid', 's3tok-d1b2', 's3su', 'CpsUserId', 'did'];

   var authHost = proxyParams.host.startsWith('stomp-') || proxyParams.host.startsWith('stomp.') ? proxyParams.host.substring(6) : proxyParams.host;

   var cookies;
   if (authHost === proxyParams.host) {
      cookies = cookieNames.reduce(function(acc, n) {
         var k = authHost + '-' + n; if (req.cookies[k]) {
            acc[n] = req.cookies[k];
         } return acc;
      }, {});
      if (!simpleProxy.authCookies || !simpleProxy.authCookies[authHost]) {
         (simpleProxy.authCookies = simpleProxy.authCookies || {})[authHost] = cookies;
      }
   } else {
      cookies = simpleProxy.authCookies ? simpleProxy.authCookies[authHost] : null;
   }

   if (cookies && Object.keys(cookies).length === cookieNames.length) {
      pass(cookies, null, proxyParams.fixPath);
      return;
   }
   subReq(
      authHost,
      {
         method: 'POST',
         path: '/auth/service/sbis-rpc-service300.dll',
         headers: Object.assign({}, req.headers, {
            cookie: '',
            'x-calledmethod': 'SAP.Authenticate',
            'x-originalmethodname': '0KHQkNCfLkF1dGhlbnRpY2F0ZQ=='
         })
      },
      {'jsonrpc': '2.0', 'protocol': 4, 'method': 'САП.Authenticate', 'params': {'data': {'s': [{'t': 'Строка', 'n': 'login'}, {'t': 'Строка', 'n': 'password'}, {'t': 'Строка', 'n': 'machine_name'}, {'t': 'Строка', 'n': 'machine_id'}, {'t': 'Логическое', 'n': 'license_extended'}, {'t': 'Строка', 'n': 'license_session_id'}, {'t': 'Логическое', 'n': 'stranger'}, {'t': 'Логическое', 'n': 'from_browser'}], 'd': [proxyParams.user, proxyParams.password, process.env.COMPUTERNAME, null, false, null, false, true], '_mustRevive': true, '_type': 'record'}}, 'id': 1},
      function(status, headers, data) {
         var lines = [];
         var cookies = {};
         var re = /[\s]*(domain=[a-z0-9\-\.]*|secure|httponly);/gi;
         if (status === 200 && 'set-cookie' in headers) {
            for (var i = 0, ks = headers['set-cookie']; i < ks.length; i++) {
               var line = ks[i].replace(re, '');
               var j = line.indexOf('=');
               var n = line.substring(0, j);
               if (cookieNames.indexOf(n) !== -1) {
                  lines.push(line, authHost + '-' + line);
                  cookies[n] = line.substring(j + 1, line.indexOf(';', j + 1));
               }
            }
         }
         if (Object.keys(cookies).length === cookieNames.length) {
            (simpleProxy.authCookies = simpleProxy.authCookies || {})[authHost] = cookies;
            pass(cookies, lines, proxyParams.fixPath);
         } else {
            if (simpleProxy.authCookies) {
               delete simpleProxy.authCookies[authHost];
            }
            res.sendStatus(401);
         }
      }
   );
};

// Параметры, куда и как перенаправлять запросы
var PROXY_PARAMS = {
   host: 'test-online.sbis.ru',
   user: 'Демо',
   password: 'Демо123'
};

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
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end('');
      return;
   }

   require('Core/constants').resourceRoot = '/';

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


// Проксировать запросы по этим роутам
app.get('/!hash/', simpleProxy.bind(null, PROXY_PARAMS));
app.post('/long-requests/service/', simpleProxy.bind(null, PROXY_PARAMS));
app.post('/' + PROXY_PARAMS.host + '/service/', simpleProxy.bind(null, Object.assign({}, PROXY_PARAMS, {
   fixPath: function(reqPath, cookies) {
      return reqPath.substring(PROXY_PARAMS.host.length + 1);
   }
})));

app.get('/stomp/s-:sid/info', simpleProxy.bind(null, {
   host: 'stomp-test-online.sbis.ru',
   fixPath: function(reqPath, cookies) {
      return '/stomp/s-' + cookies['sid'] + '/info';
   }
}));
