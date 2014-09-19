/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('js!SBIS3.CONTROLS._PopupMixin', [], function() {
   var zIndexManager = {
      _cur : 100500,

      setFree : function(zIndex) {
         zIndex = parseInt(zIndex, 10);
         if (zIndex == this._cur) {
            this._cur--;
         }
         return this._cur;
      },
      getNext : function() {
         this._cur++;
         return this._cur;
      }

   };
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

         var zIndex = zIndexManager.getNext();
         container.css('zIndex', zIndex);

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
            offset.top += this._options.target.outerHeight();
            //Проверям убираемся ли в экран
            if ($(document).width() <= this._container.width() + this._container.offset().left){
               offset.left += this._options.target.outerWidth() - this._container.outerWidth();
            }
         }
         this._container.css({
            'left' : offset.left + this._options.left,
            'top' : offset.top + this._options.top
         });
      },



      before : {
         destroy : function() {
            var zIndex = this._container.css('zIndex');
            zIndexManager.setFree(zIndex);
         }
      }
   };

   return _PopupMixin;

});