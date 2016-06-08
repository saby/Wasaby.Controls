/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('js!SBIS3.CONTROLS.PopupMixin', ['js!SBIS3.CONTROLS.ControlHierarchyManager', 'js!SBIS3.CORE.ModalOverlay'], function (ControlHierarchyManager, ModalOverlay) {
   'use strict';
   if (typeof window !== 'undefined') {
      var eventsChannel = $ws.single.EventBus.channel('WindowChangeChannel');

      $(document).bind('mousedown touchstart', function (e) {
         eventsChannel.notify('onDocumentClick', e.target);
      });

      $(document).bind('mouseover', function (e) {
         eventsChannel.notify('onDocumentMouseOver', e.target);
      });

      $(window).bind('scroll', function () {
         eventsChannel.notify('onWindowScroll');
      });
   }

   /**
    * Миксин, определяющий поведение контролов, которые отображаются с абсолютным позиционированием поверх всех остальных
    * компонентов (диалоговые окна, плавающие панели, подсказки).
    * При подмешивании этого миксина в контрол он вырезается из своего местоположения и вставляется в Body.
    * @mixin SBIS3.CONTROLS.PopupMixin
    * @author Крайнов Дмитрий Олегович
    * @public
    */
   var PopupMixin = /** @lends SBIS3.CONTROLS.PopupMixin.prototype */ {
      $protected: {
         _targetSizes: {},
         _containerSizes: {},
         _windowSizes: {},
         _isMovedH: undefined, // Был ли горизонтальный сдвиг при позиционировании
         _isMovedV: undefined, // Был ли вертикальный сдвиг при позиционировании
         _defaultCorner: '',
         _defaultHorizontalAlignSide: '',
         _defaultVerticalAlignSide: '',
         _margins: null,
         _marginsInited: false,
         _originsInited: false, // Обозначает, что были инициализированы размеры. _onResizeHandler срабатывает до show, и при этом еще нельзя получить правильные размеры -
                                // и соответсвенно провести правильные рассчеты, поэтому пропустим первое его срабатывание.
         _zIndex: null,
         _currentAlignment: {},
         _options: {
            visible: false,
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
             * @cfg {Boolean} закрывать или нет при уходе мышки с элемента
             */
            closeByExternalOver: false,
            /**
             * @cfg {Boolean} отображать кнопку закрытия
             */
            closeButton: false,
            /**
             * @cfg {Boolean} при клике мышки на таргет или перемещении по нему панель не закрывается
             */
            targetPart: false,
            /**
             * @cfg {Boolean} модальный или нет
             */
            isModal: false,
            //Ограничить размеры только высотой экрана, в противном случае они ограничены границами экрана и расположением тагрета
            fullHeight: false
         }
      },

      $constructor: function () {
         this._publish('onClose', 'onShow', 'onAlignmentChange', 'onChangeFixed');
         var self = this,
            container = this._container;
         container.css({
            'position': 'absolute',
            'top': '-10000px',
            'left': '-10000px'
         });

         //TODO: Придрот
         container.removeClass('ws-area');
         /********************************/

         this._initOppositeCorners();

         //Скрываем попап если при скролле таргет скрылся
         $ws.single.EventBus.channel('WindowChangeChannel').subscribe('onWindowScroll', this._onResizeHandler, this);

         if (this._options.closeByExternalOver) {
            $ws.single.EventBus.channel('WindowChangeChannel').subscribe('onDocumentMouseOver', this._clickHandler, this);
         }
         else if (this._options.closeByExternalClick) {
            $ws.single.EventBus.channel('WindowChangeChannel').subscribe('onDocumentClick', this._clickHandler, this);
         }

         if (this._options.closeButton) {
            container.append('<div class="controls-PopupMixin__closeButton icon-16 icon-size icon-ExpandUp icon-primary action-hover"></div>');
            $('.controls-PopupMixin__closeButton', this.getContainer().get(0)).click(function() {
               //Нужно вызвать активироваться перед hide, чтобы закрылись плав. панели, у которых опенером был этот контрол
               //TODO: унифицировать код закрытия с SBIS3.CORE.FloatArea: хранить коллекцию дочерних панелей, и закрывать их тут
               //(не делая активацию)
               self.setActive(true);
               self.hide();
            });
         }
         container.appendTo('body');
         this._defaultCorner = this._options.corner;
         this._defaultVerticalAlignSide = this._options.verticalAlign.side;
         this._defaultHorizontalAlignSide = this._options.horizontalAlign.side;

         this._resetToDefault();
      },

      //Подписка на изменение состояния таргета
      _subscribeTargetMove: function(){
         this._targetChanges = $ws.helpers.trackElement(this._options.target, true);
         //перемещаем вслед за таргетом
         this._targetChanges.subscribe('onMove', this._onTargetMove, this);
         //скрываем если таргет скрылся
         this._targetChanges.subscribe('onVisible', this._onTargetChangeVisibility, this);
      },

      _unsubscribeTargetMove: function(){
         if (this._targetChanges){
            this._targetChanges.unsubscribe('onMove', this._onTargetMove);
            this._targetChanges.unsubscribe('onVisible', this._onTargetChangeVisibility);
         }
      },

      _onTargetMove: function(){
         // Если fixed не надо двигаться за таргетом
         if (this.isVisible() && !this._fixed) {
            this.recalcPosition();
            this._checkTargetPosition();
         } else {
            this._initSizes();
         }
      },

      _onTargetChangeVisibility: function(event, visible){
         if (!visible){
           this.hide();
         }
      },

      _checkFixed: function(element){
         element = $(element);
         while (element.parent().length){
            if (element.css('position') == 'fixed'){
               $(this._container).css({position : 'fixed'});
               if (this._fixed){
                  this._notify('onChangeFixed', true);
               }
               this._fixed = true;
               return;
            } else {
               element = element.parent();
            }
         }
         this._notify('onChangeFixed', false);
         this._fixed = false;
         $(this._container).css({position : 'absolute'});
      },

      isFixed: function(){
         return this._fixed;
      },

      /**
       * Пересчитать положение и размеры
       * @param recalcFlag
       */
      recalcPosition: function (recalcFlag) {
         if (this._isVisible) {
            this._currentAlignment = {
               verticalAlign : this._options.verticalAlign,
               horizontalAlign : this._options.horizontalAlign,
               corner : this._options.corner
            };
            // Пересчитать оригинальные размеры, флаг true если размеры контейнера поменялись
            if (recalcFlag) {
               this._originsInited = true;
               this._container.css('height', '');
               this._container.css('width', '');
               var scrollWidth = this._container.get(0).scrollWidth,
                  scrollHeight = this._container.get(0).scrollHeight,
                  maxWidth = parseFloat(this._container.css('max-width'), 10) || scrollWidth,
                  maxHeight = parseFloat(this._container.css('max-height'), 10) || scrollHeight,
                  border = (this._container.outerWidth() - this._container.innerWidth());

               this._resetToDefault();

               this._containerSizes.originWidth = scrollWidth > maxWidth ? maxWidth : scrollWidth + border ;
               this._containerSizes.originHeight = scrollHeight > maxHeight ? maxHeight : scrollHeight + border;
            }
            if (this._fixed === undefined){
               this._checkFixed(this._options.target);
            }
            this._initSizes();
            if (!this._originsInited){
               return;
            }
            if (this._options.target) {
               var offset = {
                     top: this._fixed ? this._targetSizes.boundingClientRect.top : this._targetSizes.offset.top,
                     left: this._fixed ? this._targetSizes.boundingClientRect.left : this._targetSizes.offset.left
                  },
                  buff = this._getGeneralOffset(this._options.verticalAlign.side, this._options.horizontalAlign.side, this._options.corner);
               
               offset.top += (this._options.verticalAlign.offset || 0) + this._margins.top - this._margins.bottom;
               offset.left += (this._options.horizontalAlign.offset || 0) + this._margins.left - this._margins.right;

               offset = this._addOffset(offset, buff);
               offset = this._getOffsetByWindowSize(offset);

               offset.top = this._calculateOverflow(offset, 'vertical');
               offset.left = this._calculateOverflow(offset, 'horizontal');

               this._notifyOnAlignmentChange();

               this._container.css({
                  'top': offset.top + 'px',
                  'left': offset.left + 'px'
               });
            } else {
               var bodyOffset = this._bodyPositioning();
               this._container.offset(bodyOffset);
            }
         }
      },
      /**
       * Сброс параметров к исходным значениям
       * необходимо при принудительном пересчете размеров
       * и для рассчета непосредственно после отображения
       */
      _resetToDefault: function(){
         this._isMovedV = false;
         this._isMovedH = false;
         this._options.corner = this._defaultCorner;
         this._options.verticalAlign.side = this._defaultVerticalAlignSide;
         this._options.horizontalAlign.side = this._defaultHorizontalAlignSide;
      },

      /**
       * Установить новый таргет
       * @param target новый таргет
       */
      setTarget: function (target) {
         this._options.target = target;
         this._checkFixed(target);
         this._subscribeTargetMove();
         this.recalcPosition(true);
      },

      /**
       * Сделать текущий диалог / панель модальным, либо наоборот убрать модальность
       * @param {Boolean} isModal - флаг модальности
       */
      setModal: function (isModal) {
         if (this._options.isModal !== isModal){
            this._options.isModal = isModal;
            this._setModal(isModal);
         }
      },
      _setModal: function(isModal){
         if (isModal){
            ModalOverlay.adjust();
            var self = this;
            ModalOverlay._overlay.bind('mousedown', function(){
               if (self._options.closeByExternalClick && self.getId() == $ws.single.WindowManager.getMaxZWindow().getId()) {
                  ControlHierarchyManager.getTopWindow().hide();
               }
            });
         }
         else {
            $ws.single.WindowManager.releaseZIndex(this._zIndex);
            ModalOverlay.adjust();
         }
      },

      isModal: function(){
         return !!this._options.isModal;
      },

      moveToTop: function(){
         if (this.isVisible()) {
            $ws.single.WindowManager.releaseZIndex(this._zIndex);

            this._getZIndex();
            this._container.css('z-index', this._zIndex);

            ModalOverlay.adjust();
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

         //TODO избавиться от дублирования
         if (!vAlign) {
            offset.top = this._windowSizes.height / 2 + offset.top - this._containerSizes.height / 2;
         } else {
            if (vAlign == 'bottom') {
               offset.top = bodyHeight - offset.top - height;
            }
         }
         if (!hAlign) {
            offset.left = this._windowSizes.width / 2 + offset.left - this._containerSizes.width / 2;
         } else {
            if (hAlign == 'right') {
               offset.left = bodyWidth - offset.left - width;
            }
         }
         if (this._containerSizes.requiredOffset.top > bodyHeight) {
            offset.top = bodyHeight - this._containerSizes.originHeight;
         }
         if (this._containerSizes.requiredOffset.left > bodyWidth) {
            offset.left = bodyWidth - this._containerSizes.originWidth;
         }
         this._calculateBodyOverflow(offset);
         return offset;
      },

      _calculateBodyOverflow: function (offset) {
         if (offset.top < 0) {
            offset.top = 0;
            this._container.css('overflow-y', 'auto');
            this._container.height(this._windowSizes.height);
         } else {
            this._container.css({
               'overflow-y': 'visible',
               'height': ''
            });
         }
         if (offset.left < 0) {
            offset.left = 0;
            this._container.css('overflow-x', 'auto');
            this._container.width(this._windowSizes.width);
         } else {
            this._container.css({
               'overflow-x': 'visible',
               'width': ''
            });
         }
      },

      _clickHandler: function (eventObject, target) {
         if (this.isVisible()) {
            var self = this,
               inTarget;
            if (self._options.target && self._options.targetPart) {
               inTarget = !!((self._options.target.get(0) == target) || self._options.target.find($(target)).length);
            }
            if (!inTarget && !ControlHierarchyManager.checkInclusion(self, target)) {
               if ($(target).hasClass('ws-window-overlay')) {
                  if (parseInt($(target).css('z-index'), 10) < this._zIndex) {
                     self.hide();
                  }
               } else {
                  self.hide();
               }
            }
         }
      },

      _checkTargetPosition: function () {
         var self = this;
         //TODO: временно завязываемся на closeByExternalClick пока не придумается что то получше
         if (this._options.target && this._options.closeByExternalClick) {
            var winHeight = $(window).height(),
               top = this._options.target.offset().top - $(window).scrollTop() - winHeight;
            /*TODO временный фикс для решения проблемы на айпаде: открывается клавиаутра и при этом из за сдвига экрана пропадает панелька*/
            /*if (this.isVisible() && (top > 0 || -top > winHeight)) {
             self.hide();
             }*/
         }
      },

      //Кэшируем размеры
      _initSizes: function () {
         var target = this._options.target,
            container = this._container;
         if (target) {
            this._targetSizes = {
               width: target.outerWidth(),
               height: target.outerHeight(),
               offset: target.offset(),
               border: (target.outerWidth() - target.innerWidth()) / 2,
               boundingClientRect: target.get(0).getBoundingClientRect()
            };
            if (this._fixed) this._targetSizes.offset = this._targetSizes.boundingClientRect;
         }
         this._containerSizes.border = (container.outerWidth() - container.innerWidth()) / 2;
         var buff = this._getGeneralOffset(this._defaultVerticalAlignSide, this._defaultHorizontalAlignSide, this._defaultCorner, true);
         //Запоминаем координаты правого нижнего угла контейнера необходимые для отображения контейнера целиком и там где нужно.
         if (target) {
            this._containerSizes.requiredOffset = {
               top: buff.top + this._targetSizes.offset.top + this._containerSizes.originHeight + (this._options.verticalAlign.offset || 0) + this._margins.top - this._margins.bottom,
               left: buff.left + this._targetSizes.offset.left + this._containerSizes.originWidth + (this._options.horizontalAlign.offset || 0) + this._margins.left - this._margins.right
            };
         } else {
            this._containerSizes.requiredOffset = {
               top: this._options.verticalAlign.offset + this._containerSizes.originHeight,
               left: this._options.horizontalAlign.offset + this._containerSizes.originWidth
            };
         }
         this._containerSizes.width = this._containerSizes.originWidth;
         this._containerSizes.height = this._containerSizes.originHeight;
         this._containerSizes.boundingClientRect = container.get(0).getBoundingClientRect();
         this._initWindowSizes();
      },

      _initWindowSizes: function () {
         this._windowSizes = {
            height: $(window).height(),
            width: $(window).width()
         };
      },

      _initMargins: function () {
         if (!this._marginsInited) {
            this._marginsInited = true;
            var container = this._container;
            this._margins = {
               top: parseInt(container.css('margin-top'), 10) || 0,
               left: parseInt(container.css('margin-left'), 10) || 0,
               bottom: parseInt(container.css('margin-bottom'), 10) || 0,
               right: parseInt(container.css('margin-right'), 10) || 0
            };
            this._container.css('margin', 0);
         }
      },

      //Вычисляем сдвиг в зависимости от угла
      _getOffsetByCorner: function (corner, notSave) {
         var height = this._targetSizes.height,
            width = this._targetSizes.width,
            offset = {
               top: 0,
               left: 0
            };

         switch (corner) {
            case 'tr':
               offset.left += width;
               break;
            case 'bl':
               offset.top += height;
               break;
            case 'br':
               offset.top += height;
               offset.left += width;
               break;
         }
         if (this._options.target && !this._options.corner) {
            throw new Error('PopupMixin: Параметр corner является обязательным');
         }
         if (!notSave) {
            this._options.corner = corner;
         }
         return offset;
      },

      _getOffsetBySide: function (vert, horiz, notSave) {
         var offset = {
            top: 0,
            left: 0
         };
         if (vert == 'bottom') {
            offset.top -= this._containerSizes.originHeight;
         }
         if (horiz == 'right') {
            offset.left -= this._containerSizes.originWidth;
         }
         if (!notSave) {
            this._options.horizontalAlign.side = horiz;
            this._options.verticalAlign.side = vert;
         }
         return offset;
      },

      _getGeneralOffset: function (vert, horiz, corner, notSave) {
         var offset = this._getOffsetByCorner(corner, notSave),
            buff = this._getOffsetBySide(vert, horiz, notSave);
         offset = this._addOffset(offset, buff);
         return offset;
      },

      // Получить offset при сдвиге в противоположный угол относительно corner по горизонтали или верткали 'horizontal'/'vertical'
      _getOppositeOffset: function (corner, orientation) {
         var side = (orientation == 'vertical') ? this._options.horizontalAlign.side : this._options.verticalAlign.side,
            offset,
            oppositeSide, oppositeCorner;

         oppositeCorner = this._getOppositeCorner(corner, side, orientation);
         if (orientation == 'vertical') {
            oppositeSide = (this._options.verticalAlign.side == 'top') ? 'bottom' : 'top';
            offset = this._getGeneralOffset(oppositeSide, this._options.horizontalAlign.side, oppositeCorner);
         } else {
            oppositeSide = (this._options.horizontalAlign.side == 'left') ? 'right' : 'left';
            offset = this._getGeneralOffset(this._options.verticalAlign.side, oppositeSide, oppositeCorner);
         }

         offset.top -= (this._options.verticalAlign.offset || 0) + this._margins.top - this._margins.bottom;
         offset.left -= (this._options.horizontalAlign.offset || 0) + this._margins.left - this._margins.right;

         return offset;
      },

      _initOppositeCorners: function () {
         this._oppositeCorners = {
            br: {
               horizontal: {
                  top: 'bl',
                  bottom: 'bl'
               },
               vertical: {
                  left: 'tr',
                  right: 'tr'
               }
            },
            tr: {
               horizontal: {
                  top: 'tl',
                  bottom: 'tr'
               },
               vertical: {
                  left: 'br',
                  right: 'br'
               }
            },
            bl: {
               horizontal: {
                  top: 'br',
                  bottom: 'br'
               },
               vertical: {
                  left: 'tl',
                  right: 'bl'
               }
            },
            tl: {
               horizontal: {
                  top: 'tr',
                  bottom: 'tr'
               },
               vertical: {
                  left: 'bl',
                  right: 'tr'
               }
            }
         };
      },

      _getOppositeCorner: function (corner, side, orientation) {
         this._options.corner = this._oppositeCorners[corner][orientation][side];
         return this._options.corner;
      },

      _getOffsetByWindowSize: function (offset) {
         var buf = this._targetSizes.offset,
            scrollY = this._fixed ? 0 : $(window).scrollTop(),
            scrollX = this._fixed ? 0 : $(window).scrollLeft();
         //Проверяем убираемся ли в экран снизу. Если позиционируем нижней стороной, не нужно менять положение если не влезаем снизу
         if (this._containerSizes.requiredOffset.top > this._windowSizes.height + scrollY && !this._isMovedV && this._options.verticalAlign.side !== 'bottom') {
            this._isMovedV = true;
            offset.top = this._getOppositeOffset(this._options.corner, 'vertical').top;
            offset.top = this._addOffset(offset, buf).top;
         }

         //Возможно уже меняли положение и теперь хватает места что бы вернуться на нужную позицию по вертикали
         if (this._containerSizes.requiredOffset.top < this._windowSizes.height + scrollY && this._isMovedV) {
            this._isMovedV = false;
            offset.top = this._getOppositeOffset(this._options.corner, 'vertical').top;
            offset.top = this._addOffset(offset, buf).top;
         }

         //TODO Избавиться от дублирования
         //Проверяем убираемся ли в экран справа. Если позиционируем правой стороной, не нужно менять положение если не влезаем справа
         if (this._containerSizes.requiredOffset.left > this._windowSizes.width + scrollX && !this._isMovedH && this._options.horizontalAlign.side !== 'right') {
            this._isMovedH = true;
            offset.left = this._getOppositeOffset(this._options.corner, 'horizontal').left;
            offset.left = this._addOffset(offset, buf).left;
         }

         //Возможно уже меняли положение и теперь хватает места что бы вернуться на нужную позицию по горизонтали
         if (this._containerSizes.requiredOffset.left < this._windowSizes.width + scrollX && this._isMovedH) {
            this._isMovedH = false;
            offset.left = this._getOppositeOffset(this._options.corner, 'horizontal').left;
            offset.left = this._addOffset(offset, buf).left;
         }
         return offset;
      },

      _calculateOverflow: function (offset, orientation) {
         //TODO Избавиться от дублирования
         var vOffset = this._options.verticalAlign.offset || 0,
            hOffset = this._options.verticalAlign.offset || 0,
            scrollHeight = this._container.get(0).scrollHeight,
            spaces, oppositeOffset;
         spaces = this._getSpaces(this._options.corner);
         if (orientation == 'vertical') {
            if (offset.top < 0 && this._options.verticalAlign.side !== 'top') {
               this._overflowedV = true;
               this._container.css('overflow-y', 'auto');
               if (spaces.top < spaces.bottom) {
                  if (this._options.fullHeight){
                     var height = this._container.get(0).scrollHeight > this._windowSizes.height ? this._windowSizes.height : '';
                     this._container.css('height', height);
                     offset.top = this._windowSizes.height - this._container.get(0).scrollHeight - this._containerSizes.border * 2;
                  } else {
                     oppositeOffset = this._getOppositeOffset(this._options.corner, orientation);
                     spaces = this._getSpaces(this._options.corner);
                     this._container.css('height', spaces.bottom - vOffset - this._margins.top + this._margins.bottom);
                     offset.top = this._targetSizes.offset.top + oppositeOffset.top;
                     this._isMovedV = !this._isMovedV;
                  }
               } else {
                  offset.top = 0;
                  //Если места снизу меньше чем сверху покажемся во весь размер (возможно поверх таргета), или в высоту окна если в него не влезаем
                  var height = this._container.get(0).scrollHeight > this._windowSizes.height ? this._windowSizes.height : '';
                  this._container.css('height', height);
               }
            }
            if (this._containerSizes.originHeight + vOffset + this._margins.top - this._margins.bottom < spaces.bottom && this._overflowedV) {
               this._container.css('overflow-y', 'visible');
               this._container.css('height', '');
               this._overflowedV = false;
            }
            return offset.top;
         }
         else {
            if (offset.left < 0 && this._options.horizontalAlign.side !== 'left') {
               this._overflowedH = true;
               this._container.css('overflow-x', 'auto');
               spaces = this._getSpaces(this._options.corner);
               if (spaces.left < spaces.right) {
                  oppositeOffset = this._getOppositeOffset(this._options.corner, orientation);
                  spaces = this._getSpaces(this._options.corner);
                  this._container.css('width', spaces.right - hOffset - this._margins.left + this._margins.right);
                  offset.left = this._targetSizes.offset.left + oppositeOffset.left;
                  this._isMovedH = !this._isMovedH;
               } else {
                  offset.left = 0;
                  this._container.css('width', spaces.left - hOffset - this._margins.left + this._margins.right);
               }
            }
            if (this._containerSizes.originWidth + hOffset + this._margins.left - this._margins.right < spaces.right && this._overflowedH) {
               this._container.css('overflow-x', 'visible');
               this._container.css('width', '');
               this._overflowedH = false;
            }
            return offset.left;
         }
      },

      //Рассчитать расстояния от таргета до границ экрана с учетом собственного положения попапа
      //Нужно для расчета размеров если не влезаем в экран
      //TODO: Можно придумать алгоритм получше
      _getSpaces: function (corner) {
         var offset = this._targetSizes.offset,
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

         switch (corner) {
            case 'br':
               spaces.left = offset.left + width;
               spaces.top = offset.top + height;
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
               spaces.top = offset.top + height;
               break;
            default:
               return spaces;
         }

         spaces.bottom = windowHeight - spaces.top;
         spaces.right = windowWidth - spaces.left;

         return spaces;
      },

      close: function(){
         this.hide();
         this.destroy();
      },

      _addOffset: function (offset1, offset2) {
         var offset = {
            top: 0,
            left: 0
         };
         offset.top = offset1.top + offset2.top;
         offset.left = offset1.left + offset2.left;
         return offset;
      },

      //TODO Передалать на зависимость только от опций
      _notifyOnAlignmentChange: function () {
         var isVerAlignChanged = this._defaultVerticalAlignSide != this._currentAlignment.verticalAlign.side,
             isHorAlignChanged = this._defaultHorizontalAlignSide != this._currentAlignment.horizontalAlign.side,
             newAlignment;

         if (isVerAlignChanged || isHorAlignChanged || this._options.corner != this._currentAlignment.corner) {
            newAlignment = {
               verticalAlign: this._options.verticalAlign,
               horizontalAlign: this._options.horizontalAlign,
               corner: this._options.corner
            };
            this._container.toggleClass('controls-popup-revert-horizontal', isHorAlignChanged)
                           .toggleClass('controls-popup-revert-vertical', isVerAlignChanged);
            this._notify('onAlignmentChange', newAlignment);
         }
      },

      _getZIndex: function(){
         this._zIndex = $ws.single.WindowManager.acquireZIndex(this._options.isModal, false, true);
         $ws.single.WindowManager.setVisible(this._zIndex);
      },

      after: {
         init: function () {
            ControlHierarchyManager.addNode(this, this.getParent());
            this._initMargins();
         },

         show: function () {
            this._initMargins();
            this.recalcPosition(true);
            this.moveToTop();//пересчитываем, чтобы z-index был выше других панелей

            this._notify('onShow');
         },

         hide: function () {
            // Убираем оверлей
            this._unsubscribeTargetMove();
            if (this._options.isModal) {
               this._setModal(false);
            }
         },

         _onResizeHandler: function(){
            this._checkFixed(this._options.target || $('body'));
            if (this.isVisible() && !this._fixed) {
               this.recalcPosition(false);
            } else {
               this._initSizes();
            }
            this._checkTargetPosition();
         }
      },

      before: {
         show: function () {
            this._container.css({
               left: '-10000px',
               top: '-10000px'
            });
            this._subscribeTargetMove();
            ControlHierarchyManager.setTopWindow(this);
            //Показываем оверлей
            if (!this._zIndex) {
               this._getZIndex();
            }
            if (this._options.isModal) {
               this._setModal(true);
            }
         },
         destroy: function () {
            //ControlHierarchyManager.zIndexManager.setFree(this._zIndex);
            $ws.helpers.trackElement(this._options.target, false);
            $ws.single.WindowManager.setHidden(this._zIndex);
            if (this.isVisible()){
               $ws.single.WindowManager.releaseZIndex(this._zIndex);
               ControlHierarchyManager.removeNode(this);
            }
            this._unsubscribeTargetMove();
            if (this._options.closeByExternalOver) {
               $ws.single.EventBus.channel('WindowChangeChannel').unsubscribe('onDocumentMouseOver', this._clickHandler, this);
            }
            else if (this._options.closeByExternalClick) {
               $ws.single.EventBus.channel('WindowChangeChannel').unsubscribe('onDocumentClick', this._clickHandler, this);
            }
         }
      },

      around: {
         hide: function (parentHide) {
            /* Если кто-то позвал hide, а контрол уже скрыт, то не будет запускать цепочку кода,
               могут валиться ошибки */
            if(!this.isVisible()) return;

            var self = this,
                result = this._notify('onClose');
            if (result instanceof $ws.proto.Deferred) {
               result.addCallback(function (res) {
                  if (res !== false) {
                     parentHide.call(self);
                     $ws.single.WindowManager.setHidden(this._zIndex);
                     $ws.single.WindowManager.releaseZIndex(this._zIndex);
                  }
               });
            } else if (result !== false) {
               parentHide.call(this);
               $ws.single.WindowManager.setHidden(this._zIndex);
               $ws.single.WindowManager.releaseZIndex(this._zIndex);
            }
         }
      }

   };

   return PopupMixin;

});