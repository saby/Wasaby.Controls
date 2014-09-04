/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('js!SBIS3.CONTROLS._PopupMixin', [], function() {
   /**
    * Миксин определяющий поведение контролов, которые отображаются с абсолютным позиционированием поверх всех остальных компонентов (диалоговые окна, плавающие панели, подсказки).
    * При подмешивании этого миксина в контрол, он вырезается из своего местоположения и вставляется в Body.
    * @mixin SBIS3.CONTROLS._PopupMixin
    */
   var _PopupMixin = /** @lends SBIS3.CONTROLS._PopupMixin.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {Number} Отступ слева
             */
            left: null,

            /**
             * @cfg {Number} Отступ сверху
             */
            top: null,

            /**
             * @cfg {Number} Отступ справа
             */
            right: null,

            /**
             * @cfg {Number} Отступ снизу
             */
            bottom: null,

            /**
             * @cfg {String|jQuery|HTMLElement} элемент, относительно которого позиционируется всплывающее окно
             */
            target: null
         }
      },

      $constructor: function() {
         var container = this._container;
         this.hide();
         container.css('position', 'absolute');
         container.appendTo('body');

         this.recalcPosition();
      },

      /**
       * Передвинуть всплывающее окно по координатам
       * @param top
       * @param right
       * @param bottom
       * @param left
       */
      moveTo: function(top, right, bottom, left) {

      },

      /**
       * Передвинуть всплывающее окно в центр
       */
      moveToCenter: function() {

      },

      recalcPosition : function() {
         var offset = {
            'left' : 0,
            'top' : 0
         };
         if (this._options.target) {
            offset = this._options.target.offset();
         }
         this._container.css({
            'left' : offset.left + this._options.left,
            'top' : offset.top + this._options.target.outerHeight() + this._options.top
         });
      }
   };

   return _PopupMixin;

});