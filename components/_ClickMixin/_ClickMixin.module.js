define('js!SBIS3.CONTROLS._ClickMixin', [], function() {

   if (typeof window !== 'undefined') {
      $(document).mouseup(function () {
         $('.controls-Click__active').removeClass('controls-Click__active');
      });
   }

   /**
    * Миксин, добавляющий поведение хранения выбранного элемента. Всегда только одного
    * @mixin SBIS3.CONTROLS._ClickMixin
    */

   var _ClickMixin = /**@lends SBIS3.CONTROLS._ClickMixin.prototype  */{
      $protected: {
         _options: {

         }
      },

      $constructor: function() {
         this._publish('onActivated');
         var self = this;
         /*TODO пока подписываемся на mouseup, потому что CONTROL херит событие клика*/
         this._container.mouseup(function (e) {
            if (e.which == 1 && self.isEnabled()) {
               self._container.removeClass('controls-Click__active');
               self._clickHandler(e);
               self._notifyOnActivated();
            }
         });
         this._container.mousedown(function (e) {
            if (e.which == 1 && self.isEnabled()) {
               self._container.addClass('controls-Click__active');
            }
            return false;
         });
      },
      _clickHandler : function() {

      },
      _notifyOnActivated : function() {
         this._notify('onActivated');
      }
   };

   return _ClickMixin;

});/**
 * Created by kraynovdo on 27.10.2014.
 */
