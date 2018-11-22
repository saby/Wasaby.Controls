define('Controls/Application/HeadDataContext', [
   'Core/DataContext',
   'Controls/Application/DepsCollector/DepsCollector',
   'Core/Deferred',
   'Core/cookie',
   'View/Request',
   'Core/Themes/ThemesController'

], function(DataContext,
   DepsCollector,
   Deferred,
   cookie,
   Request,
   ThemesController) {
   var bundles, modDeps, contents;
   try {
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

   return DataContext.extend({
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
            if (self.isDebug) {
               var files = {};
            } else {
               var files = depsCollector.collectDependencies(components);
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
