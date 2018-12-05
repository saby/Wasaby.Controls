define('Controls/Application/HeadData', [
   'Core/core-extend',
   'Controls/Application/DepsCollector/DepsCollector',
   'Core/Deferred',
   'Core/cookie',
   'Core/Themes/ThemesController',
   'View/Request',
   'Core/constants'

], function(extend,
   DepsCollector,
   Deferred,
   cookie,
   ThemesController,
   Request,
   constants) {
   var bundles, modDeps, contents;

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

   try {
      modDeps = require('json!' + joinPaths([constants.appRoot, constants.resourceRoot, 'module-dependencies']));
   } catch (e) {

   }
   try {
      contents = require('json!' + joinPaths([constants.appRoot, constants.resourceRoot, 'contents']));
   } catch (e) {

   }
   try {
      bundles = require('json!' + joinPaths([constants.appRoot, constants.resourceRoot, 'bundlesRoute']));
   } catch (e) {

   }

   bundles = bundles || {};
   modDeps = modDeps || { links: {}, nodes: {} };
   contents = contents || {};

   return extend.extend({
      _version: 0,
      needObjects: true,

      /* toDO: StateRec.register */
      pushDepComponent: function(componentName, needRequire) {
         this.depComponentsMap[componentName] = true;
         if (needRequire) {
            this.additionalDeps[componentName] = true;
         }
      },

      pushWaiterDeferred: function(def) {
         var self = this;
         var depsCollector = new DepsCollector(modDeps.links, modDeps.nodes, bundles, self.themesActive);
         self.waiterDef = def;
         self.waiterDef.addCallback(function() {
            var components = Object.keys(self.depComponentsMap);
            var files = {};
            if (self.isDebug) {
               files = {};
            } else {
               files = depsCollector.collectDependencies(components);
               ThemesController.getInstance().initCss({
                  themedCss: files.css.themedCss,
                  simpleCss: files.css.simpleCss
               });
            }

            var rcsData = Request.getCurrent().stateReceiver.serialize();
            var additionalDepsArray = [];
            for (var key in rcsData.additionalDeps) {
               if (rcsData.additionalDeps.hasOwnProperty(key)) {
                  additionalDepsArray.push(key);
               }
            }

            // Костыль. Чтобы сериализовать receivedState, нужно собрать зависимости, т.к. в receivedState у компонента
            // Application сейчас будет список css, для восстановления состояния с сервера.
            // Но собирать зависимости нам нужно после receivedState, потому что в нем могут тоже могут быть зависимости
            var additionalDeps = depsCollector.collectDependencies(additionalDepsArray);

            files.js = files.js || [];
            for (var i = 0; i < additionalDeps.js.length; i++) {
               if (!~files.js.indexOf(additionalDeps.js[i])) {
                  files.js.push(additionalDeps.js[i]);
               }
            }
            self._version++;
            self.defRender.callback({
               js: files.js || [],
               tmpl: files.tmpl || [],
               css: files.css || { themedCss: [], simpleCss: [] },
               errorState: self.err,
               receivedStateArr: rcsData.serialized,
               additionalDeps: Object.keys(rcsData.additionalDeps).concat(Object.keys(self.additionalDeps))
            });
         });
      },
      constructor: function(theme, cssLinks, themesActive) {
         this.theme = theme;
         this.defRender = new Deferred();
         this.depComponentsMap = {};
         this.receivedStateArr = {};
         this.additionalDeps = {};
         this.themesActive = themesActive;
         this.cssLinks = cssLinks;
         this.isDebug = cookie.get('s3debug') === 'true' || contents.buildMode === 'debug';
      },
      pushCssLink: function(url) {
         this.cssLinks.push(url);
         this._version++;
      },
      getVersion: function() {
         return this._version;
      },
      waitAppContent: function() {
         return this.defRender;
      }
   });
});
