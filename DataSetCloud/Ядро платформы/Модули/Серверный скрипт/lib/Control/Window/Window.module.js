/**
 * Модуль "Компонент Окно".
 *
 * @description
 */
define('js!SBIS3.CORE.Window', ['js!SBIS3.CORE.TemplatedAreaAbstract', 'js!SBIS3.CORE.ModalOverlay', 'css!SBIS3.CORE.CloseButton'], function( TemplatedAreaAbstract, ModalOverlay ) {

   'use strict';

   var PADDING = 10;

   function withRecalc(func, self) {
      var result = function() {
         var res;
         try {
            this._updateCount++;
            res = func.apply(this, arguments);
         } finally {
            this._updateCount--;
            if (this._updateCount === 0 && res !== false) {

               this._updateCount++;//Защита от зацикливания расчёта...
               try {
                  this._adjustWindowPosition();
                  this._onResizeHandler();
               } finally {
                  this._updateCount--;
               }
            }
         }

         return res;
      }

      return self ? result.bind(self) : result;
   }

   /**
    * Окно
    * Можно перемещать по экрану с помощью мыши, менять его размер, разворачивать на весь экран
    *
    * @class $ws.proto.Window
    *
    * @extends $ws.proto.TemplatedAreaAbstract
    * @control
    *
    * @cfgOld {Boolean} resizeable {@deprecated Используйте resizable. Будет удалено с версии 3.6.0 } Используйте {@link resizable}
    * <wiTag noShow>
    */
   $ws.proto.Window = TemplatedAreaAbstract.extend(/** @lends $ws.proto.Window.prototype */{
      /**
       * @event onBeforeClose Перед закрытием окна
       * <wiTag group="Управление">
       * Событие, возникающее перед закрытием окна.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Boolean} arg "результат работы" окна, заданный при вызове {@link $ws.proto.Window#close}
       * @return При возврате false из события окно не будет закрыто.
       * @example
       * <pre>
       * window.subscribe('onBeforeClose', function(event, result) {
       *     // Если окно закрыто со статутсом, отличным от "успех",
       *     // т.е. НЕ через ok() или close(true) - отменим закрытие
       *     if(result !== true) {
       *         event.setResult(false);
       *     }
       * });
       * </pre>
       */
      /**
       * @event onAfterClose После закрытия окна.
       * <wiTag group="Управление">
       * Событие, возникающее после закрытия окна
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Boolean} arg "Результат работы" окна.
       * <pre>
       *    window.subscribe('onAfterClose',function(event){
       *      alert("Закрыто окно " + this.describe());
       *    });
       * </pre>
       */
      /**
       * @event onMove После перемещения окна
       * <wiTag group="Управление">
       * Событие, возникающее после перемещения окна.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Number} x Координата x (абсцисса).
       * @param {Number} y Координата y (ордината).
       * <pre>
       * window.subscribe('onMove', function(event) {
       *   self.calcTooltipPosition();
       * });
       * </pre>
       */
      $protected: {
         _window : undefined,
         _windowContent : undefined,
         _updateCount: 0,
         _titleBar : undefined,
         _resizeBar : undefined,
         _resizeBtn : undefined,
         _isShow : false,
         _isMaximized : false,
         _isCentered : false,
         _maximizeBtn : undefined,
         _left : undefined,
         _top : undefined,
         _dRender: null,
         _zIndex: 0,
         _options : {
            /**
             * @cfg {Boolean} Модальность. Определяет, является ли окно модальным.
             * <wiTag group="Отображение">
             * Возможные значения:
             * <ol>
             *    <li>false - окно будет немодальным, то есть, не будет закрывать остальной интерфейс</li>
             *    <li>true - окно будет модальным: всё, кроме окна, скрыто и недоступно для взаимодействия</li>
             * </ol>
             */
            modal: false,
            /**
             * @cfg {Boolean} Возможно изменение размера
             * <wiTag group="Отображение">
             * Признак, может ли пользователь произвольно менять размер окна (ресайз за уголок окна).
             * <pre>
             *
             * </pre>
             */
            resizable : true,
            /**
             * @cfg {String} Заголовок окна
             * <wiTag group="Отображение">
             * Текст, отображаемый в заголовке окна. При отображении окна текст заголовка добавляется в title документа.
             * При скрытии - восстанавливается.
             * @translatable
             */
            caption: undefined,
            windowState: true,
            /**
             * @cfg {Boolean} Отключить элементы управления окном
             * <wiTag group="Отображение">
             * Позволяет убрать с окна кнопки стандартных действий (закрыть, развернуть), расположенные в заголовке
             * @example
             * <pre>
             *    disableActions: true
             * </pre>
             */
            disableActions : false,
            /**
             * <wiTag noShow>
             */
            deprecated : false,
            /**
             * @cfg {Boolean} Имеет ли рамку
             * <wiTag group="Отображение">
             * Под "рамкой" подразумеваются стандартные элементы управления окна. Заголовок, кнопки закрытия, разворота и т.д.
             */
            border : true,
            /**
             * @cfg {Boolean|undefined} Показывать развернутым
             * <wiTag group="Отображение">
             * Развернуть ли окно на весь экран сразу при показе.
             * Если определено, то имеет приоритет над соответствующим параметром шаблона.
             */
            maximize : undefined,
            /**
             * @cfg {Number} Расстояние от окна до верхней границы экрана
             * <wiTag group="Отображение">
             * Если top и left не заданы, окно центрируется
             */
            top : undefined,
            /**
             * @cfg {Number} Расстояние от окна до левой границы экрана
             * <wiTag group="Отображение">
             * Если top и left не заданы, окно центрируется
             */
            left : undefined,
            /**
             * Не обрабатываем опцию parent для окна - оно не может иметь родительский контрол
             * <wiTag noShow>
             */
            parent: null,
            /**
             * @cfg {String} Заголовок окна
             * <wiTag group="Отображение">
             */
            title: '',

            origWidth: 0,
            origHeight: 0
         },
         _keysWeHandle : [
            $ws._const.key.esc,
            $ws._const.key.tab,
            $ws._const.key.enter
         ],
         _haveTitle: false,
         _haveContentTitleBlock: false
      },
      $constructor : function(cfg) {
         this._zIndex = $ws.single.WindowManager.acquireZIndex(this._isModal);

         this._dRender = new $ws.proto.Deferred();
         this._publish('onBeforeClose', 'onAfterClose', 'onMove');

         $ws.helpers.forEach([['close', this.close], ['ok', this.ok], ['cancel', this.cancel], ['maximize', this._maximizeWindow]],
                             function(args) { $ws.single.CommandDispatcher.declareCommand(this, args[0], args[1])}.bind(this));

         if(cfg.resizeable !== undefined) {
            this._options.resizable = cfg.resizeable;
         }

         this._window = this._createControl().css({ left: 0, top: 0 });

         this.subscribe('onAfterLoad', function(){
            if (this._options.deprecated){
               this.close();
               $ws.core.alert('У Вас недостаточно прав для просмотра.');
            }
            else if (this._options.visible) {
               this.show(); // Внутри show() стреляют onBefore- и onAfterShow
            }
         });

         if($ws._const.browser.isIE) {
            this.subscribe('onBatchFinished', function(){
               // Очистим тень
               this._window.addClass('clear-box-shadow');
               // Почитаем стили чтобы вызвать reflow/restyle
               this._container.width();
               // Вернем тень на место
               this._window.removeClass('clear-box-shadow');
            });
         }

         if (this._isModal) {
            this.subscribeTo(ModalOverlay, 'onClick', function(event) {
               //Если оверлей показан для этого окна (оно модальное и выше всех других модальных), то ему нужно закрыться
               if (this.isVisible() && $ws.single.ModalOverlay.isShownForWindow(this) ) {
                  event.setResult(true);
                  this.close();
               }
            }.bind(this));
         }
      },

      _templateInnerCallback: withRecalc(function() {
         return $ws.proto.Window.superclass._templateInnerCallback.apply(this, arguments);
      }),

      _templateInnerCallbackBeforeReady: function() {
         var left = parseInt(this._options.left, 10),
             top = parseInt(this._options.top, 10);

         this._left = isNaN(left) ? 0 : left;
         this._top = isNaN(top) ? 0 : top;
         this._isCentered = isNaN(left) && isNaN(top);

         // Если maximize не определено - смотрим на windowState. Иначе - смотрим только на maximize
         this._isMaximized = !!(this._options.maximize !== undefined ?
            this._options.maximize :
            this._options.windowState && this._options.windowState == 'maximized');

         this.getContainer().toggleClass('ws-window-maximized',this._isMaximized);

         this._createTitleBar();

         if (this._options.resizable && !(this._options.autoWidth && this._options.autoHeight)) {
            this._resizeBtn = $('<div></div>')
               .addClass('ws-window-resize')
               .bind('mousedown', function(event) {
                  this._isResizing = true;
                  return this._mouseDown(event);
               }.bind(this))
               .appendTo(this._window);
         }

         this._container.append('<div style="clear: both;">');

         this.setSize({
            width: this._isOptionDefault('width') && this._options.autoWidth  ? 'auto': this._width,
            height: this._isOptionDefault('height') && this._options.autoHeight ? 'auto': this._height
         });

         this._dRender.callback();
      },

      //Мин-макс размеры окна ставятся в функции _adjustWindowPosition
      _setMinMaxSizes: function() {
      },

      _postUpdateResizer: function(width, height) {
      },

      /**
       * @returns {string}
       */
      describe: function() {
         return 'Window#' + this.getId() + ' template: ' + (this._currentTemplateInstance && this._currentTemplateInstance.getName() || this._options.template);
      },

      _loadDescendents: function() {
         return this._loadTemplate();
      },

      /**
       * Самостоятельно сигналим onBeforeShow/onAfterShow, поэтому этот метод должен делать ничего
       * @private
       */
      _childrenLoadCallback: function() {
      },

      _setTemplateDimensions: function(dimensions) {
         if(dimensions.width && this._isOptionDefault('width')) {
            this._width = dimensions.width;
         }
         if(dimensions.height && this._isOptionDefault('height')) {
            this._height = dimensions.height;
         }
      },
      /**
       * Может ли обрабатывать события клавиш
       * @returns {Boolean}
       * @protected
       */
      _isAcceptKeyEvents: function(){
         return true;
      },
      /**
       * Обработка клавиатурных= нажатий
       * @param {Event} e
       * @return {Boolean} результат работы метода
       */
      _keyboardHover: function(e){
         if(e.which in this._keysWeHandle){
            if(e.which == $ws._const.key.esc){
               this.close();
               return false;
            }
            if(this.isEnabled()) {
               return $ws.proto.Window.superclass._keyboardHover.apply(this, arguments);
            }
            else {
               return true;
            }
         }
         return true;
      },
      /**
       * Инициализация окна
       * @return {$ws.proto.Window} созданное окно
       */
      _createControl : function () {
         var modalClass = this._isModal ? ' ws-modal' : '',
             wsWindow = $('<div></div>') //Создание самого окна
                .appendTo(document.body)
                .css('visibility', 'hidden')
                .addClass('ws-fixed ws-window shadow radius' + modalClass);

         this._windowContent = $('<div>', {style: 'z-index: 0'})
            .addClass('ws-window-content radius')
            .appendTo(wsWindow);

         //Добавить в окно наш контейнер
         this._container.prependTo(this._windowContent);
         this._container.css('z-index', 0);

         return wsWindow;
      },
      /**
       * Создает строку заголовка окна, добавляет в нее название
       */
      _createTitleBar : function () {
         var self = this,
             //блок с заголовком нужно искать вглубь, поскольку может быть ситуация с окном в окне (см. описание ошибки в коммите)
             customTitle = this._window.find('.ws-window-titlebar-custom').eq(0),
             contentTitleBlock = this._container.find('.ws-Window__title-border').eq(0),
             titleBarClasses, caption, innerTitle;

         this._haveContentTitleBlock = contentTitleBlock.length > 0;
         this._haveTitle = this._options.border || this._haveContentTitleBlock;

         if (this._haveTitle) {
            this._titleBar = this._haveContentTitleBlock ? contentTitleBlock : customTitle.length ? customTitle : $('<div></div>');

            //TODO: 3.7.0 - убрать радиус и пересечения ws-window-titlebar с другими классами
            //ws-window-titlebar - этот класс нужен только если _titleBar создаётся здесь, в коде окна.
            //если заголовок пользовательский (haveContentTitleBlock - сделан в Джинне), то там свои стили стоят - ws-window-titlebar
            //ему не нужен (ещё причина: ws-window-titlebar определяет свои правила для шрифтов, которые могут испортить текст в заголовке, созданном джинном)
            titleBarClasses = this._haveContentTitleBlock ? 'radius' : 'ws-window-titlebar radius';

            this._titleBar.addClass(titleBarClasses).
                           dblclick(this._maximizeWindow.bind(this)).
                           prependTo(this._window).
                           append('<div>&nbsp;</div>');

            if (!this._haveContentTitleBlock) {
               this._title.addClass('ws-window-title').prependTo(this._titleBar);
               this._createTitleButtons();
               this._applyDrag(this._titleBar);
            } else {
               this._title.detach();
               //Если заголовок был сделан в Джинне, то таскать нужно только за текст 
               //заголовка, поскольку иначе контролы в заголовке будут начинать таскание,
               //и отфильтровать их в _mouseDown невозможно - хз что туда положат
               innerTitle = this._titleBar.find('div[sbisname="windowTitle"]');
               if(innerTitle.length){
                  this._applyDrag(innerTitle);
               }
            }

            this._window.addClass('ws-window-draggable');
            this._titleBar.removeClass('ws-hidden');
            this._initKeyboardMonitor(this._titleBar);

            caption = this._options.caption !== undefined ? this._options.caption : this._options.title;
            if (caption) {
               this.setTitle(caption);
            }
         } else if (this._titleBar) {
            this._title.detach();
            this._titleBar.remove();
            this._titleBar = undefined;

            this._window.removeClass('ws-window-draggable');
         }
      },
      _applyDrag: function(to) {
         to.bind('mousedown', this._mouseDown.bind(this));
      },
      /**
       * <wiTag group="Отображение">
       * Добавляет обработчик на элемент для перетаскивания окна.
       * С помощью данного метода можно определить области окна, за которые будет осуществляться перетаскивание.
       * По умолчанию окно можно перетаскивать только за заголовок.
       * @param {jQuery} to Элемент, за который будет доступно перетаскивание окна.
       * @example
       * <pre>
       * // Разрешим перетаскивать окно за все дочерние DOM-элементы с CSS-классом drag-handle
       * window.applyDrag(window.getContainer().find('.drag-handle'));
       * </pre>
       */
      applyDrag: function(to) {
         this._applyDrag(to);
      },

      _makeLoadErrorHandler: function(parallelDeferred) {
         var inheritedHandler = $ws.proto.Window.superclass._makeLoadErrorHandler.call(this, parallelDeferred);
         return function(e) {
            try {
               this._createTitleBar();
            } catch(error) {
               //Игнорируем ошибку, чтоб _createTitleButtons не испортила ничего.
               BOOMR.plugins.WS.reportError(error);
            }
            //Обрабатываем ошибку унаследованным обработчиком.
            inheritedHandler.call(this, e);
         };
      },

      /**
       * Добавляет все кнопки на тайтлбар и вешает на них события.
       */
      _createTitleButtons: function(){
         var self = this;
         if(!this._options.disableActions){
            //кнопка "развернуть(восстановить) окно"
            if(this._options.resizable) {
               this._maximizeBtn = $('<a href="javascript:void(0)"></a>')
                  .addClass('ws-window-titlebar-action maximize')
                  .click(function() {
                     self._maximizeWindow();
                  })
                  .prependTo(this._titleBar);
            }
            //кнопка "закрыть окно"
            $('<a href="javascript:void(0)"></a>')
               .addClass('ws-window-titlebar-action close')
               .click(function() {
                  self.close();
                  return false;
               })
               .prependTo(this._titleBar);
         }
      },
      _updateDocumentTitle: function() {
         var titleTxt = this.getTitle(),
            lastIndex = document.title.lastIndexOf(' - ' + titleTxt);
         // Если есть что обновлять...
         if(titleTxt && lastIndex == -1) {
            document.title = document.title + ' - ' + titleTxt;
         }
      },
      _clearDocumentTitle: function() {
         var lastIndex = document.title.lastIndexOf(' - ' + this.getTitle());
         if(lastIndex > 0) {
            document.title = document.title.slice(0, lastIndex);
         }
      },
      _setTitle : function(title){
         $ws.proto.Window.superclass._setTitle.apply(this, arguments);
         this._window.find('div[sbisname="windowTitle"] span').text(title);
      },
      /**
       * <wiTag noShow>
       * Получить z-index текущего окна
       * @return {Number} z-index
       */
      getZIndex : function() {
         return this._zIndex;
      },
      /**
       * <wiTag group="Управление">
       * Сделать окно видимым.
       * Перед показом поднимает событие {@link $ws.proto.Window#onBeforeShow}, изменяет заголовок документа добавляя в него
       * свой заголовок.
       * После того, как окно будет готово (прогружены все дочерние элементы), и, если не установлена опция noBringToTop,
       * - перемещает окно вперёд (относительно других окон) и поднимает событие {@link $ws.proto.Window#onAfterShow}.
       * Не делает ничего, если окно уже показано.
       * @param {Boolean} [noBringToTop=false] Не поднимать окно наверх.
       * @see onBeforeShow
       * @see onAfterShow
       */
      show : function (noBringToTop) {
         // Если окно уже показано - ничего не делаем
         if(!this._isShow) {
            this._dRender.addCallback(withRecalc(function(){
               this._window.css('visibility', '');
               this._notify('onBeforeShow');

               this._updateDocumentTitle();
               $ws.single.WindowManager.setVisible(this._zIndex);
               this._window.show();

               this._isShow = true;

               this._checkDelayedRecalk();

               if(!noBringToTop) {//TODO ??? может, после пакета ??
                  this.moveToTop();
                  this.onBringToFront();
               }

               if(this._isModal) {
                  ModalOverlay.adjust();
               }
            }, this).callNext(
               this._notifyBatchDelayed.bind(this, 'onAfterShow')
            ));
         }
      },
      /**
       * Скрывает окно
       * @private
       */
      _hideWindow: function(){
         this._window.hide();
         this._isShow = false;
         $ws.single.WindowManager.popAndShowNext(this);
      },
      /**
       * <wiTag group="Управление">
       * Скрыть окно и передать фокус следующему.
       * Скрывате окно и передает фокус следующему.
       * Убирает из заголовка документа свой заголовок.
       * Не делает ничего, если окно уже скрыто.
       */
      hide: function(){
         // Если окно уже скрыто - ничего не делаем
         if(!this._isShow) {
            return;
         }
         this._hideWindow();
         $ws.single.WindowManager.setHidden(this._zIndex);
         this._clearDocumentTitle();
         var nextWin = $ws.single.WindowManager.getMaxZWindow();
         if(nextWin !== undefined) {
            if(nextWin.getZIndex() === 0){
               nextWin = $ws.single.WindowManager.getLastActiveWindow();
            }
            if(nextWin !== undefined){ //После getLastActiveWindow мы теоретически можем не получить окно, если верхнее окно - единственное и оно не может получать фокус
               nextWin.moveToTop(true);
               nextWin.onBringToFront();
            }
         }
         if(this._isModal) {
            ModalOverlay.adjust();
         }
      },
      /**
       * <wiTag group="Управление">
       * Показано ли окно
       * @return {Boolean}
       */
      isShow : function () {
         return this.isVisible();
      },

      isVisible: function() {
         return this._isShow;
      },

      /**
       * <wiTag group="Управление">
       * Закрывает окно
       * Поднимает события {@link $ws.proto.Window#onBeforeClose} и {@link $ws.proto.Window#onAfterClose}, передает в них аргумент, с которым был вызван сам.
       * Закрытие окна может быть отменено в событии {@link $ws.proto.Window#onBeforeClose}.
       * После закрытия окно уничтожается и не может быть показано методом {@link show}.
       * @param {Boolean} [arg] "результат работы" окна, передается в события {@link $ws.proto.Window#onBeforeClose} и {@link $ws.proto.Window#onAfterClose}
       * @returns {$ws.proto.Deferred} Deferred. Сработает когда окно будет закрыто
       * @command
       * @example
       * <pre>
       *    window.subscribe('onAfterClose', function(event, result) {
       *        // result == { someField: true }
       *        alert('Результат закрытия окна: ' + result.someField);
       *    });
       *
       *    window.close({ someField: true }); // console: 'Результат закрытия окна: true'
       * </pre>
       * @see show
       * @see onBeforeClose
       * @see onAfterClose
       */
      close: function (arg) {
         var self = this;
         return this.getReadyDeferred().addCallback(function(){
            var flag = self._notify('onBeforeClose', arg);
            if(flag !== false){
               // По честному закроем окно перед уничтожением чтобы в onAfterClose окно было невидимо
               self.hide();
               self._notify('onAfterClose', arg);
               // здесь тоже вызовется hide но ничего плохого не случится т.к. в hide стоит проверка
               self.destroy();
            }
         });
      },
      _removeContainer: function() {
         this._window.empty().remove();
      },
      /**
       * <wiTag noShow>
       * Уничтожает окно
       */
      destroy: function(){
         if(this._titleBar){
            this._titleBar.unbind();
            this._window.find('div[sbisname="windowTitle"]').unbind();
         }
         $ws._const.$win.unbind('resize.' + this.getId());
         $ws.single.WindowManager.releaseZIndex(this._zIndex);
         $ws.proto.Window.superclass.destroy.apply(this, arguments);
         this.hide();
      },
      /**
       * <wiTag group="Управление">
       * Закрытие окна c результатом "успех".
       * В событие onBeforeClose и onAfterClose передается true. Короткая форма записи для <code>window.close(true)</code>
       * @returns {$ws.proto.Deferred} Асинхронный результат
       * @command
       * @see onBeforeClose
       * @see onAfterClose
       */
      ok : function(){
         return this.close(true);
      },
      /**
       * <wiTag group="Управление">
       * Закрытие окна с результатом "отмена".
       * В событие onBeforeClose и onAfterClose передается false. Короткая форма записи для <code>window.close(false)</code>
       * @returns {$ws.proto.Deferred} Асинхронный результат.
       * @command
       * @see onAfterClose
       * @see onBeforeClose
       */
      cancel : function(){
         return this.close(false);
      },
      /**
       * <wiTag noShow>
       * Готовит окно к движениям (убирает тени и уголки)
       */
      shadowsOff: function() {
         this._window.removeClass('shadow radius');
         this._windowContent.removeClass('radius');
         if(this._titleBar){
            this._titleBar.removeClass('radius');
         }
      },
      /**
       * <wiTag noShow>
       * Возвращает окну первоначальный вид после окончания движения (тени и уголки)
       */
      shadowsOn: function () {
         //TODO: проверить - должны они быть публичными???
         this._window.addClass('shadow radius');
         this._windowContent.addClass('radius');
         if(this._titleBar){
            this._titleBar.addClass('radius');
         }
      },

      /**
       * Рассчитать ширину и высоту контента, по размерам области
       * @param {Number} x
       * @param {Number} y
       * @return {Object} размеры объект с полями высота и ширина
       */
      _getResizerSize: function(x, y){
         var offset = this._window.offset();
         return {
            width : Math.max(0, x + this._windowWidthStart - this._pageXstart - offset.left),
            height : Math.max(0, y + this._windowHeightStart - this._pageYstart - offset.top)
         };
      },

      /**
       * <wiTag group="Управление">
       * Перемещает окно
       * @param {Number} left Смещение по горизонтали левого верхнего угла
       * @param {Number} top Смещение по вертикали левого верхнего угла
       */
      moveWindow : withRecalc(function(left, top){
         this._isCentered = false;
         this._isMaximized = false;
         this._left = left;
         this._top = top;
      }),

      /**
       * <wiTag group="Управление">
       * Изменяет размеры окна
       * @param {Object} size объект, описыващий размеры окна
       * @param {Number|String} [size.width] Ширина - число или строка 'auto'. Если не задано - 'auto'
       * @param {Number|String} [size.height] Высота - число или строка 'auto'. Если не задано - 'auto'
       */
      setSize: withRecalc(function(size) {
         var minWidth = parseInt(this._options.minWidth, 10) || 0,
             minHeight = parseInt(this._options.minHeight, 10) || 0,
             maxWidth = parseInt(this._options.maxWidth, 10) || Infinity,
             maxHeight = parseInt(this._options.maxHeight, 10) || Infinity;

         this._width = Math.min(maxWidth, Math.max(minWidth, parseInt(size.width, 10)));
         if (isNaN(this._width)) {
            this._width = 'auto';
         }

         this._height = Math.min(maxHeight, Math.max(minHeight, parseInt(size.height, 10)));
         if (isNaN(this._height)) {
            this._height = 'auto';
         }
      }),

      /**
       * <wiTag group="Управление">
       * Центрируем окно
       */
      moveWindowToCenter: withRecalc(function(coords) {
         this._isCentered = true;
         this._isMaximized = false;
      }),

      /**
       * Развернуть/восстановить окно
       */
      _maximizeWindow : withRecalc(function() {
         var res = this._options.resizable;
         if(res) {
            this._isMaximized = !this._isMaximized;
            this.getContainer().toggleClass('ws-window-maximized',this._isMaximized);

            if (this._isMaximized) {
               if (this._maximizeBtn) {
                  this._maximizeBtn.addClass('fill');
               }
               this._window.removeClass('ws-window-draggable');

               if (this._resizeBtn) {
                  this._resizeBtn.hide();
               }
            }
            else {
               if (this._maximizeBtn) {
                  this._maximizeBtn.removeClass('fill');
               }
               this._window.addClass('ws-window-draggable');

               if (this._resizeBtn) {
                  this._resizeBtn.show();
               }
            }
         }
         return res;
      }),

      /**
       * <wiTag group="Управление">
       * Показать окно поверх всего если он видимый
       * @param {Boolean} [force] принудительый перенос вверх
       * @return {Number} максимальный z-index диалогов
       */
      moveToTop : function(force) {
         if(this._isShow) {
            var
               winMan = $ws.single.WindowManager;
            if(!force && !winMan.pushUp(this)) {
               return -1;
            }
            var
               self = this,
               maxZWindow = winMan.getMaxZWindow(function(area){
                  return !area.findParent(function(parent){
                     return parent === self;
                  });
               }),
               maxZ = maxZWindow && maxZWindow.getZIndex() || 1000,
               curZ = this.getZIndex();
            if (force || maxZ != curZ) {
               // Обновляем z-index
               winMan.releaseZIndex(this._zIndex);
               this._zIndex = winMan.acquireZIndex(this._isModal);
               winMan.setVisible(this._zIndex);
            }
            this._window.css('z-index', this._zIndex);
            $('.ws-window-titlebar.active').removeClass('active');
            if(this._titleBar){
               this._titleBar.addClass('active');
            }
            if(this._isModal) {
               ModalOverlay.adjust();
            }
            return this._zIndex;
         } else {
            return -1;
         }
      },
      /**
       * Функционал подменен в окнах создающихся при индикаторах загрузки.
       * <wiTag noShow>
       */
      isMovableToTop: function() {
         return true;
      },
      /**
       * Событие опускания кнопки мыши
       * @param {Event} event
       * @return {Boolean} результат работы превент дефолт
       */
      _mouseDown : function(event) {
         if (this._isMaximized ||
             $(event.target).parents().add(event.target).filter('.ws-window-titlebar-action, [data-component]').length)
         {
            return true;
         }

         this.moveToTop();
         this.onBringToFront();

         var offsetWindow = this._window.offset();
         this._pageXstart = event.pageX - offsetWindow.left;
         this._pageYstart = event.pageY - offsetWindow.top;
         this._windowWidthStart = this._container.width();
         this._windowHeightStart = this._container.height();
         this._mouseStarted = true;

         if (this._isResizing) {
            var offsetContent = this._window.offset();
            this._resizeBar = $('<div></div>')
                .addClass('ws-window-resizebar')
                .fadeTo(0, 0.8)
                .appendTo(document.body)
                .css({
                   top: offsetContent.top - PADDING,
                   left: offsetContent.left - PADDING,
                   width: this._window.width(),
                   height: this._window.height(),
                   'z-index': $ws.single.WindowManager.getMaxZIndex() + 10
                });
         }

         $ws._const.$doc
            .bind('mousemove', this._mouseMove.bind(this))
            .bind('mouseup', this._mouseUp.bind(this));

         return event.preventDefault();
      },

      /**
       * Событие передвижения мыши
       * @param {Event} event
       * @return {Boolean} результат работы превент дефолт
       */
      _mouseMove : function(event) {
         if (this._mouseStarted) {
            if (this._isResizing){
               this._resizeBar.css(this._getResizerSize(event.pageX, event.pageY));
            }
            else {
               //если тень включена, то ее нужно отключить
               if (this._window.hasClass('shadow')) {
                  this._windowContent.css('visibility', 'hidden');
                  if (!$ws._const.browser.isIE) {
                     this._window.fadeTo(0, 0.8);
                  }
                  this._window.removeClass('shadow').addClass('move');
               }

               this._titleBar.css('visibility', 'hidden');

               var pageY = event.pageY < 0 ? 0 : event.pageY;
               this.moveWindow(event.pageX - this._pageXstart, pageY - this._pageYstart);
            }
         }
         return event.preventDefault();
      },

      /**
       * Событие поднятия кнопки мыши
       * @param {Event} event
       */
      _mouseUp : function(event) {

         this._titleBar.css('visibility', 'visible');
         this._windowContent.css('visibility', 'visible');
         if (!$ws._const.browser.isIE) {
            this._window.fadeTo(0, 1);
         }

         this._window.addClass('shadow').removeClass('move');
         $ws._const.$doc.unbind('mousemove').unbind('mouseup');
         this._mouseStarted = false;

         if (this._isResizing) {
            this._resizeBar.remove();
            this._isResizing = false;

            this.setSize(this._getResizerSize(event.pageX, event.pageY));
         }

      },

      /**
       * Возвращает, может ли получать фокус
       * @return {Boolean}
       */
      canAcceptFocus: function(){
         return this.isShow();
      },

      _restoreSize: function() {
      },

      _adjustWindowPosition: function() {
         function prepCss(css) {
            var pixProps = ['width', 'height', 'max-width', 'max-height',
                            'min-width', 'min-height',
                            'margin-left', 'margin-right', 'margin-top', 'margin-bottom'];

            return $ws.helpers.reduce(css, function(res, val, key) {
               if (val !== undefined)
               {
                  if (Array.indexOf(pixProps, key) !== -1) {
                     res[key] = (val === 'auto' || val === '') ? val : (val !== 0 ? val + 'px' : 0);
                  } else {
                     res[key] = val;
                  }
               }
               return res;
            }, {});
         }

         var winWidth = $(window).width(),
             winHeight = $(window).height(),
             minMinWidth = this._options.border ? 100 : 0,
             minWidth = Math.max(this._options.minWidth, minMinWidth),
             minHeight = this._options.minHeight,
             contentBlock = {},
             leftWin = this._left - $(window).scrollLeft(),
             topWin = this._top - $(window).scrollTop(),
             titleBorderHeight = this._haveTitle ? this._titleBar.height() : 0,
             contentTitleBlockHeight = this._haveContentTitleBlock ? titleBorderHeight : 0,
             winPos = {}, oldPos = this._window.offset(),
             isPositioned = !this._isMaximized && !this._isCentered,
             maxOuterWidth = Math.max(0, winWidth - (isPositioned ? leftWin : 0)),
             maxOuterHeight = Math.max(0, winHeight),
             maxHeight = Math.max((maxOuterHeight - titleBorderHeight) - (isPositioned ? topWin : 0), 0),
             outerWidth, outerHeight, fixCss;

         if (this._height === 'auto') {
            if (this._isMaximized) {
               this._container.css('height', 'auto');
               contentBlock.height = this._container.height() < maxHeight ? maxHeight : 'auto';
            } else {
               contentBlock.height = 'auto';
            }

            contentBlock.minHeight = minHeight ?
                                     Math.max(0, minHeight - contentTitleBlockHeight) :
                                     '';
         } else if (this._isMaximized) {
            contentBlock.height = Math.max(0, maxOuterHeight - titleBorderHeight);
         } else {
            contentBlock.height = this._height - contentTitleBlockHeight;
         }

         if (this._width === 'auto') {
            if (this._isMaximized) {
               this._container.css('width', 'auto');
               contentBlock.width = this._container.width() < maxOuterWidth ? maxOuterWidth : 'auto';
            } else {
               contentBlock.width = 'auto';
            }

            contentBlock.minWidth = minWidth || '';
         } else if (this._isMaximized) {
            contentBlock.width = maxOuterWidth;
         } else {
            contentBlock.width = this._width;
         }

         this._windowContent.css(prepCss({
            'overflow-x': 'hidden',
            'overflow-y': 'hidden',
            'margin-top': titleBorderHeight,
            'max-width': maxOuterWidth,
            'max-height': maxHeight
         }));

         this._container.css(prepCss({
            width: contentBlock.width,
            height: contentBlock.height,
            'min-height': contentBlock.minHeight,
            'min-width': contentBlock.minWidth,
            position: 'relative',
            'overflow': 'hidden'
         }));

         fixCss = {};
         if (this._windowContent.prop('scrollHeight') > maxHeight) {
            fixCss['overflow-y'] = 'scroll';
         }
         this._windowContent.css(fixCss);

         fixCss = {};
         if (this._windowContent.prop('scrollWidth') > maxOuterWidth) {
            fixCss['overflow-x'] = 'scroll';
         }
         this._windowContent.css(fixCss);

         outerWidth = this._windowContent.outerWidth(true);
         outerHeight = this._windowContent.outerHeight(true);

         if (this._isMaximized)
         {
            winPos = {
               left: 0,
               top: 0
            };
         } else if (this._isCentered) {
            winPos = {
               left: (winWidth - outerWidth) / 2,
               top: (winHeight - outerHeight) / 2
            };
         } else {
            winPos = {
               left: Math.max(0, leftWin),
               top: Math.max(0, topWin)
            };
         }

         if (oldPos.left !== winPos.left || oldPos.top !== winPos.top) {
            this._window.css(winPos);
            this._notify('onMove', winPos.left, winPos.top);
         }
      },

      _onSizeChangedBatch: function() {
         $ws.proto.Window.superclass._onSizeChangedBatch.apply(this, arguments);
         this._adjustWindowPosition();
         return true;
      },

      _subscribeToWindowResize: function() {
         $ws._const.$win.bind('resize.' + this.getId(), withRecalc(function() {
            //Тут нужно делать пересчёт - обёртка withRecalc сделает его сама
         }, this));
      },

      _templateOptionsFilter: function(){
         var s = $ws.proto.Window.superclass._templateOptionsFilter.apply(this, arguments);
         return s.concat('border', 'resizable', 'resizeable', 'caption', 'maximize', 'windowState', 'deprecated');
      }
   });

   return $ws.proto.Window;
});
