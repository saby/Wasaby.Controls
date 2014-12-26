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

         this._container.mousedown(function (e) {
            if (e.which == 1 && self.isEnabled()) {
               self._container.addClass('controls-Click__active');
            }
            //return false;
         });
      },
      _clickHandler : function() {

      },

      _notifyOnActivated : function() {
         this._notify('onActivated');
      },

      instead : {
         //TODO сделано через onClickHandler WS в базовом контроле
         _onClickHandler: function(parentFnc, e) {
            if (this.isEnabled()) {
               this._container.removeClass('controls-Click__active');
               this._clickHandler(e);
               this._notifyOnActivated();
            }
         }
      }
   };

   return _ClickMixin;

});/**
 * Created by kraynovdo on 27.10.2014.
 */
