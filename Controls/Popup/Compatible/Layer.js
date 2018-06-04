/**
 * Created by as.krasilnikov on 14.05.2018.
 */

function getDeps() {
   var deps = ['Core/Deferred', 'Core/moduleStubs', 'Core/constants'];

   //Если query загрузили в шаблоне страницы, то require о нем ничего не знает -> загрузит второй раз -> затрутся
   //все jquery-плагины, которые уже навесили свои функции на узлы dom-дерева.
   //Если $ уже есть, то не грузим его еще раз
   if (!$) {
      deps.push('cdn!jquery/3.3.1/jquery-min.js');
   }
   return deps;
}

define('Controls/Popup/Compatible/Layer', getDeps(), function(Deferred, moduleStubs, Constants) {
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
