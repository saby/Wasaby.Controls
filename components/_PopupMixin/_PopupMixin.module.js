/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('js!SBIS3.CONTROLS._PopupMixin', [], function () {
   var zIndexManager = {
      _cur: 100500,

      setFree: function (zIndex) {
         zIndex = parseInt(zIndex, 10);
         if (zIndex == this._cur) {
            this._cur--;
         }
         return this._cur;
      },
      getNext: function () {
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
         _targetSizes: {},
         _containerSizes: {},
         _isMovedH: false,
         _isMovedV: false,
         _corner: '',
         _hSide: '',
         _vSide: '',
         _options: {
            /**
             * @typedef {Object} CornerEnum
             * @variant tl верхний левый
             * @variant tr верхний правый
             * @variant br нижний правый
             * @variant bl нижний левый
             */
            /**
             * @cfg {Object} От какого угла идет отсчет координат
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
               side: null,
               /**
                * @cfg {Number} отступ
                */
               offset: 0
            },

            horizontalAlign: {
               /**
                * @typedef {Object} HorizontalAlignEnum
                * @variant right
                * @variant left
                */
               /**
                * @cfg {HorizontalAlignEnum}
                */
               side: null,
               /**
                * @cfg {Number} отступ
                */
               offset: 0
            },
            /**
             * @cfg {String|jQuery|HTMLElement} элемент, относительно которого позиционируется всплывающее окно
             */
            target: undefined,

            /**
             * @cfg {Boolean} закрывать или нет при клике мимо
             */
            closeByClick: false
         }
      },

      $constructor: function () {
         var self = this;
         var container = this._container;
         var trg = $ws.helpers.trackElement(this._options.target, true);
         this.hide();
         container.css('position', 'absolute');
         container.appendTo('body');
         var zIndex = zIndexManager.getNext();
         container.css('zIndex', zIndex);

         this._initSizes();

         this._corner = this._options.corner;
         this._vSide = this._options.verticalAlign.side;
         this._hSide = this._options.horizontalAlign.side;

         $(window).bind('resize', function () {
            self._container.offset({
               top: self._correctionByDisplaySize('vertical').top,
               left: self._correctionByDisplaySize('horizontal').left
            });
         });

         if (this._options.closeByClick) {
            /*TODO это как то получше надо переписать*/
            $('html').mousedown(function (e) {
               var inPopup = self._container.find($(e.target)),inTarget=[];
               if (self._options.target) {
                  inTarget = self._options.target.find($(e.target));
               }
               if (!inPopup.length && !inTarget.length) {
                  self._container.hide();
               }
            });
         }

         trg.subscribe('onMove', function () {
            self.recalcPosition();
         });
      },

      //Кэшируем размеры
      _initSizes: function () {
         var target = this._options.target,
            container = this._container;
         if (target) {
            this._targetSizes.width = target.outerWidth();
            this._targetSizes.height = target.outerHeight();
            this._targetSizes.offset = target.offset();
            this._targetSizes.border = (target.outerWidth() - target.innerWidth()) / 2;
         }

         this._containerSizes.width = this._containerSizes.originWidth;
         this._containerSizes.height = this._containerSizes.originHeight;
         this._containerSizes.originOffset = container.offset();
         this._containerSizes.border = (this._containerSizes.originWidth - container.innerWidth()) / 2;

      },

      recalcPosition: function () {
         this._initSizes();
         if (this._options.target) {
            this._containerSizes.originOffset = this._getGeneralOffset(this._options.verticalAlign.side, this._options.horizontalAlign.side, this._options.corner);
            this._containerSizes.offset = {
               top:  this._containerSizes.originOffset.top,
               left: this._containerSizes.originOffset.left
            };

            this._container.offset({
               top: this._correctionByDisplaySize('vertical').top,
               left: this._correctionByDisplaySize('horizontal').left
            });
         } else {
            this._container.offset(this._bodyPositioning());
         }
      },

      //Позиционируем если не задан таргет
      _bodyPositioning: function(){
         var
            width = this._containerSizes.width,
            height = this._containerSizes.height,
            bodyHeight = $('body').outerHeight(true),
            bodyWidth = $('body').outerWidth(true),
            vAlign = this._options.verticalAlign.side,
            hAlign = this._options.horizontalAlign.side,
            offset = {
              top:  this._options.verticalAlign.offset,
              left : this._options.horizontalAlign.offset
            };
         if (vAlign == 'bottom'){
            offset.top = bodyHeight - offset.top - height;
         }
         if (hAlign == 'right'){
            offset.left = bodyWidth - offset.left - width;
         }
         return offset;
      },

      //Вычисляем сдвиг в зависимости от выравнивания
      _getGeneralOffset: function (vert, horiz, corner) {
         var offset = this._getOffsetByCorner(corner);
         this._vSide = vert;
         this._hSide = horiz;
         if (vert == 'bottom') {
            offset.top -= this._containerSizes.originHeight - this._targetSizes.border;
         }
         if (horiz == 'right') {
            offset.left -= this._containerSizes.originWidth - this._targetSizes.border;
         }
         offset.left += this._options.horizontalAlign.offset;
         offset.top += this._options.verticalAlign.offset;
         return offset;
      },

      //Вычисляем сдвиг в зависимости от угла
      _getOffsetByCorner: function (corner) {
         var border = this._targetSizes.border,
            height = this._targetSizes.height,
            width = this._targetSizes.width,
            offset = {
               top: this._targetSizes.offset.top,
               left: this._targetSizes.offset.left
            };

         switch (corner) {
            case 'tr':
               offset.left += width - border;
               offset.top -= border;
               break;
            case 'bl':
               offset.top += height;
               break;
            case 'br':
               offset.top += height;
               offset.left += width - border;
               break;
            case 'tl':
               offset.top -= border;
               break; //tl
            default:
               throw new Error('Параметр corner является обязательным');
         }
         this._corner  = corner;
         return offset;
      },

      //Если есть таргет считаем влезаем ли в экран и меняем размеры
      _correctionByDisplaySize: function(direction){
         var s =[],
            offset = {
               top : this._containerSizes.offset.top,
               left : this._containerSizes.offset.left
            },
            spaces = this._calculateSpaces(),
            over, isMoved, winSize;

         if (direction == 'horizontal'){
            s[0] = 'left';
            s[1] = 'right';
            s[2] = 'width';
            s[3] = 'horizontalAlign';
            s[4] = (this._options.corner == 'br' || this._options.corner == 'tr');
            s[5] = - this._targetSizes.border;
            s[6] = 0;
            s[7] = 'originWidth';
            s[8] = 'overflow-x';
            over = ($(window).width() - 3 < this._containerSizes.originWidth + offset.left);
            isMoved = this._isMovedH;
            winSize = $(window).width();
         } else
         if (direction == 'vertical'){
            s[0] = 'top';
            s[1] = 'bottom';
            s[2] = 'height';
            s[3] = 'verticalAlign';
            s[4] = (this._options.corner == 'br' || this._options.corner == 'bl');
            s[5] = 0;
            s[6] = - this._targetSizes.border;
            s[7] = 'originHeight';
            s[8] = 'overflow-y';
            over = ($(window).height() - 3 < this._containerSizes.originHeight + offset.top);
            isMoved = this._isMovedV;
            winSize = $(window).height();
         }

         if (over && !isMoved) {
            offset = this._getOppositeOffset(s[0]);
            isMoved = true;
         }

         if (winSize > this._containerSizes[s[2]] + this._containerSizes.originOffset[s[0]] && isMoved){
            offset[s[0]] = this._getOppositeOffset(s[0])[s[0]];
            isMoved = false;
         }

         (direction == 'horizontal') ? this._isMovedH = isMoved : this._isMovedV = isMoved;

         this._containerSizes.offset[s[0]] = offset[s[0]];

         if (offset[s[0]] <= 0){
            this._calculateOverflow(offset,s);
         }

         this._container.css((direction == 'horizontal') ? 'overflow-x' : 'overflow-y', 'auto');

         if (this._containerSizes[s[7]] < spaces[s[1]]) {
            this._container[s[2]](this._containerSizes[s[7]]);
            this._container.css((direction == 'horizontal') ? 'overflow-x' : 'overflow-y', 'visible');
         }
         return offset;
      },

      //Рассчитать расстояний от таргета до границ экрана с учетом собственного положения попапа
      _calculateSpaces: function(){
         var corner = this._options.corner,
            offset = this._targetSizes.offset,
            width = this._targetSizes.width,
            height = this._targetSizes.height,
            windowHeight = $(window).height(),
            windowWidth = $(window).width(),
            spaces = {
               top: 0,
               left: 0,
               bottom: 0,
               right: 0
            };

         switch (corner){
            case 'br': spaces.left = offset.left + width;
               spaces.top = offset.top;
               break;
            case 'tr': spaces.left = offset.left + width;
               spaces.top = offset.top;
               break;
            case 'tl': spaces.left = offset.left;
               spaces.top = offset.top;
               break;
            case 'bl': spaces.left = offset.left;
               spaces.top = offset.top;
               break;
            default: return spaces;
         }

         if (corner == 'tl' || corner =='tr') {
            spaces.bottom = windowHeight - spaces.top;
         } else {
            spaces.bottom = windowHeight - spaces.top - height;
         }

         if (corner == 'tr' || corner =='br') {
            spaces.right = windowWidth - spaces.left;
         } else {
            spaces.right = windowWidth - spaces.left;
         }

         return spaces;
      },

      _calculateOverflow: function(offset,s){
         var spaces = this._calculateSpaces();

         if (spaces[s[1]] > spaces[s[0]]){
            offset[s[0]] = (s[4]) ? this._targetSizes.offset[s[0]] + this._targetSizes[s[2]] + s[5]  : this._targetSizes.offset[s[0]] + s[6];
            offset[s[0]] += this._options[s[3]].offset;
            s[9] = spaces[s[1]] - 2;
         } else {
            s[9] = spaces[s[0]];
            offset[s[0]] = 0;
         }
         this._container[s[2]](s[9]);
      },

      _getOppositeOffset: function (orientation){  // Получить offset при сдвиге в противоположный угол относительно this._corner по горизонтали или верткали 'top'/'left'
         var side = (orientation == 'left') ? this._hSide : this._vSide,
            isVertical = (side == 'top' || side == 'bottom'),
            offset,
            position = {
               corner: this._corner,
               side: ''
            }, opoSide;

         if (isVertical) {opoSide = (side == 'top') ? 'bottom' : 'top';} else {opoSide = (side == 'left') ? 'right' : 'left';}

         switch (this._corner){
            case 'br': if (isVertical) {
               if (this._hSide == 'right') {position.corner = 'tr'}
            } else {
               position.corner = 'bl';
            }
               position.side = opoSide;
               break;

            case 'tr': if (isVertical) {
               if (this._hSide == 'right') {position.corner = 'br'}
            } else {
               position.corner = 'tl';
            }
               position.side = opoSide;
               break;

            case 'bl': if (isVertical){
               if (this._hSide == 'left') {position.corner = 'tl'}
            } else {
               position.corner = 'br';
            }
               position.side = opoSide;
               break;

            case 'tl': if (isVertical){
               if (this._hSide == 'left') {position.corner = 'bl'}
            } else {
               position.corner = 'tr';
            }
               position.side = opoSide;
         }

         if (isVertical) {
            this._vSide = position.side;
         } else {
            this._hSide = position.side;
         }
         this._corner = position.corner;
         offset = this._getGeneralOffset(this._vSide,this._hSide, position.corner);
         return offset;
      },


      /**
       * Передвинуть всплывающее окно по координатам
       * @param top
       * @param right
       * @param bottom
       * @param left
       */
      moveTo: function (top, right, bottom, left) {

      },

      /**
       * Передвинуть всплывающее окно в центр
       */
      moveToCenter: function () {

      },

      after: {
         show: function () {
            if (this._container.attr('overflow-x') == 'auto') {
               this._containerSizes.originWidth = this._container.scrollWidth;
            } else {
               this._containerSizes.originWidth = this._container.innerWidth();
            }
            if (this._container.attr('overflow-y') == 'auto') {
               this._containerSizes.originHeight = this._container.scrollHeight;
            } else {
               this._containerSizes.originHeight = this._container.innerHeight();
            }
            this.recalcPosition();
         }
      },

      before: {
         destroy: function () {
            var zIndex = this._container.css('zIndex');
            zIndexManager.setFree(zIndex);
         }
      }
   };

   return _PopupMixin;

});