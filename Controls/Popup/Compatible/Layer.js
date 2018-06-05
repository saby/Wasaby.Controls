/**
 * Created by as.krasilnikov on 14.05.2018.
 */
define('Controls/Popup/Compatible/Layer', ['Core/Deferred', 'Core/moduleStubs', 'Core/constants',  '/cdn/jquery/3.3.1/jquery-min.js'], function(Deferred, moduleStubs, Constants) {
   'use strict';

   var loadDeferred;
   var compatibleDeps = [
      'Lib/Control/Control.compatible',
      'Lib/Control/AreaAbstract/AreaAbstract.compatible',
      'Lib/Control/BaseCompatible/BaseCompatible',
      'Core/vdom/Synchronizer/resources/DirtyCheckingCompatible',
      'View/Runner/Text/markupGeneratorCompatible',
      'cdn!jquery-cookie/04-04-2014/jquery-cookie-min.js',
      'Core/nativeExtensions',

      // todo возможно надо грузить весь core-extensions
      'is!browser?WS.Data/ContextField/Flags',
      'is!browser?WS.Data/ContextField/Record',
      'is!browser?WS.Data/ContextField/Enum',
      'is!browser?WS.Data/ContextField/List'
   ];

   return {
      load: function(deps) {
         if (!loadDeferred) {
            loadDeferred = new Deferred();

            if (window && window.$) {
               Constants.$win = $(window);
               Constants.$doc = $(document);
               Constants.$body = $('body');
            }

            deps = (deps || []).concat(compatibleDeps);

            moduleStubs.require(deps).addCallback(function(result) {
               // var tempCompatVal = constants.compat;
               Constants.compat = true;
               loadDeferred.callback(result);

               // constants.compat = tempCompatVal; //TODO выпилить
               (function($) {
                  $.fn.wsControl = function() {
                     var control = null,
                        element;
                     try {
                        element = this[0];
                        while (element) {
                           if (element.wsControl) {
                              control = element.wsControl;
                              break;
                           }
                           element = element.parentNode;
                        }
                     } catch (e) {
                     }
                     return control;
                  };
               })(jQuery);
            });
         }
         return loadDeferred;
      }
   };
});
