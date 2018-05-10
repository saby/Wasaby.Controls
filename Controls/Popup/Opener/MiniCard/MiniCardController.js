define('Controls/Popup/Opener/MiniCard/MiniCardController',
   [
      'Core/Deferred',
      'Controls/Popup/Opener/Sticky/StickyController',

      'css!Controls/Popup/Opener/MiniCard/MiniCardController'
   ],
   function(Deferred, StickyController) {

      'use strict';

      var MiniCardController = StickyController.constructor.extend({
         elementCreated: function(cfg) {
            cfg.popupOptions.className = 'controls-MiniCardController controls-MiniCardController_open';

            return MiniCardController.superclass.elementCreated.apply(this, arguments);
         },

         elementDestroyed: function(element, container) {
            var
               self = this,
               def = new Deferred();

            container.addEventListener('transitionend', function() {
               self._stack.remove(element);
               self._update();
               def.callback();
            });
            container.classList.remove('controls-MiniCardController_open');
            container.classList.add('controls-MiniCardController_close');

            return def;
         }
      });

      return new MiniCardController();
   }
);