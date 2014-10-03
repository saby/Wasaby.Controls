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
             * @cfg {Object} Отступы
             */
            offset: {
               top: null,
               left: null
            },

            /**
             * @typedef {Object} CornerEnum
             * @variant tl верхний левый
             * @variant tr верхний правый
             * @variant br нижний правый
             * @variant bl нижний левый
             */
            /**
             * @cfg {CornerEnum} По какому углу таргета выравнивание
             */
            corner: null,

            verticalAlign: {
               /**
                * @typedef {Object} VerticalAlignEnum
                * @variant top
                * @variant bottom
                */
               /**
                * @cfg {VerticalAlignEnum} Вертикальное выравнивание контрола
                */
               side:null,
               /**
                * @cfg {Number} отступ
                */
               offset: 0
            },

            /**
             * @cfg {Object} От какого угла идет отсчет координат
             */
            horizontalAlign: {
               /**
                * @typedef {Object} HorizontalAlignEnum
                * @variant right
                * @variant left
                */
               /**
                * @cfg {HorizontalAlignEnum}
                */
               side:null,
               /**
                * @cfg {Number} отступ
                */
               offset: 0
            },
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
            offset = this._getGeneralOffset();
         }
         this._container.css({
            'left' : offset.left + this._options.offset.left,
            'top' : offset.top + this._options.offset.top
         });
      },

      _getGeneralOffset: function(){
         var offset = {
            'left' : 0,
            'top' : 0
            },
            buf;

         buf = this._getOffsetByCorner(this._options.corner);
         offset.left = buf.left;
         offset.top = buf.top;
         buf = this._getAlignOffset(this._options.verticalAlign.side,this._options.horizontalAlign.side);
         offset.left += buf.left;
         offset.top += buf.top;
         offset = this._displaySizeCorrection(offset);
         //console.log(offset);
         return offset;
      },

      // Вычисляем сдвиг в зависимости от выравнивания
      _getAlignOffset: function(vert, horiz){
         var offset = {
            'top': 0,
            'left': 0
         };

         if (vert == 'bottom'){
            offset.top -= this._container.height();
         }
         if (horiz == 'right'){
            offset.left -= this._container.width();
         }

         offset.left += this._options.horizontalAlign.offset;
         offset.top += this._options.verticalAlign.offset;
         return offset;
      },

      // Вычисляем сдвиг в зависимости от угла
      _getOffsetByCorner: function(corner){
         var offset = this._options.target.offset(),
             height = this._options.target.outerHeight(),
             width = this._options.target.width();
         switch (corner){
            case 'tr': offset.left += width;
               return offset;
            case 'bl': offset.top += height;
               return offset;
            case 'br': offset.top += height;
               offset.left+= width;
               return offset;
            default : return offset; //tl
         }
      },

      //Проверям убираемся ли в экран
      _displaySizeCorrection: function(offset){
         var buf = {
            'top': 0,
            'left': 0
            };

         if ($(document).height() <= this._container.outerHeight() + offset.top){
            //offset.top -= ( this._options.target.height() + this._container.outerHeight());
            buf = this._getAlignOffset('bottom',this._options.horizontalAlign.side);
            offset.top += ( buf.top - this._options.target.height());
         }
         if ($(document).width() <= this._container.outerWidth() + offset.left){
            //offset.left += this._options.target.outerWidth() - this._container.outerWidth();
            buf = this._getAlignOffset(this._options.verticalAlign.side,'right');
            offset.left += ( buf.left + this._options.target.width());
         }
         return offset;
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