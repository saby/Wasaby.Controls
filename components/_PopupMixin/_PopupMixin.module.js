/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('js!SBIS3.CONTROLS._PopupMixin', ['js!SBIS3.CONTROLS.ControlHierarchyManager', 'js!SBIS3.CORE.ModalOverlay'], function (ControlHierarchyManager, ModalOverlay) {

   if (typeof window !== 'undefined') {
      var eventsChannel = $ws.single.EventBus.channel('WindowChangeChannel');

      $(document).bind('mousedown', function (e) {
         eventsChannel.notify('onDocumentClick', e.target);
      });

      $(window).bind('scroll', function () {
         eventsChannel.notify('onWindowScroll');
      });

      $(window).bind('resize', function () {
         eventsChannel.notify('onWindowResize');
      });
   }

   /**
    * Миксин определяющий поведение контролов, которые отображаются с абсолютным позиционированием поверх всех остальных компонентов (диалоговые окна, плавающие панели, подсказки).
    * При подмешивании этого миксина в контрол, он вырезается из своего местоположения и вставляется в Body.
    * @mixin SBIS3.CONTROLS._PopupMixin
    */
   var _PopupMixin = /** @lends SBIS3.CONTROLS._PopupMixin.prototype */ {
      $protected: {
         _targetSizes: {},
         _containerSizes: {},
         _windowSizes: {},
         _isMovedH: false,
         _isMovedV: false,
         _defaultCorner: '',
         _defaultHorizontalAlignSide: '',
         _defaultVerticalAlignSide: '',
         _firstMove: true,
         _margins: {},
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
            /**
             * @typedef {Object} VerticalAlignEnum
             * @variant top
             * @variant bottom
             */
            /**
             * @typedef {Object} verticalAlign
             * @property {VerticalAlignEnum} side Вертикальное выравнивание контрола
             * @property {Number} offset отступ в пикселях
             */
            /**
             * @cfg {verticalAlign} авторесайз по высоте, если текст не помещается
             */
            verticalAlign: {},
            /**
             * @typedef {Object} HorizontalAlignEnum
             * @variant right
             * @variant left
             */
            /**
             * @typedef {Object} HorizontalAlign
             * @property {HorizontalAlignEnum} side Вертикальное выравнивание контрола
             * @property {Number} offset отступ в пикселях
             */
            /**
             * @cfg {HorizontalAlign} авторесайз по высоте, если текст не помещается
             */
            horizontalAlign: {},
            /**
             * @cfg {String|jQuery|HTMLElement} элемент, относительно которого позиционируется всплывающее окно
             */
            target: undefined,
            /**
             * @cfg {Boolean} закрывать или нет при клике мимо
             */
            closeByExternalClick: false,
            /**
             * @cfg {Boolean} Является модальным или нет
             */
            isModal: false
         }
      },

      $constructor: function () {
         this._publish('onClose');
         var self = this;
         var container = this._container;
         var trg = $ws.helpers.trackElement(this._options.target, true);
         container.css({
            'position': 'absolute',
            'top': '-1000px',
            'left': '-1000px'
         });

         //TODO: Придрот
         container.addClass('ws-hidden');
         this._isVisible = false;
         /********************************/

         this._cssHeight = (this._container.css('height') == '0px') ? 'auto' : this._container.css('height');
         this._cssWidth = (this._container.css('width') == '0px') ? 'auto' : this._container.css('width');

         //При ресайзе расчитываем размеры
         $ws.single.EventBus.channel('WindowChangeChannel').subscribe('onWindowResize', this._resizeHandler, this);

         //Скрываем попап если при скролле таргет скрылся
         $ws.single.EventBus.channel('WindowChangeChannel').subscribe('onWindowScroll', this._scrollHandler, this);

         if (this._options.closeByExternalClick) {
            $ws.single.EventBus.channel('WindowChangeChannel').subscribe('onDocumentClick', this._clickHandler, this);
         }

         container.appendTo('body');
         var zIndex = ControlHierarchyManager.zIndexManager.getNext();
         container.css('zIndex', zIndex);
         this._initSizes(true);
         this._defaultCorner = this._options.corner;
         this._defaultVerticalAlignSide = this._options.verticalAlign.side;
         this._defaultHorizontalAlignSide = this._options.horizontalAlign.side;

         trg.subscribe('onMove', function () {
            if (self.isVisible()) {
               self.recalcPosition();
               self._checkTargetPosition();
            } else {
               self._initSizes(false);
            }
         });

      },

      _checkTargetPosition: function () {
         var self = this;
         if (this._options.target) {
            var winHeight = this._windowSizes.height,
               top = this._options.target.offset().top - $(window).scrollTop() - winHeight;
            if (top > 0 || -top > winHeight) {
               self.hide();
            }
         }
      },

      _scrollHandler: function () {
         this._checkTargetPosition();
      },

      _resizeHandler: function () {
         if (this.isVisible()) {
            this._initWindowSizes();
            if (this._containerSizes.offset !== undefined) {
               this._container.offset({
                  top: this._correctionByDisplaySize('vertical', 'resize').top,
                  left: this._correctionByDisplaySize('horizontal', 'resize').left
               });
            }
            this._checkTargetPosition(); // следим за тем не пропал ли таргет
         }
      },

      _clickHandler: function (eventObject, target) {
         if (this.isVisible()) {
            var self = this,
               inTarget = [];
            if (self._options.target) {
               inTarget = !!self._options.target.find($(target)).length;
            }
            if (!inTarget && !ControlHierarchyManager.checkInclusion(self, target)) {
               self.hide();
            }
         }
      },

      //Кэшируем размеры
      _initSizes: function (initOrigins) {
         var target = this._options.target,
            container = this._container;
         if (target) {
            this._targetSizes.width = target.outerWidth();
            this._targetSizes.height = target.outerHeight();
            this._targetSizes.offset = target.offset();
            this._targetSizes.border = (target.outerWidth() - target.innerWidth()) / 2;
         }
         this._containerSizes.border = (container.outerWidth() - container.innerWidth()) / 2;

         if (initOrigins) {
            this._containerSizes.originWidth = this._container[0].scrollWidth + this._containerSizes.border * 2;
            this._containerSizes.originHeight = this._container[0].scrollHeight + this._containerSizes.border * 2;
         }

         this._containerSizes.width = this._containerSizes.originWidth;
         this._containerSizes.height = this._containerSizes.originHeight;
         this._containerSizes.originOffset = container.offset();
         this._initWindowSizes();
      },

      _initWindowSizes: function () {
         this._windowSizes.height = $(window).height();
         this._windowSizes.width = $(window).width();
      },

      _initMargins: function () {
         var container = this._container;
         this._margins = {
            top: parseInt(container.css('margin-top'), 10),
            left: parseInt(container.css('margin-left'), 10),
            bottom: parseInt(container.css('margin-bottom'), 10),
            right: parseInt(container.css('margin-right'), 10)
         };
      },

      recalcPosition: function () {
         this._initSizes(true);
         this._initMargins();
         //Если есть таргет - позиционируемся относительно его
         if (this._options.target) {
            this._containerSizes.originOffset = this._getGeneralOffset(this._defaultVerticalAlignSide, this._defaultHorizontalAlignSide, this._defaultCorner);
            this._containerSizes.offset = {
               top: this._containerSizes.originOffset.top,
               left: this._containerSizes.originOffset.left
            };
            this._container.offset({
               top: this._correctionByDisplaySize('vertical', 'recalc').top,
               left: this._correctionByDisplaySize('horizontal', 'recalc').left
            });
         } else { //Если таргета нет - относительно body
            this._container.offset(this._bodyPositioning());
         }
      },

      //Позиционируем относительно body
      _bodyPositioning: function () {
         var
            width = this._containerSizes.width,
            height = this._containerSizes.height,
            $body = $('body'),
            bodyHeight = $body.outerHeight(true),
            bodyWidth = $body.outerWidth(true),
            vAlign = this._defaultVerticalAlignSide,
            hAlign = this._defaultHorizontalAlignSide,
            offset = {
               top: this._options.verticalAlign.offset || 0,
               left: this._options.horizontalAlign.offset || 0
            };
         if (vAlign == 'bottom') {
            offset.top = bodyHeight - offset.top - height;
         }
         if (hAlign == 'right') {
            offset.left = bodyWidth - offset.left - width;
         }
         return offset;
      },

      //Вычисляем сдвиг в зависимости от выравнивания (по углу и вертикальному/горизонтальному выравниванию)
      _getGeneralOffset: function (vert, horiz, corner) {
         var offset = this._getOffsetByCorner(corner);
         this._options.verticalAlign.side = vert;
         this._options.horizontalAlign.side = horiz;
         if (vert == 'bottom') {
            offset.top -= this._containerSizes.originHeight - this._targetSizes.border;
         }
         if (horiz == 'right') {
            offset.left -= this._containerSizes.originWidth - this._targetSizes.border;
         }
         offset.left = offset.left + this._margins.left - this._margins.right + (this._options.horizontalAlign.offset || 0);
         offset.top = offset.top + this._margins.top - this._margins.bottom + (this._options.verticalAlign.offset || 0);
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
         this._options.corner = corner;
         return offset;
      },

      //Если есть таргет считаем влезаем ли в экран и меняем размеры и положение
      _correctionByDisplaySize: function (direction, init) {
         var s = [],
            self = this,
            offset = {
               top: this._containerSizes.offset.top,
               left: this._containerSizes.offset.left
            },
            spaces = this._getSpaces(),
            over, isMoved, winSize,
            isHorizontal = (direction == 'horizontal'),
            isVertical = (direction == 'vertical'),
            _addMargins = function () {
               if (!isHorizontal) {
                  offset[s[0]] -= self._margins.top * 2;
                  offset[s[0]] += self._margins.bottom * 2;
               } else {
                  offset[s[0]] -= self._margins.left * 2;
                  offset[s[0]] += self._margins.right * 2;
               }
            };

         // Заполняем массив для горизонтального/вертикального рассчетов
         if (isHorizontal) {
            s[0] = 'left';
            s[1] = 'right';
            s[2] = 'width';
            s[3] = 'horizontalAlign';
            s[4] = (this._defaultCorner == 'br' || this._defaultCorner == 'tr');
            s[5] = -this._targetSizes.border;
            s[6] = 0;
            s[7] = 'originWidth';
            s[8] = 'overflow-x';
            s[9] = this._cssWidth;
            over = (this._windowSizes.width - 3 < this._containerSizes.originWidth + this._containerSizes.originOffset.left); // Влезаем ли в экран
            isMoved = this._isMovedH; // Был произведен горизонтальный сдвиг или нет
            winSize = this._windowSizes.width;
         } else if (isVertical) {
            s[0] = 'top';
            s[1] = 'bottom';
            s[2] = 'height';
            s[3] = 'verticalAlign';
            s[4] = (this._defaultCorner == 'br' || this._defaultCorner == 'bl');
            s[5] = 0;
            s[6] = -this._targetSizes.border;
            s[7] = 'originHeight';
            s[8] = 'overflow-y';
            s[9] = this._cssHeight;
            over = (this._windowSizes.height - 3 < this._containerSizes.originHeight + this._containerSizes.originOffset.top); // Влезаем ли в экран
            isMoved = this._isMovedV; // Был произведен вертикальный сдвиг или нет
            winSize = this._windowSizes.height;
         }
         //Если не влезаем в экран, но еще не перемещались то перемещаемся в противоположный угол
         if (over && !isMoved) {
            offset[s[0]] = this._getOppositeOffset(s[0])[s[0]];
            _addMargins();
            isMoved = true;
         } else {
            if (init == 'recalc' && over) {
               offset[s[0]] = this._getOppositeOffset(s[0])[s[0]];
               _addMargins();
            }
         }
         //Если перемещались и освободилось место, то возвращаемся обратно
         if (winSize > this._containerSizes[s[2]] + this._containerSizes.originOffset[s[0]] && isMoved) {
            offset[s[0]] = this._getOppositeOffset(s[0])[s[0]];
            isMoved = false;
         }
         //Запоминаем какое перемещение было сделано по горизонтали или по вертикали
         if (isHorizontal) {
            this._isMovedH = isMoved;
         } else {
            this._isMovedV = isMoved;
         }

         //Запоминаем текущий сдвиг
         this._containerSizes.offset[s[0]] = offset[s[0]];

         //Если сдвинулись за экран, расчитываем новые размеры и положение
         if (offset[s[0]] < 0) {
            this._calculateOverflow(offset, s);
         }

         this._container.css((isHorizontal) ? 'overflow-x' : 'overflow-y', 'auto');

         if (this._containerSizes[s[7]] < spaces[s[1]]) {
            this._container.css(s[2], s[9]);
            this._container.css((isHorizontal) ? 'overflow-x' : 'overflow-y', 'visible');
         }
         return offset;
      },

      //Рассчитать расстояния от таргета до границ экрана с учетом собственного положения попапа
      //Нужно для расчета размеров если не влезаем в экран
      _getSpaces: function () {
         var corner = this._defaultCorner,
            offset = this._targetSizes.offset,
            width = this._targetSizes.width,
            height = this._targetSizes.height,
            windowHeight = this._windowSizes.height,
            windowWidth = this._windowSizes.width,
            spaces = {
               top: 0,
               left: 0,
               bottom: 0,
               right: 0
            };

         switch (corner) {
         case 'br':
            spaces.left = offset.left + width;
            spaces.top = offset.top;
            break;
         case 'tr':
            spaces.left = offset.left + width;
            spaces.top = offset.top;
            break;
         case 'tl':
            spaces.left = offset.left;
            spaces.top = offset.top;
            break;
         case 'bl':
            spaces.left = offset.left;
            spaces.top = offset.top;
            break;
         default:
            return spaces;
         }

         if (corner == 'tl' || corner == 'tr') {
            spaces.bottom = windowHeight - spaces.top;
         } else {
            spaces.bottom = windowHeight - spaces.top - height;
         }

         if (corner == 'tr' || corner == 'br') {
            spaces.right = windowWidth - spaces.left;
         } else {
            spaces.right = windowWidth - spaces.left;
         }

         return spaces;
      },

      //Установить размер и положение если не влезли в экран
      _calculateOverflow: function (offset, s) {
         var spaces = this._getSpaces(),
            isVertical = (s[1] == 'bottom');
         if (spaces[s[1]] > spaces[s[0]]) {
            offset[s[0]] = (s[4]) ? this._targetSizes.offset[s[0]] + this._targetSizes[s[2]] + s[5] : this._targetSizes.offset[s[0]] + s[6];
            offset[s[0]] += (this._options[s[3]].offset || 0) + (isVertical) ? (this._margins.top - this._margins.bottom) : (this._margins.left - this._margins.right);
            s[10] = spaces[s[1]] - 2;
         } else {
            s[10] = spaces[s[0]] - this._containerSizes.border * 2;
            offset[s[0]] = 0 + (isVertical) ? ( -this._margins.top + this._margins.bottom) : ( -this._margins.left + this._margins.right);
         }
         this._container[s[2]](s[10]);
      },

      //Получаем противоположный угол относительно текущего в направлении orientation
      _getOppositeOffset: function (orientation) { // Получить offset при сдвиге в противоположный угол относительно this._defaultCorner по горизонтали или верткали 'top'/'left'
         var side = (orientation == 'left') ? this._options.horizontalAlign.side : this._options.verticalAlign.side,
            isVertical = (side == 'top' || side == 'bottom'),
            offset,
            position = {
               corner: this._options.corner,
               side: ''
            },
            opoSide;

         if (isVertical) {
            opoSide = (side == 'top') ? 'bottom' : 'top';
         } else {
            opoSide = (side == 'left') ? 'right' : 'left';
         }

         switch (this._options.corner) {
         case 'br':
            if (isVertical) {
               if (this._options.horizontalAlign.side == 'right') {
                  position.corner = 'tr';
               }
            } else {
               position.corner = 'bl';
            }
            position.side = opoSide;
            break;

         case 'tr':
            if (isVertical) {
               if (this._options.horizontalAlign.side == 'right') {
                  position.corner = 'br';
               }
            } else {
               position.corner = 'tl';
            }
            position.side = opoSide;
            break;

         case 'bl':
            if (isVertical) {
               if (this._options.horizontalAlign.side == 'left') {
                  position.corner = 'tl';
               }
            } else {
               position.corner = 'br';
            }
            position.side = opoSide;
            break;

         case 'tl':
            if (isVertical) {
               if (this._options.horizontalAlign.side == 'left') {
                  position.corner = 'bl';
               }
            } else {
               position.corner = 'tr';
            }
            position.side = opoSide;
         }

         if (isVertical) {
            this._options.verticalAlign.side = position.side;
         } else {
            this._options.horizontalAlign.side = position.side;
         }
         this._options.corner = position.corner;
         offset = this._getGeneralOffset(this._options.verticalAlign.side, this._options.horizontalAlign.side, position.corner);
         return offset;
      },

      after: {
         show: function () {
            this._initSizes(true);
            this.recalcPosition();
         },
         init: function(){
            ControlHierarchyManager.addNode(this, this.getParent());
         },
         hide: function(){
            var zIndex = this._container.css('zIndex');
            ControlHierarchyManager.zIndexManager.setFree(zIndex);
            // Убираем оверлей
            if (this._options.isModal) {
               var pos = Array.indexOf($ws.single.WindowManager._modalIndexes, zIndex);
               $ws.single.WindowManager._modalIndexes.splice(pos, 1);
               pos = Array.indexOf($ws.single.WindowManager._visibleIndexes, zIndex);
               $ws.single.WindowManager._visibleIndexes.splice(pos, 1);
               ModalOverlay.adjust();
            }
         }
      },

      before: {
         destroy: function () {
            ControlHierarchyManager.removeNode(this);
            $ws.single.EventBus.channel('WindowChangeChannel').unsubscribe('onWindowResize', this._resizeHandler, this);
            $ws.single.EventBus.channel('WindowChangeChannel').unsubscribe('onWindowScroll', this._scrollHandler, this);
            $ws.single.EventBus.channel('WindowChangeChannel').unsubscribe('onDocumentClick', this._clickHandler, this);
         },
         show: function () {
            this._container.css({
               left: '-1000px',
               top: '-1000px'
            });
            var zIndex = ControlHierarchyManager.zIndexManager.getNext();
            this._container.css('zIndex', zIndex);
            //Показываем оверлей
            if (this._options.isModal) {
               $ws.single.WindowManager._modalIndexes.push(zIndex);
               $ws.single.WindowManager._visibleIndexes.push(zIndex);
               ModalOverlay.adjust();
            }
         }
      },

      around: {
         hide: function (parentHide) {
            var
               self = this,
               result = this._notify('onClose');
            if (result instanceof $ws.proto.Deferred) {
               result.addCallback(function () {
                  parentHide.call(self);
               });
            } else if (result !== false) {
               parentHide.call(this);
            }
         }
      }
   };

   return _PopupMixin;

});