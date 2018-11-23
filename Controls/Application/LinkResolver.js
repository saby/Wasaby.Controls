define('Controls/Application/LinkResolver', ['Core/core-extend'], function(coreExtend) {
   'use strict';

   function joinPaths(arr) {
      var arrRes = [];
      for (var i = 0; i < arr.length; i++) {
         arrRes.push(cropSlash(arr[i]));
      }
      return arrRes.join('/');
   }

   function cropSlash(str) {
      var res = str;
      res = res.replace(/\/+$/, '');
      res = res.replace(/^\/+/, '');
      return res;
   }

   var LinkResolver = coreExtend.extend([], {
      constructor: function(isDebug, buildNumber, wsRoot, appRoot, resourceRoot) {
         this.isDebug = isDebug;
         this.buildNumber = buildNumber || '';

         this.wsRootFolder = wsRoot.replace(resourceRoot, '');

         var fullResourcePath = '';
         if (appRoot && !(resourceRoot && ~resourceRoot.indexOf(appRoot))) {
            fullResourcePath += '/' + appRoot + '/';
         }
         if (resourceRoot) {
            fullResourcePath += '/' + resourceRoot + '/';
         }
         this.resourceRoot = ('/' + fullResourcePath).replace(/[\/]+/g, '/');
         this.initPaths();
      },
      initPaths: function() {
         // Костыль. Заменяем имена для модулей, у которых имя модуля не совпадает с физическим путем
         this.paths = {
            'tslib': joinPaths([this.wsRootFolder, 'lib/Ext/tslib']),
            'Resources': this.resourceRoot || '.',
            'Core': joinPaths([this.wsRootFolder, 'core']),
            'css': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/css']),
            'native-css': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/native-css']),
            'normalize': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/normalize']),
            'html': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/html']),
            'tmpl': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/tmpl']),
            'wml': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/wml']),
            'text': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/text']),
            'is': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/is']),
            'is-api': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/is-api']),
            'i18n': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/i18n']),
            'json': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/json']),
            'order': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/order']),
            'template': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/template']),
            'cdn': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/cdn']),
            'datasource': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/datasource']),
            'xml': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/xml']),
            'preload': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/preload']),
            'browser': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/browser']),
            'optional': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/optional']),
            'remote': joinPaths([this.wsRootFolder, 'ext/requirejs/plugins/remote']),

            'Core/i18n': joinPaths([this.wsRootFolder, 'core', 'i18n']),
            'Core/Util': 'Core/Util',
            'Core/_Util': 'Core/_Util',
            'Core/I18n': 'Core/I18n',
            'Core/Debug': 'Core/Debug',
            'Core/_Debug': 'Core/_Debug',
            'Core/Entity': 'Core/Entity',
            'Core/_Entity': 'Core/_Entity',
            'Core/ApplyContents': 'Core/ApplyContents'
         };
      },
      getLinkWithResourceRoot: function(link) {
         var res = joinPaths([this.resourceRoot, link]);
         if (res.indexOf('/') !== 0) {
            res = '/' + res;
         }
         return res;
      },
      resolveOldLink: function(name) {
         var res = name;
         var replaceKey = '';
         for (var key in this.paths) {
            if (name.indexOf(key) === 0) {
               if (key.length > replaceKey.length) {
                  replaceKey = key;
               }
            }
         }
         if (replaceKey.length) {
            res = res.replace(replaceKey, this.paths[replaceKey]);
         }
         return res;
      },
      resolveLink: function(link, ext) {
         var res = link;
         res = this.resolveOldLink(res);
         res = this.getLinkWithResourceRoot(res);
         res = this.getLinkWithExt(res, ext);
         return res;
      },
      resolveCssWithTheme: function(link, theme) {
         var res = link;
         res = this.getLinkWithResourceRoot(res);
         res = this.getLinkWithTheme(res, theme);
         res = this.getLinkWithExt(res, 'css');
         return res;
      },
      getLinkWithTheme: function(cssName, theme) {
         if (!theme) {
            return cssName;
         }
         return cssName + '_' + theme;
      },
      getLinkWithExt: function(link, ext) {
         var res = link;
         if (this.isDebug) {
            res = link + '.' + ext;
         } else {
            res = link + '.min.' + ext;
            if (this.buildNumber) {
               res = res + '?x_version=' + this.buildNumber;
            }
         }
         return res;
      }
   });

   // LinkResolver.getInstance = function getInstance() {
   //    if (process && process.domain && process.domain.req) {
   //       if (!process.domain.req._$LinkResolver) {
   //          // Create instance on server
   //          process.domain.req._$LinkResolver = new LinkResolver();
   //       }
   //       return process.domain.req._$LinkResolver;
   //    }
   //    if (typeof window !== 'undefined') {
   //       if(!window._$LinkResolver) {
   //          // Create instance on client
   //          window._$LinkResolver = new LinkResolver();
   //       }
   //       return window._$LinkResolver;
   //    }
   //    IoC.resolve('ILogger').error('Cannot create link resolver');
   // }
   return LinkResolver;
});
