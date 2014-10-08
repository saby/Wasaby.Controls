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
         _offset: null, // Хранит оффсет полученный из опций (align, offset, corner)
         _targetSizes: null,
         _containerSizes: null,
         _options: {
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
         var self = this;
         var container = this._container;
         var trg = $ws.helpers.trackElement(this._options.target, true);
         this.hide();
         container.css('position', 'absolute');
         container.appendTo('body');
         var zIndex = zIndexManager.getNext();
         container.css('zIndex', zIndex);
         this._initSizes();
         this.recalcPosition();

         $(window).bind('resize', function(){
            self._correctionByDisplaySize();
         });

         trg.subscribe('onMove', function() {
            self.recalcPosition();
         });

      },

      _initSizes: function(){
         this._targetSizes = {
            width : this._options.target.outerWidth(),
            height : this._options.target.outerHeight()
         };

         this._containerSizes = {
            width : this._container.outerWidth(),
            height : this._container.outerHeight()
         };
         console.log(this._targetSizes);
         console.log(this._containerSizes);
      },

      recalcPosition : function() {
         console.time('recalc');
         if (this._options.target) {
           this._setOffset();
         }
         console.timeEnd('recalc');
      },

      _setOffset: function(){
         this._offset = this._options.target.offset();
         this._offset = this._getOffsetByCorner(this._options.corner);
         this._offset = this._getAlignOffset(this._options.verticalAlign.side,this._options.horizontalAlign.side);
         this._correctionByDisplaySize();
      },

      // Вычисляем сдвиг в зависимости от выравнивания
      _getAlignOffset: function(vert, horiz){
         var offset = this._offset,
             border = this._container.outerWidth() - this._container.innerWidth();

         if (vert == 'bottom'){
            offset.top -= this._container.outerHeight() - border/2;
         }
         if (horiz == 'right'){
            offset.left -= this._container.outerWidth() - border/2;
         }

         offset.left += this._options.horizontalAlign.offset;
         offset.top += this._options.verticalAlign.offset;
         return offset;
      },

      // Вычисляем сдвиг в зависимости от угла
      _getOffsetByCorner: function(corner){
         var border = (this._options.target.outerWidth() - this._options.target.innerWidth())/2,
             height = this._options.target.outerHeight(),
             width = this._options.target.outerWidth(),
             offset = this._offset;

         switch (corner){
            case 'tr': this._offset.left += width - border;
               offset.top -= border;
               break;
            case 'bl': offset.top += height;
               break;
            case 'br': this._offset.top += height;
               offset.left+= width - border;
               break;
            case 'tl': offset.top -= border;
               break; //tl
            default: throw new Error('Параметр corner является обязательным');
         }
         return offset;
      },

      //Проверям убираемся ли в экран
      _correctionByDisplaySize: function(){
         var offset = {
            top: this._offset.top,
            left: this._offset.left
            },
            corner = this._options.corner;

         if ($(window).height() <= this._container.outerHeight() + offset.top){
            if ((corner == 'bl' || corner == 'br')){
               offset.top -= (this._options.target.outerHeight() + this._container.outerHeight());
            } else {
               offset.top -= this._container.outerHeight();
            }
         }
         if ($(window).width() <= this._container.outerWidth() + offset.left){
            if (corner == 'tl' || corner == 'bl'){
               offset.left += (this._options.target.outerWidth() - this._container.outerWidth());
            } else {
               offset.left -= this._container.outerWidth();
            }
         }

         if (offset.left < 0) {
            offset.left = 0;
         }

         if (offset.top < 0) {
            offset.top = 0;
         }

         this._container.offset(offset);
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

      before : {
         destroy : function() {
            var zIndex = this._container.css('zIndex');
            zIndexManager.setFree(zIndex);
         }
      }
   };

   return _PopupMixin;

});