(function () {
   var global = (function(){ return this || (0,eval)('this'); }());
   var wsPath = ((global.wsConfig ? global.wsConfig.WSRootPath || global.wsConfig.wsRoot : undefined) || '/ws/').replace(/^\//, '');
   var resourcesPath = ((global.wsConfig ? global.wsConfig.ResourcePath || global.wsConfig.resourceRoot : undefined) || '/resources/').replace(/^\//, '');
   var pathjoin;

   if (typeof module !== 'undefined') {
      pathjoin = require('path').join;
   } else {
      function removeLeadingSlash(path) {
         if (path) {
            var head = path.charAt(0);
            if (head == '/' || head == '\\') {
               path = path.substr(1);
            }
         }
         return path;
      }

      function removeTrailingSlash(path) {
         if (path) {
            var tail = path.substr(-1);
            if (tail == '/' || tail == '\\') {
               path = path.substr(0, path.length - 1);
            }
         }
         return path;
      }

      pathjoin = function(path1, path2) {
         return removeTrailingSlash(path1) + '/' + removeLeadingSlash(path2);
      };
   }

   function createRequirejsConfig(baseUrl, wsPath, resourcesPath, options) {
      var cfg = {
         baseUrl: baseUrl,
         paths: {
            'Lib': pathjoin(wsPath, 'lib'),
            'Ext': pathjoin(wsPath, 'lib/Ext'),
            'Core': pathjoin(wsPath, 'core'),
            'Resources': resourcesPath,
            'css': pathjoin(wsPath, 'ext/requirejs/plugins/css'),
            'js': pathjoin(wsPath, 'ext/requirejs/plugins/js'),
            'native-css': pathjoin(wsPath, 'ext/requirejs/plugins/native-css'),
            'normalize': pathjoin(wsPath, 'ext/requirejs/plugins/normalize'),
            'html': pathjoin(wsPath, 'ext/requirejs/plugins/html'),
            'text': pathjoin(wsPath, 'ext/requirejs/plugins/text'),
            'is': pathjoin(wsPath, 'ext/requirejs/plugins/is'),
            'is-api': pathjoin(wsPath, 'ext/requirejs/plugins/is-api'),
            'i18n': pathjoin(wsPath, 'ext/requirejs/plugins/i18n'),
            'json': pathjoin(wsPath, 'ext/requirejs/plugins/json'),
            'order': pathjoin(wsPath, 'ext/requirejs/plugins/order'),
            'template': pathjoin(wsPath, 'ext/requirejs/plugins/template'),
            'datasource': pathjoin(wsPath, 'ext/requirejs/plugins/datasource'),
            'bootup' : pathjoin(wsPath, 'res/js/bootup'),
            'xml': pathjoin(wsPath, 'ext/requirejs/plugins/xml')
         },
         testing: typeof jstestdriver !== 'undefined',
         waitSeconds: 30
      };

      if (options) {
         for (var prop in options) {
            if (options.hasOwnProperty(prop)) {
               cfg[prop] = options[prop];
            }
         }
      }

      return cfg;
   }

   global.requirejs.config(createRequirejsConfig('/', wsPath, resourcesPath));

   if (typeof window !== 'undefined') {
      var
            nRequire = global.require,
            i;

      function _localRequire(mods, callback, errback){
         if (mods instanceof Array) {
            var
                  result = [],
                  required = [],
                  indexes = {},
                  name;
            $ws.helpers.forEach(mods, function (element, index) {
               name = 'module://' + element;
               if ($ws.single.Storage.isStored(name)) {
                  // если модуль уже загружен в Storage, то просто его возьмем и запишем с нужным индексом
                  result[index] = $ws.single.Storage.store(name).getResult();
               }
               else {
                  // такие модули нужно попросить у require, сохранив их индексы
                  indexes[required.push(element) - 1] = index;
               }
            });
            if (required.length) {
               // если есть незагруженные модули, загрузим их через родной require
               nRequire(required, function () {
                  $ws.helpers.forEach(arguments, function (element, i) {
                     // записываем полученные модули в результирующий массив с нужным индексом
                     result[indexes[i]] = element;
                     // запишем модуль в Storage
                     name = 'module://' + required[i];
                     $ws.single.Storage.store(name, function (dR) {
                        dR.callback(element);
                     });
                  });
                  // отдаем готовый набор модулей
                  callback && callback.apply(this, result);
               }, errback);
            }
            else {
               // если все модули уже есть в хранилище, то отдадим их
               callback && callback.apply(this, result);
            }
         }
         else {
            // если запрашиваем уже загруженный модуль (аргумент - строка), то просто его вернем
            return nRequire(mods);
         }
      }
      // перепишем все поля родного require в наш новый
      for (i in global.require) {
         if (global.require.hasOwnProperty(i)) {
            _localRequire[i] = global.require[i];
         }
      }

      global.require = global.requirejs = _localRequire;
   }

   if (typeof module !== 'undefined') {
      module.exports = createRequirejsConfig;
   }
}());