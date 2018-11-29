/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('SBIS3.CONTROLS/Mixins/PopupMixin', [
   "Core/WindowManager",
   "Core/EventBus",
   "Core/Deferred",
   "SBIS3.CONTROLS/ControlHierarchyManager",
   "Lib/Control/ModalOverlay/ModalOverlay",
   "SBIS3.CONTROLS/Utils/TouchKeyboardHelper",
   'Core/core-instance',
   'Core/helpers/Hcontrol/doAutofocus',
   'Core/helpers/Hcontrol/trackElement',
   "Core/detection",
   'Core/helpers/isNewEnvironment',
   "Core/constants",
   'css!SBIS3.CONTROLS/Mixins/PopupMixin/PopupMixin'
], function ( cWindowManager, EventBus, Deferred,ControlHierarchyManager, ModalOverlay, TouchKeyboardHelper, cInstance, doAutofocus, trackElement, detection, isNewEnvironment, constants) {
   'use strict';
   if (typeof window !== 'undefined') {
      var
         eventsChannel = EventBus.channel('WindowChangeChannel'),
         clickCallback = function (e) {
            eventsChannel.notify('onDocumentClick', e);
         },
         dragCallback = function(e) {
            if (e.dataTransfer.types.includes('Files')) {
               eventsChannel.notify('onDocumentDrag', e);
            }

         };
      // Отлавливаем mousedown + touchstart в захватывающей фазе, т.к. всплытие до document может быть остановлено
      // через stopPropagation (https://inside.tensor.ru/opendoc.html?guid=b935c090-ccf6-4a9e-a205-5fc9c96a7c04)
      document.addEventListener('mousedown', clickCallback, true);
      document.addEventListener('touchstart', clickCallback, true);
      document.addEventListener('dragover', dragCallback, true);

      $(window).blur(function(e) {
         if(document.activeElement && document.activeElement.tagName == "IFRAME"){
            if(! $(document.activeElement).hasClass('ws-popup-mixin-ignore-iframe')){
               eventsChannel.notify('onDocumentClick', e);
            }
         }
      });

      $(document).bind('mouseover', function (e) {
         eventsChannel.notify('onDocumentMouseOver', e);
      });

      $(window).bind('scroll', function () {
         eventsChannel.notify('onWindowScroll');
      });
   }

   // на vdom динамически меняется zindex попапов.
   // По заданному интервалу синхронизируем zindex popupMixin и vdomPopup
   var VDOM_POPUP_RECAL_ZINDEX_INTERVAL = 1000;

   /**
    * Миксин, определяющий поведение контролов, которые отображаются с абсолютным позиционированием поверх всех остальных компонентов (диалоговые окна, плавающие панели, подсказки).
    * При подмешивании этого миксина в контрол он вырезается из своего местоположения и вставляется в Body.
    * @mixin SBIS3.CONTROLS/Mixins/PopupMixin
    * @author Крайнов Д.О.
    * @public
    */
   var PopupMixin = /** @lends SBIS3.CONTROLS/Mixins/PopupMixin.prototype */ {
       /**
        * @event onShow Происходит при открытии окна.
        * @param {Core/EventObject} eventObject Дескриптор события.
        */
       /**
        * @event onClose Происходит при закрытии окна.
        * @param {Core/EventObject} eventObject Дескриптор события.
        */
       /**
        * @event onAlignmentChange Происходит при изменении вертикального {@link verticalAlign} или горизонтального {@link horizontalAlign} выравнивания.
        * @param {Core/EventObject} eventObject Дескриптор события.
        * @param {Object} newAlignment Объект с конфигурацией выравнивания.
        * @param {Object} [newAlignment.verticalAlign] Вертикальное выравнивание.
        * @param {Object} [newAlignment.horizontalAlign] Горизонтальное выравнивание.
        * @param {Object} [newAlignment.corner] Точка построения окна.
        */
       /**
        * @event onChangeFixed Происходит при изменении способа позиционирования окна браузера или других объектов на веб-странице.
        * @param {Core/EventObject} eventObject Дескриптор события.
        * @param {Boolean} fixed В значении true - CSS-свойство position=fixed, иначе position=absolute.
        */
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
         _parentFloatArea: null,
          _keysWeHandle: [
             constants.key.tab,
             constants.key.enter,
             constants.key.esc
          ],
         _options: {
            visible: false,
            /**
             * @typedef {Object} CornerEnum
             * @variant tl Верхний левый угол.
             * @variant tr Верхний правый угол.
             * @variant br Нижний правый угол.
             * @variant bl Нижний левый угол.
             */
            /**
             * @cfg {CornerEnum} Устанавливает точку построения всплывающего окна (угол контрола, относительно которого происходит построение окна).
             */
            corner: null,
            /**
             * @typedef {Object} VerticalAlignEnum
             * @variant top Всплывающее окно отображается сверху относительно точки построения.
             * @variant bottom Всплывающее окно отображается снизу относительно точки построения.
             */
            /**
             * @typedef {Object} VerticalAlign
             * @property {VerticalAlignEnum} side Тип вертикального выравнивания всплывающего окна.
             * @property {Number} offset Устанавливает отступ по вертикали в пикселях относительно точки построения всплывающего окна.
             */
            /**
             * @cfg {VerticalAlign} Устанавливает вертикальное выравнивание всплывающего окна относительно точки его построения.
             * @default {}
             * @remark опция обязательна для конфигурации
             */
            verticalAlign: {},
            /**
             * @typedef {Object} HorizontalAlignEnum
             * @variant right Всплывающее окно отображается справа относительно точки построения.
             * @variant left Всплывающее окно отображается слева относительно точки построения.
             */
            /**
             * @typedef {Object} HorizontalAlign
             * @property {HorizontalAlignEnum} side Тип горизонтального выравнивания всплывающего окна.
             * @property {Number} offset Устанавливает отступ по горизонтали в пикселях относительно точки построения всплывающего окна.
             */
            /**
             * @cfg {HorizontalAlign} Устанавливает горизонтальное выравнивание всплывающего окна относительно точки его построения.
             * @default {}
             * @remark опция обязательна для конфигурации
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
             * @cfg {Boolean} закрывать или нет при изменении положения элемента, к которому крепится popup
             */
            closeOnTargetMove: false,
            /**
             * @cfg {Boolean} отображать кнопку закрытия
             */
            closeButton: false,
            /**
             * @variant standart
             * @variant light
             */
            crossStyle : 'standart',
            /**
             * @cfg {Boolean} при клике мышки на таргет или перемещении по нему панель не закрывается
             */
            targetPart: false,
            /**
             * @cfg {Boolean} модальный или нет
             */
            isModal: false,
            /**
             * Разрешить всплывающему окну перекрывать target
             * Например нужно для меню, которое может перекрывать target без потери функцианальности,
             * но не подходит для поля связи, так как может перекрывать вводимый текст
             * @type {Boolean}
             */
            targetOverlay: false,
            /**
             * @cfg {Boolean} переводить ли активность на панель после открытия
             */
            activateAfterShow: false,
            /**
             * Способ подстраивания всплывающей панели под свободное рядом с таргетом пространство
             * @typedef {Object} loacationStrategyEnum
             * @variant dontMove всплывающая панель не двигается относительно таргета
             * @variant bodyBounds контейнер всплывающей панели ограничивается краем экрана, если не влезает в экран
             */
            locationStrategy: null,
            /**
             * Может ли popup выходить за пределы body слева и сверху т.е иметь отрицательные координаты
             * TODO: это поведение вероятнее всего должно быть по умолчанию
             * https://inside.tensor.ru/opendoc.html?guid=75ee0e7b-4b6d-4335-964d-6c93b40a0adc&des=
             * Задача в разработку 15.12.2016
             * Избавиться от опции bodyBounds в PopupMixin, добавленной по надзадаче. Вероятнее всего это п...
             * @type {Boolean}
             */
            bodyBounds: false,
            
            /**
             * @cfg {Boolean} Пересчитывать положение попапа при отображении клавиатуры на мобильных устройствах
             */
            recalculateOnKeyboardShow: true,
            isHint: true,
            parentContainer: '',
            /*
            эта опция нужна для того, чтобы понять, надо ли отключать плавный скролл на мобильных устройствах на остальных панелях
            */
            _canScroll: false,
            /* Опция необходима, чтобы на мобильных устройствах была возможность отключить resize попапа при скроле страницы.
               Не все попапы должны менять свое положение при скроле, т.к. скролить можно быстро и они будут скакать. */
            _resizeOnScroll: true,
            _checkZIndexVDOM: true, //для тех, кто сам устанавливает zindex в попапе в обход его логики, проверка zindex'a со стороны попапа не нужны
            _fixJqueryPositionBug: false, //https://online.sbis.ru/opendoc.html?guid=e99ac72c-93d7-493f-a23e-ad09d45e908b
            _fixPopupRevertCorner: false //Логика поиска противоположного угла для меню. Скорее всего такая логика должна быть по умолчанию
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


         this._initOppositeCorners();

         if (this._options._resizeOnScroll) {
            //Скрываем попап если при скролле таргет скрылся
            EventBus.channel('WindowChangeChannel').subscribe('onWindowScroll', this._onResizeHandler, this);
         }

         //Скрываем попап при драг'н'дропе
         EventBus.channel('WindowChangeChannel').subscribe('onDocumentDrag', this._dragHandler, this);

         if (this._options.closeByExternalOver) {
            EventBus.channel('WindowChangeChannel').subscribe('onDocumentMouseOver', this._clickHandler, this);
         }
         else if (this._options.closeByExternalClick) {
            EventBus.channel('WindowChangeChannel').subscribe('onDocumentClick', this._clickHandler, this);
         }

         this._touchKeyboardMoveHandler = this._touchKeyboardMoveHandler.bind(this);
         this._overlayClick = this._overlayClick.bind(this);

         EventBus.globalChannel().subscribe('MobileInputFocus', this._touchKeyboardMoveHandler);

         if (this._options.closeButton) {
            container.append('<div class="controls-PopupMixin__closeButton controls-PopupMixin__closeButton_' + this._options.crossStyle + '"></div>');
            $('.controls-PopupMixin__closeButton', this.getContainer().get(0)).click(function() {
               //Нужно вызвать активироваться перед hide, чтобы закрылись плав. панели, у которых опенером был этот контрол
               //TODO: унифицировать код закрытия с Lib/Control/FloatArea/FloatArea: хранить коллекцию дочерних панелей, и закрывать их тут
               //(не делая активацию)
               self.setActive(true);
               self.hide();
            });
         }
         if (this._findParentContainer()) {
            container.appendTo(this._getParentContainer());
         }
         else {
            container.appendTo('body');
         }

         if (isNewEnvironment() && this._options._checkZIndexVDOM) {
            this._vdomZindexInterval = setInterval(function() {
               if (self.isVisible()) {
                  // на vdom динамически меняется zindex попапов.
                  // Держим актуальный zindex и для popupMixin'a, который располагается в попапах
                  var oldZIndex = self._zIndex;
                  if (oldZIndex !== self._getZIndex()) {
                     // Говорим core.WM что такого zindex больше нет
                     cWindowManager.releaseZIndex(oldZIndex);
                     self._container.css('z-index', self._zIndex);
                     if (self.isModal()) {
                        ModalOverlay.adjust(self._zIndex);
                     }
                  }
               }
            }, VDOM_POPUP_RECAL_ZINDEX_INTERVAL);
         }

         this._saveDefault();
         this._resetToDefault();

         var topParent = this.getTopParent();
         if (topParent && cInstance.instanceOfModule(topParent, 'Lib/Control/FloatArea/FloatArea')){
            // на iPad при появлении всплывахи над FloatArea при проведении пальцем над всплывахой - скроллится FloatArea (бажное поведение iPad с инетным скроллом)
            // приходится отключать инертный скролл в момент показа всплывахи и включать обратно при скрытии
            this._parentFloatArea = topParent;
         }
      },

      _findParentContainer: function() {
          //todo: https://online.sbis.ru/opendoc.html?guid=7074fd5d-268f-4939-8f68-95e7f262f90d
          //Временное решение, до момента когда компоненты начнут поддерживать опцию theme
          if (!this._options.parentContainer) {
              var
                  linkedContainer = this._options.target ?
                      this._options.target :
                      this._options.opener && this._options.opener._container ?
                          this._options.opener._container: false,
                  parent = linkedContainer ? $(linkedContainer).closest('.popup-container') : false;
              if (parent.length) {
                  this._options.parentContainer = parent;
              }
          }
          return this._options.parentContainer;
      },
   
      _touchKeyboardMoveHandler: function() {
         if (this._options.recalculateOnKeyboardShow) {
            this.recalcPosition();
         }
      },

      //Подписка на изменение состояния таргета
      _subscribeTargetMove: function(){
         if (this._options.target) {
            this._targetChanges = trackElement(this._options.target, true);
            //перемещаем вслед за таргетом
            this._targetChanges.subscribe('onMove', this._onTargetMove, this);
            //скрываем если таргет скрылся
            this._targetChanges.subscribe('onVisible', this._onTargetChangeVisibility, this);
         }
      },

      _unsubscribeTargetMove: function(){
         if (this._targetChanges){
            this._targetChanges.unsubscribe('onMove', this._onTargetMove);
            this._targetChanges.unsubscribe('onVisible', this._onTargetChangeVisibility);
         }
      },

      _onTargetMove: function (event, state, isInitial) {
         if (this.isVisible()) {
            if(this._options.closeOnTargetMove && !isInitial && !TouchKeyboardHelper.getKeyboardAnimation()) {
               this.hide();
            } else {
               if (this.isFixed()) {
                  this._initSizes();
               }
               else if (!isInitial) {
                  this.recalcPosition();
                  this._checkTargetPosition();
               }
            }
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
            if (this._options.parentContainer && this._getParentContainer()[0] !== element[0]) {
               break;
            }
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

      _saveDefault: function() {
         this._defaultCorner = this._options.corner;
         this._defaultVerticalAlignSide = this._options.verticalAlign.side;
         this._defaultHorizontalAlignSide = this._options.horizontalAlign.side;
      },

      _getParentContainer: function() {
         var parCont = this._getOption('parentContainer');

         if(parCont instanceof jQuery) {
            return parCont;
         } else if (this._getOption('target')) {
            return this._getOption('target').closest('.' + parCont);
         } else {
            return $('.' + parCont);
         }
      },

      isFixed: function(){
         return this._fixed;
      },

      /**
       * Пересчитать положение и размеры
       * @param recalcFlag
       */
      recalcPosition: function (recalcFlag, saveSide) {
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
                  border = this._container.outerWidth() - this._container.innerWidth();

               if (!saveSide) {
                  this._resetToDefault();
               } else {
                  this._isMovedV = false;
               }

               this._containerSizes.originWidth = scrollWidth > maxWidth ? maxWidth : scrollWidth + border ;
               this._containerSizes.originHeight = scrollHeight > maxHeight ? maxHeight : scrollHeight + border;

               if (this._container.css('box-sizing') !== 'border-box') {
                  // this._containerSizes.originWidth -= border ; Чтобы правильно работало, нужно учесть направление позции справа->налево, т.к. в этом случае нужно учитывать ширину границы
                  this._containerSizes.originHeight -= border;
               }

            }
            if (this._fixed === undefined){
               this._checkFixed(this._options.target);
            }
            this._initSizes(saveSide);
            if (!this._originsInited){
               return;
            }
            if (this._options.target) {
               this._fixPopupCorner();
               var offset = {
                     top: this._targetSizes.offset.top,
                     left: this._targetSizes.offset.left
                  },
                  buff = this._getGeneralOffset(this._options.verticalAlign.side, this._options.horizontalAlign.side, this._options.corner);

               // Добавим пользовательский сдвиг с учетом того, разворачивались уже или нет
               offset.top = offset.top + this._getUserOffset('vertical');
               offset.left = offset.left + this._getUserOffset('horizontal');

               offset = this._addOffset(offset, buff);
               offset = this._getOffsetByWindowSize(offset);

               offset.top = this._calculateOverflow(offset, 'vertical');
               offset.left = this._calculateOverflow(offset, 'horizontal');

               this._calcScrollOffset(offset);
               this._notifyOnAlignmentChange();

               this._container.css({
                  'top': offset.top + 'px',
                  'left': offset.left + 'px'
               });
            } else {
               if (!this._fixed){
                  var bodyOffset = this._bodyPositioning();
                  this._container.offset(bodyOffset);
               }
            }

            //Если изменились размеры, то сообщим детям. актуально для ScrollContainer
            if (recalcFlag) {
               this._resizeChilds();
            }
         }
      },
      _fixPopupCorner: function() {
         //На ios в горизонтальной ориентации маленькая высота экрана.
         //В ситуации, когда попап не влезает по ширине и по высоте происходит двойной разворот углов, который в итоге отрабаывает
         //некорректно. правлю вручную
         if (this._options._fixPopupRevertCorner && detection.isMobileIOS) {
            if (this._options.corner === 'tr') {
               this._options.horizontalAlign.side = 'left';
            }
         }
      },
      _calcScrollOffset: function(offset) {
         var hasStyleWidth = !!this._container[0].style.width; //Если мы уже задали width, то ширинка контейнера известна и позиционирование произведено с учетом скролла
         var isMaxWidth = window.getComputedStyle(this._container[0]).maxWidth === this._container[0].offsetWidth + 'px'; //Если достигнута макс.ширина, то скролл в нее входит
         if (!hasStyleWidth && !isMaxWidth && this._options.horizontalAlign.side === 'right') {
            var containerScrollWidth = this._container[0].offsetWidth - this._container[0].clientWidth - this._containerSizes.border * 2;
            //Если позиционирование слева от таргета, то смещаемся на ширину скролла
            if (containerScrollWidth) {
               offset.left -= containerScrollWidth;
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
       * Получить текущий  таргет
       */
      getTarget: function() {
         return this._options.target
      },

      /**
       * Устанавливает вертикальное выравнивание всплывающего окна относительно точки его построения.
       * @param align
       */
      setVerticalAlign: function(align) {
         this._options.verticalAlign = align;
         this._saveDefault();
         if(this.isVisible()) {
            this.recalcPosition(true);
         }
      },

      /**
       * Устанавливает горизонтальное выравнивание всплывающего окна относительно точки его построения.
       * @param align
       */
      setHorizontalAlign: function(align) {
         this._options.horizontalAlign = align;
         this._saveDefault();
         if(this.isVisible()) {
            this.recalcPosition(true);
         }
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
         var overlayContainer = ModalOverlay._overlay;

         if (isModal){
            ModalOverlay.adjust();
            overlayContainer && overlayContainer.bind('mousedown', this._overlayClick);
         }
         else {
            cWindowManager.releaseZIndex(this._zIndex);
            ModalOverlay.adjust();
            overlayContainer && overlayContainer.unbind('mousedown', this._overlayClick);
         }
      },

      isModal: function(){
         return !!this._options.isModal;
      },

      _overlayClick: function() {
         if (this._options.closeByExternalClick && this.getId() == cWindowManager.getMaxZWindow().getId()) {
            ControlHierarchyManager.getTopWindow().hide();
         }
      },

      moveToTop: function(){
         if (this.isVisible()) {
            cWindowManager.releaseZIndex(this._zIndex);
            this._container.css('z-index', this._getZIndex());
            ModalOverlay.adjust(this.isModal() ? this._zIndex : null);
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
            this._setOverflowY(this._windowSizes.height);
         } else {
            this._resetOverflowY();
         }
         if (offset.left < 0) {
            offset.left = 0;
            this._setOverflowX(this._windowSizes.width);
         } else {
            this._resetOverflowX();
         }
      },

      _setOverflowY: function(value) {
         //Баг в firefox при overflow-y: auto - если высота контента больше высоты основного контейнера, то добавляется скролл
         //Но от не расширяет контейнер на свою ширину, а ужимает текущий контейнер. При overflow-y: scroll такого нет, для ff юзаю его
         //т.к. значение auto вешается только в том случае, если скролл нужно показать
         this.getContainer().css('overflow-y', detection.firefox ? 'scroll' : 'auto');
         this.getContainer().height(value);
      },

      _resetOverflowY: function() {
         this.getContainer().css({
            'overflow-y': 'visible',
            'height': ''
         });
      },

      _setOverflowX: function(value) {
         this.getContainer().css('overflow-x', 'auto');
         this.getContainer().width(value);
      },

      _resetOverflowX: function() {
         this.getContainer().css({
            'overflow-x': 'visible',
            'width': ''
         });
      },

      _clickHandler: function (eventObject, event) {
         if (this.isVisible()) {
            var self = this,
               target = event.target,
               inTarget;
            if (self._options.target && self._options.targetPart) {
               inTarget = !!((self._options.target.get(0) == target) || self._options.target.find($(target)).length);
            }
            if (!inTarget && !ControlHierarchyManager.checkInclusion(self, target) && !this._isLinkedPanel(target)) {
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

      _dragHandler: function() {
         this.hide();
      },

      //Если клик был по другой всплывашке, определяем, нужно ли закрывать текущий popup
      _isLinkedPanel: function (target) {
         //По ошибке https://inside.tensor.ru/opendoc.html?guid=b935c090-ccf6-4a9e-a205-5fc9c96a7c04 убрали всплытие события при mousedown (для чего описано в ошибке)
         //FloatArea теперь не может превентить событие, поэтому при клике по панели закрывается попап, из которого была открыта floatArea.
         //Если клик был по скроллу - то target.wsControl вернет null, т.к. скролл находится на родительском контейнере floatArea
         //Пытаюсь найти панель вручную. Использую closest, т.к. клик может быть в ws-float-area-panel-external-jeans, который лежит на 1 уровне с floatarea
         var floatArea = $(target).closest('.ws-float-area-stack-cut-wrapper').find('.ws-float-area');
         if (floatArea.length){
            target = floatArea.wsControl().getOpener();
            return ControlHierarchyManager.checkInclusion(this, target && target.getContainer());
         }

         //TODO: из-за временной поддержки старой кнопки фильтров на vdom странице нужно учитывать и новые компоненты
         var newPopup = $(target).closest('.controls-Popup');
         if (newPopup.length) {
            target = newPopup[0].controlNodes && newPopup[0].controlNodes[0].control; //Получаем попап внутри которого был клик
            var parent = target && target._options.opener; //Смотрим кто открыл этот попап
            return ControlHierarchyManager.checkInclusion(this, parent && parent._container); //Если это кнопка фильтров или связанный с ней компонент то не закрываемся
         }

         //Если кликнули по инфобоксу - popup закрывать не нужно
         var infoBox = $(target).closest('.ws-info-box, .controls-InformationPopup:not(.controls-SubmitPopup_popup)');
         return !!infoBox.length;
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
      _initSizes: function (saveSide) {
         var target = this._options.target,
            container = this._container;
         if (target) {
            this._targetSizes = {
               width: this._getTargetWidth(target),
               height: target.outerHeight(),
               offset: target.offset(),
               border: (target.outerWidth() - target.innerWidth()) / 2,
               boundingClientRect: target.get(0).getBoundingClientRect()
            };

            // Баг в jquery при расчете офсета на ios: http://dev.jquery.com/ticket/6446
            // Решение взял с https://gist.github.com/mataspetrikas/431639
            if (detection.isMobileIOS && this._fixed) {
               this._targetSizes.offset.top -= window.scrollY;
            }

            if (this._options.parentContainer) {
               var parContainer = this._getParentContainer(),
                   parOffset = parContainer.offset();

               this._targetSizes.offset.top = this._targetSizes.offset.top - parOffset.top + parContainer.scrollTop();
               this._targetSizes.offset.left = this._targetSizes.offset.left - parOffset.left + parContainer.scrollLeft();
            }

            /* task:1173219692
            im.dubrovin на Chrome on Android при получении offset необходимо учитывать scrollTop , scrollLeft */
            if (detection.isMobileAndroid){
               this._targetSizes.offset.top-=$(window).scrollTop();
               this._targetSizes.offset.left-=$(window).scrollLeft();
            }

            // Для фиксированого таргета считаем оффсеты как boundingClientRect
            // Но на айпаде это неправильно, так как fixed слой там сдвигается вместе с клавиатурой
            if (this._fixed && !detection.isMobileIOS) {
               this._targetSizes.offset = this._targetSizes.boundingClientRect;
            }
         }
         this._containerSizes.border = (container.outerWidth() - container.innerWidth()) / 2;
         var buff;
         if (saveSide) {
            buff = this._getGeneralOffset(this._options.verticalAlign.side, this._defaultHorizontalAlignSide, this._options.corner, true);
         } else {
            buff = this._getGeneralOffset(this._defaultVerticalAlignSide, this._defaultHorizontalAlignSide, this._defaultCorner, true);
         }
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

      _getTargetWidth: function(target) {
         if (this._options._fixJqueryPositionBug) {
            return target[0].offsetWidth;
         }
         return target.outerWidth();
      },

      _initWindowSizes: function () {
         this._windowSizes = {
            height: $(window).height() - TouchKeyboardHelper.getKeyboardHeight(),
            width: document.body.clientWidth //Берем ширину документа, т.к. окно браузера может быть меньше минимальной ширины и нужно учитывать горизонтальный скролл
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

      /**
       * Получить offset при сдвиге в противоположный угол относительно corner по горизонтали или верткали 'horizontal'/'vertical'
       * @param  {[type]} corner      Угол относительно которого расчитывать
       * @param  {[type]} orientation Противоположный по вертекали или горизонтали
       * @return {[type]}             offset противоположного угла
       */
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
         offset.top += this._getUserOffset('vertical');
         offset.left += this._getUserOffset('horizontal');

         return offset;
      },

      _getUserOffset: function(align){
         var sign;
         if (align == 'vertical'){
            sign = !!this._isMovedV ? -1 : 1;
            return sign * ((this._options.verticalAlign.offset || 0) + this._margins.top - this._margins.bottom);
         } else {
            sign = !!this._isMovedH ? -1 : 1;
            return sign * ((this._options.horizontalAlign.offset || 0) + this._margins.left - this._margins.right);
         }
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

      /* проксирующий метод, изменяющий офсет в зависимости от свободного места на экране */
      _getOffsetByWindowSize: function (offset) {
         switch(this._options.locationStrategy){
            /* в режиме донт мув мы донт мув */
            case 'dontMove':
                 return offset;
            case 'bodyBounds':
               var scrollY = this._fixed ? 0 : $(window).scrollTop(),
                  scrollX = this._fixed ? 0 : $(window).scrollLeft();

               //вычитаение 1px обусловлено полупикселями в размерах контейнера. В расчетах они не учитываются, но некоторые браузеры
               //округляют значение в большую сторону при отрисовке, из-за чего контейнер может не поместиться в экран
               if (this._isHorizontalOverflow()) {
                  offset.left = this._windowSizes.width + scrollX - this._containerSizes.originWidth - 1;
               }
               if (this._isVerticalOverflow()) {
                  offset.top = this._windowSizes.height + scrollY - this._containerSizes.originHeight - 1;
               }
               if (offset.top < 0){
                  offset.top = 0;
               }
               if (offset.left < 0){
                  offset.left = 0;
               }
               return offset;
            /* по умаолчанию учитываем свободное место на экране */
            default:
               var buf = this._targetSizes.offset;
               //Проверяем убираемся ли в экран снизу. Если позиционируем нижней стороной, не нужно менять положение если не влезаем снизу
               if (this._isVerticalOverflow() && !this._isMovedV && this._options.verticalAlign.side !== 'bottom') {
                  this._isMovedV = true;
                  offset.top = this._getOppositeOffset(this._options.corner, 'vertical').top;
                  offset.top = this._addOffset(offset, buf).top;
               }

               //Возможно уже меняли положение и теперь хватает места что бы вернуться на нужную позицию по вертикали
               if (!this._isVerticalOverflow() && this._isMovedV) {
                  this._isMovedV = false;
                  offset.top = this._getOppositeOffset(this._options.corner, 'vertical').top;
                  offset.top = this._addOffset(offset, buf).top;
               }

               //TODO Избавиться от дублирования
               //Проверяем убираемся ли в экран справа. Если позиционируем правой стороной, не нужно менять положение если не влезаем справа
               if (this._isHorizontalOverflow() && !this._isMovedH && this._options.horizontalAlign.side !== 'right') {
                  this._isMovedH = true;
                  offset.left = this._getOppositeOffset(this._options.corner, 'horizontal').left;
                  offset.left = this._addOffset(offset, buf).left;
               }

               //Возможно уже меняли положение и теперь хватает места что бы вернуться на нужную позицию по горизонтали
               if (!this._isHorizontalOverflow() && this._isMovedH) {
                  this._isMovedH = false;
                  offset.left = this._getOppositeOffset(this._options.corner, 'horizontal').left;
                  offset.left = this._addOffset(offset, buf).left;
               }

               //Если после(!) разворота не влезаем в экран, то сдвинемся на наужное кол-во пикселей
               var dif = offset.left + this.getContainer()[0].offsetWidth - this._windowSizes.width;
               if (dif > 0) {
                  offset.left -= dif;
               }

               return offset;
         }
      },

      _isHorizontalOverflow: function() {
         var scrollX = this._fixed ? 0 : $(window).scrollLeft();
         return this._containerSizes.requiredOffset.left > this._windowSizes.width + scrollX;
      },

      _isVerticalOverflow: function() {
         var scrollableContainer = this._options.parentContainer ? this._getParentContainer() : $(window);
         var scrollY = this._fixed ? 0 : scrollableContainer.scrollTop();
         return this._containerSizes.requiredOffset.top > this._windowSizes.height + scrollY - (detection.firefox ? 1 : 0); //для ff проблемы с полупикселем. учитываю в расчетах
      },

      _calculateOverflow: function (offset, orientation) {
         // выбираем способ подстройки всплывашки
         switch(this._options.locationStrategy){
            case 'dontMove':
               return this._calculateOverflow_dontMove(offset, orientation);
            default:
               return this._calculateOverflow_allocate(offset, orientation);
         }
      },

      _calculateOverflow_dontMove: function (offset, orientation) {
         return (orientation == 'vertical') ? offset.top : offset.left;
      },

      _calculateOverflow_allocate: function (offset, orientation) {
         //TODO Избавиться от дублирования
         var vOffset = this._options.verticalAlign.offset || 0,
            hOffset = this._options.verticalAlign.offset || 0,
            scrollHeight = this._container.get(0).scrollHeight,
            height = "",
            spaces, oppositeOffset;
         spaces = this._getSpaces(this._options.corner);
         if (orientation == 'vertical') {
            if (offset.top <= 0) {
               this._overflowedV = true;
               this._container.css('overflow-y', detection.firefox ? 'scroll' : 'auto');
               //Высота попапа не может быть больше высоты окна, поэтому ограничим его как минимум этой высотой
               if (this._container.get(0).scrollHeight > this._windowSizes.height) {
                  height = this._windowSizes.height;
               }
               // При рассчете свободного места снизу учитываем виртуальную клавиатуру
               spaces.bottom -= TouchKeyboardHelper.getKeyboardHeight();

               switch (this._options.locationStrategy) {
                  case 'bodyBounds':
                     this._container.css('height', height);
                     break;
                  case 'verticalBodyBounds':
                     if (this._options.verticalAlign.side !== 'top') {
                        var cfgVerticalBodyBounds = this._calculateOverflow_vertical(orientation, vOffset, offset);
                        oppositeOffset = cfgVerticalBodyBounds.oppositeOffset;
                        spaces = cfgVerticalBodyBounds.spaces;
                        height = cfgVerticalBodyBounds.height;

                        // В этой стратегии высота не должна быть ограничена (единственное ограничение - не больше высоты экрана)
                        // Снимаем ограничения с высоты и меняем позицию, чтобы попап влез в экран
                        if (this._container.get(0).scrollHeight > this._windowSizes.height) {
                           offset.top = 0;
                           height = this._windowSizes.height;
                           this._container.css('overflow-y', detection.firefox ? 'scroll' : 'auto');
                        } else {
                           this._container.css('overflow-y', '');
                           var newHeight = this._container.get(0).scrollHeight - this._margins.top + this._margins.bottom;
                           var dif = newHeight - height;
                           height = newHeight;
                           if (dif > 0) {
                              offset.top -= dif;
                           }
                        }
                     }
                     break;
                  default:
                     if (this._options.verticalAlign.side !== 'top') {
                        if (spaces.top < spaces.bottom) {
                           if (this._options.targetOverlay){
                              this._container.css('height', height);
                              offset.top = this._windowSizes.height - this._container.get(0).scrollHeight - this._containerSizes.border * 2;
                           } else {
                              var cfgBodyBounds = this._calculateOverflow_vertical(orientation, vOffset, offset);
                              oppositeOffset = cfgBodyBounds.oppositeOffset;
                              spaces = cfgBodyBounds.spaces;
                              height = cfgBodyBounds.height;
                           }
                        } else {
                           offset.top = 0;
                           //Если места снизу меньше чем сверху покажемся во весь размер (возможно поверх таргета), или в высоту окна если в него не влезаем
                           if (!this._options.targetOverlay){
                              height = spaces.top;
                           }
                        }
                     }
               }
            }
            this._container.css('height', height);
            if (this._containerSizes.originHeight + vOffset + this._margins.top - this._margins.bottom < spaces.bottom && this._overflowedV) {
               this._container.css('overflow-y', 'visible');
               this._container.css('height', '');
               this._overflowedV = false;
            }
            if (this._options.bodyBounds && offset.top < 0) {
               offset.top = 0;
            }
            return offset.top;
         }
         else {
            if (offset.left < 0 && this._options.horizontalAlign.side !== 'left') {
               this._overflowedH = true;
               this._container.css('overflow-x', 'auto');
               spaces = this._getSpaces(this._options.corner);
               if (spaces.left < spaces.right) {
                  this._isMovedH = !this._isMovedH;
                  oppositeOffset = this._getOppositeOffset(this._options.corner, orientation);
                  spaces = this._getSpaces(this._options.corner);
                  this._container.css('width', spaces.right - hOffset - this._margins.left + this._margins.right);
                  offset.left = this._targetSizes.offset.left + oppositeOffset.left;
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
            if (this._options.bodyBounds) {
               if (offset.left < 0) {
                  offset.left = 0;
               }
               if (this._containerSizes.requiredOffset.left > this._windowSizes.width) {
                  offset.left = this._windowSizes.width - this._containerSizes.originWidth;
               }
            }
            return offset.left;
         }
      },

      _calculateOverflow_vertical: function(orientation, vOffset, offset) {
         this._isMovedV = !this._isMovedV;
         if (this._options._fixPopupRevertCorner) {
            if (this._options.corner === 'bl') {
               this._options.corner = 'tl';
            }
         }
         var config = {};
         config.oppositeOffset = this._getOppositeOffset(this._options.corner, orientation);
         config.spaces = this._getSpaces(this._options.corner);
         config.height = config.spaces.bottom - vOffset - this._margins.top + this._margins.bottom;
         offset.top = this._targetSizes.offset.top + config.oppositeOffset.top;
         
         return config;
      },

      //Рассчитать расстояния от таргета до границ экрана с учетом собственного положения попапа
      //Нужно для расчета размеров если не влезаем в экран
      //TODO: Можно придумать алгоритм получше
      _getSpaces: function (corner) {
         var offset = this._targetSizes.offset,
            width = this._targetSizes.width,
            height = this._targetSizes.height,
            //При расчете свободного места, учитываем весь экран
            //так как на айпаде нужно открывать окна под клавиатуру что бы скролить не выпадашку, а все окно (для красоты)
            //на андроиде выезжающая клавиатура уменьшает реальный размер window, поэтому такой херни нет
            windowHeight = this._windowSizes.height + TouchKeyboardHelper.getKeyboardHeight(),
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
             isChanged = isVerAlignChanged || isHorAlignChanged || this._options.corner != this._currentAlignment.corner,
             newAlignment;

         this._container.toggleClass('controls-popup-revert-horizontal', isHorAlignChanged)
            .toggleClass('controls-popup-revert-vertical', isVerAlignChanged);

         if (isChanged) {
            newAlignment = {
               verticalAlign: this._options.verticalAlign,
               horizontalAlign: this._options.horizontalAlign,
               corner: this._options.corner
            };
            this._notify('onAlignmentChange', newAlignment);
         }
      },

      _getZIndex: function(){
         if (!isNewEnvironment() || this._options._isSubmitPopup) {
            this._zIndex = cWindowManager.acquireZIndex(this._options.isModal, false, this._options.isHint);
            cWindowManager.setVisible(this._zIndex);

            var target = $(this.getTarget());
            var targetWindow = target.closest('.ws-window, .ws-float-area');
            var targetWindowControl = targetWindow[0] && targetWindow[0].wsControl;
            var isOverlayVisible = ModalOverlay.getZIndex() > 0 && ModalOverlay._overlay.is(':visible');

            //Показываемся под overlay'ем, если он не относится к окну, в котором лежит таргет
            if (!this.isModal() && targetWindowControl) {
               //Если панель, где лежит таргет, находится под overlay, то и попап должен быть под ним
               if (isOverlayVisible && targetWindowControl.getZIndex() < parseInt(ModalOverlay.getZIndex(), 10)) {
                  return ModalOverlay.getZIndex() - 1;
               }
            }
         } else {
            var openerPopupZIndex = this._getOpenerZIndex();
            cWindowManager.releaseZIndex(this._zIndex);
            if (openerPopupZIndex) {
               this._zIndex = parseInt(openerPopupZIndex, 10) + 1; //Выше vdom-окна, над которым открывается попап
            } else {
               //zIndex vdom контролов начинается с 10. если опенер лежит не в панели, все открываемые
               //vdom-окна должны быть выше текущего попапа
               this._zIndex = 9;
            }

            // Добавляем в Core.WM информацию о текущем zindex модального попапа напрямую, т.к. сами его высчитали
            // Core.WM публичным api не позволяет задавать zindex, т.к. по своей логиче высчитывает их сам
            if (this.isModal() && cWindowManager._modalIndexes && cWindowManager._modalIndexes.push) {
               cWindowManager._modalIndexes.push(this._zIndex);
            }
         }
         return this._zIndex;
      },

      _getOpenerZIndex: function() {
         var opener = this.getOpener() || this.getParent();
         var selector = '.controls-Popup, .controls-FloatArea, .ws-float-area-stack-cut-wrapper, .ws-float-area-nostack-panel-overflow, .ws-window:not(".controls-CompoundArea"), .controls-StylesPalette, .controls-Menu__Popup';
         var openerPopup = opener && opener._container && opener._container.closest(selector);
         //Из-за того, что все вешают классы как хотят, по селектору мы можем добраться до контейнера, который лежит внутри попапа.
         //Пытаемся достучаться до корневой ноды попапа, чтобы взять  z-index
         while (openerPopup && openerPopup.length > 0 && (!openerPopup.css('z-index') || openerPopup.css('z-index') === 'auto')) {
            openerPopup = openerPopup.parent();
         }

         return openerPopup && openerPopup.css('z-index');
      },

      /**
       * <wiTag noShow>
       * Получить z-index текущего окна
       * @return {Number} z-index
       */
      getZIndex : function() {
         return this._zIndex;
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

            if (this._options.target) {
               this._options.target.trigger('wsSubWindowOpen');
            }

            if (this._parentFloatArea){
               this._parentFloatArea.setHasPopupInside(true);
            }
            if (this._options.activateAfterShow) {
               doAutofocus(this._container);
            }
            if (detection.isMobileIOS) {
               // Известная бага: ios не хватает перерисовки, чтобы правильно отрисовать абсолютно спозиционированный элемент по оси z
               // вызываю reflow сам
               this._container.css('transform', 'scaleX(1)');
               setTimeout(function() {
                  if (!this.isDestroyed()) {
                     this._container.css('transform', '');
                  }
               }.bind(this), 0);
            }
         },

         _keyboardHover: function(event) {
            if (event.which === constants.key.esc) {
               this.hide();
            }
         }
      },

      before: {
         show: function () {
            this._container.css({
               left: '-10000px',
               top: '-10000px'
            });
            this._subscribeTargetMove();

            /* Хак для мобильных устройств (c touch), чтобы правильно работал скролл в пикере */
            if(this._options._canScroll && constants.browser.isMobilePlatform) {
               var topWindow = cWindowManager.getMaxZWindow();

               constants.$body.addClass('controls-ScrollContainer-overflow-scrolling-auto');
               /* У верхнего по стеку окна убираем класс, чтобы оно не портило сролл у нового окна */
               if(topWindow) {
                  topWindow.getContainer().removeClass('controls-Popup__touchScroll-fix');
               }
               this.getContainer().addClass('controls-Popup__touchScroll-fix');
            }

            ControlHierarchyManager.setTopWindow(this);
            //Показываем оверлей
            if (!this._zIndex) {
               this._getZIndex();
            }
            if (this._options.isModal) {
               this._setModal(true);
            }
         },
         _onResizeHandler: function(){
            this._resizeInner();
         },
         _resizeInner: function() {
            this._checkFixed(this._options.target || $('body'));
            if (this.isVisible() && !this._fixed) {
               this.recalcPosition(false);
            } else {
               this._initSizes();
            }
            this._checkTargetPosition();
         },
         destroy: function () {
            //ControlHierarchyManager.zIndexManager.setFree(this._zIndex);
            trackElement(this._options.target, false);
            cWindowManager.setHidden(this._zIndex);
            cWindowManager.releaseZIndex(this._zIndex);
            ControlHierarchyManager.removeNode(this);

            if(ControlHierarchyManager.getTopWindow() === this) {
               ControlHierarchyManager.setTopWindow(null);
            }

            if (isNewEnvironment()) {
               clearInterval(this._vdomZindexInterval);
            }

            this._unsubscribeTargetMove();
            EventBus.globalChannel().unsubscribe('MobileInputFocus', this._touchKeyboardMoveHandler);
            EventBus.globalChannel().unsubscribe('MobileInputFocusOut', this._touchKeyboardMoveHandler);
            if (this._options._resizeOnScroll) {
               EventBus.channel('WindowChangeChannel').unsubscribe('onWindowScroll', this._onResizeHandler, this);
            }
            EventBus.channel('WindowChangeChannel').unsubscribe('onDocumentDrag', this._dragHandler, this);

            if (this._options.closeByExternalOver) {
               EventBus.channel('WindowChangeChannel').unsubscribe('onDocumentMouseOver', this._clickHandler, this);
            }
            else if (this._options.closeByExternalClick) {
               EventBus.channel('WindowChangeChannel').unsubscribe('onDocumentClick', this._clickHandler, this);
            }
            // Освобождаем оверлей если забирали его
            if (this._options.isModal){
               this._setModal(false);
            }

            if(this._options.closeButton) {
               this.getContainer().find('.controls-PopupMixin__closeButton').off();
            }
         },
         hide: function() {
            if (this._options.target) {
               trackElement(this._options.target, false);
            }
         }
      },

      around: {
         hide: function (parentHide) {
            /* Если кто-то позвал hide, а контрол уже скрыт, то не будет запускать цепочку кода,
             могут валиться ошибки */
            if(!this.isVisible()) return;

            // хак для ipad, чтобы клавиатура закрывалась когда дестроится панель
            if (detection.isMobileIOS) {
                if(this.getContainer().find(document.activeElement).length > 0){
                   $(document.activeElement).trigger('blur');
                }
            }

            var self = this,
                result = this._notify('onClose'),
                clearZIndex = function() {
                   cWindowManager.setHidden(self._zIndex);
                   cWindowManager.releaseZIndex(self._zIndex);
                   self._zIndex = null;
                },
                deactivateWindow = function() {
                   cWindowManager.deactivateWindow(this, function () {
                      // Убираем оверлей
                      this._unsubscribeTargetMove();
                      if (this._options.isModal) {
                         this._setModal(false);
                      }

                      if (this._parentFloatArea) {
                         this._parentFloatArea.setHasPopupInside(false);
                      }

                   }.bind(this));
                   /* Хак для мобильных устройств (c touch), чтобы правильно работал скролл в пикере */
                   if(this._options._canScroll && constants.browser.isMobilePlatform) {
                      var topWindow = cWindowManager.getMaxZWindow(),
                          isPopUp = cInstance.instanceOfMixin(topWindow, 'SBIS3.CONTROLS/Mixins/PopupMixin');

                      /* При скрытии popUp'a:
                         если ниже по стеку тоже popup вешаем на него класс, который фиксит скролл
                         если нет, то убираем класс с body, фиксить скролл не надо */
                      if(isPopUp && topWindow._options._canScroll) {
                         topWindow.getContainer().addClass('controls-Popup__touchScroll-fix');
                      } else {
                         constants.$body.removeClass('controls-ScrollContainer-overflow-scrolling-auto');
                      }
                      self.getContainer().removeClass('controls-Popup__touchScroll-fix');
                   }
                },
               close = function() {
                  parentHide.call(self);
                  clearZIndex();
                  self._fixedOffset = null;
                  if (self._notMoveFocusAfterCloseSubmenu !== true) {
                     deactivateWindow.call(self);
                  }
                  if (self._options.target) {
                     self._options.target.trigger('wsSubWindowClose');
                  }
               };

            if (result instanceof Deferred) {
               result.addCallback(function (res) {
                  if (res !== false) {
                     close();
                  }
               });
            } else if (result !== false) {
               close();
            }
         }
      }
   };

   return PopupMixin;

});
