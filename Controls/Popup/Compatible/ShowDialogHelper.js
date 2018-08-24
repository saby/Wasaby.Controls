define('Controls/Popup/Compatible/ShowDialogHelper', ['require', 'Core/Deferred', 'Core/moduleStubs'],
   function(require, Deferred, moduleStubs) {

      function isNewEnvironment() {
         var cn = document.getElementsByTagName('html')[0].controlNodes,
            compat = cn && cn[0] && cn[0].options && cn[0].options.compat || false;
         //Существуют Application.Compatible - там все старое
         return !!cn && (!compat);
      }

      return function(path, config) {
         var result = moduleStubs.requireModule(path).addCallback(function(Component) {
            if (isNewEnvironment()) {
               var dfr = new Deferred();

               var deps = ['Controls/Popup/Opener/BaseOpener'];
               if (config.isStack === true) {
                  deps.push('Controls/Popup/Opener/Stack/StackController');
                  config._type = 'stack';
               } else if (config.target) {
                  deps.push('Controls/Popup/Opener/Sticky/StickyController');
                  config._type = 'sticky';
               } else {
                  deps.push('Controls/Popup/Opener/Dialog/DialogController');
                  config._type = 'dialog';
               }
               deps.push(config.template);

               requirejs(['Controls/Popup/Compatible/Layer'], function(CompatiblePopup) {
                  CompatiblePopup.load().addCallback(function() {
                     require(deps, function(BaseOpener, Strategy) {
                        var CoreTemplate = require(config.template);
                        config._initCompoundArea = function(compoundArea) {
                           dfr && dfr.callback(compoundArea);
                           dfr = null;
                        };
                        BaseOpener.showDialog(CoreTemplate, config, Strategy);
                     });
                  });
               });
               return dfr;
            } else {
               return new Component[0](config);
            }

         });
         return result;
      };
   }
);
