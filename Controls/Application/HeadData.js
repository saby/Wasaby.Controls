define('Controls/Application/HeadData', [
   'Core/core-extend',
   'Controls/Application/DepsCollector/DepsCollector',
   'Core/Deferred',
   'Env/Env',
   'Core/Themes/ThemesController',
   'Application/Env',
   'Core/i18n'

], function(extend,
   DepsCollector,
   Deferred,
   Env,
   ThemesController,
   AppEnv,
   i18n) {
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

   // Need these try-catch because:
   // 1. We don't need to load these files on client
   // 2. We don't have another way to check if these files exists on server
   try {
      // TODO https://online.sbis.ru/opendoc.html?guid=7e096cc5-d95a-48b9-8b71-2a719bd9886f
      // Need to fix this, to remove hardcoded paths
      modDeps = require('json!resources/module-dependencies');
   } catch (e) {
   }
   try {
      contents = require('json!resources/contents');
   } catch (e) {
   }
   try {
      bundles = require('json!resources/bundlesRoute');
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

      getDepsCollector: function() {
         return new DepsCollector(modDeps.links, modDeps.nodes, bundles, this.themesActive, true);
      },
      initThemesController: function(themedCss, simpleCss) {
         return ThemesController.getInstance().initCss({
            themedCss: themedCss,
            simpleCss: simpleCss
         });
      },

      getSerializedData: function() {
         return AppEnv.getStateReceiver().serialize();
      },

      pushWaiterDeferred: function(def) {
         var self = this;
         var depsCollector = self.getDepsCollector();
         self.waiterDef = def;
         self.waiterDef.addCallback(function() {
            if (self.defRender.isReady()) {
               return null;
            }
            var components = Object.keys(self.depComponentsMap);
            var files = {};
            if (self.isDebug) {
               files = {};
            } else {
               files = depsCollector.collectDependencies(components);
               self.initThemesController(files.css.themedCss, files.css.simpleCss);
            }

            var rcsData = self.getSerializedData();
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
            if (!self.isDebug) {
               for (var i = 0; i < additionalDeps.js.length; i++) {
                  if (!~files.js.indexOf(additionalDeps.js[i])) {
                     files.js.push(additionalDeps.js[i]);
                  }
               }
            }

            self._version++;
            self.defRender.callback({
               js: files.js,
               tmpl: files.tmpl || [],
               wml: files.wml || [],
               css: files.css || { themedCss: [], simpleCss: [] },
               errorState: self.err,
               receivedStateArr: rcsData.serialized,
               additionalDeps: Object.keys(rcsData.additionalDeps).concat(Object.keys(self.additionalDeps)),
               cssToDefine: files.cssToDefine
            });
         });
      },
      constructor: function(theme, cssLinks) {
         if (typeof theme !== 'string') {
            cssLinks = theme;
         }
         this.defRender = new Deferred();
         this.depComponentsMap = {};
         this.receivedStateArr = {};
         this.additionalDeps = {};
         this.themesActive = true;
         this.cssLinks = cssLinks || [];
         this.isDebug = this.isDebug();

         // переедет в константы реквеста, изменяется в Controls/Application
         this.isNewEnvironment = false;
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
      },
      resetRenderDeferred: function() {
         this.defRender = new Deferred();
      },

      isDebug: function() {
         return Env.cookie.get('s3debug') === 'true' || contents.buildMode === 'debug';
      },

      _getDictList: function() {
         return i18n._dictNames;
      },

      _getDictionaries: function() {
         var dictList = this._getDictList();
         var dicts = {};
         for (var lang in dictList) {
            for (var key in dictList[lang]) {
               dicts[key] = true;
            }
         }
         return Object.keys(dicts);
      }
   });
});
