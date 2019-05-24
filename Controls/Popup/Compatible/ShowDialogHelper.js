define('Controls/Popup/Compatible/ShowDialogHelper', ['require', 'Core/Deferred', 'Core/moduleStubs', 'Core/helpers/isNewEnvironment'],
   function(require, Deferred, moduleStubs, isNewEnvironment) {
      var _private = {
         prepareDeps: function(config) {
            var dependencies = ['Controls/popup'];
            if (config.isStack === true) {
               dependencies.push('Controls/popupTemplate');
               config._path = 'StackController';
               config._type = 'stack';
            } else if (config.target) {
               dependencies.push('Controls/popupTemplate');
               config._path = 'StickyController';
               config._type = 'sticky';
            } else {
               dependencies.push('Controls/popupTemplate');
               config._path = 'DialogController';
               config._type = 'dialog';
            }
            config._popupComponent = 'floatArea';
            dependencies.push(config.template);
            return dependencies;
         }
      };

      var DialogHelper = {
         open: function(path, config) {
            var result = moduleStubs.requireModule(path).addCallback(function(Component) {
               if (isNewEnvironment()) {
                  var dfr = new Deferred();
                  var deps = _private.prepareDeps(config);
                  requirejs(['Lib/Control/LayerCompatible/LayerCompatible'], function(CompatiblePopup) {
                     CompatiblePopup.load().addCallback(function() {
                        require(deps, function(popup, Strategy) {
                           var CoreTemplate = require(config.template);
                           config._initCompoundArea = function(compoundArea) {
                              dfr && dfr.callback(compoundArea);
                              dfr = null;
                           };
                           popup.BaseOpener.showDialog(
                              CoreTemplate, config, config._path ? Strategy[config._path] : Strategy
                           );
                        });
                     });
                  });
                  return dfr;
               }
               return new Component[0](config);
            });
            return result;
         }
      };
      DialogHelper._private = _private;

      return DialogHelper;
   });
