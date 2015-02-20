/**
 * Модуль "Компонент кнопка".
 *
 * @description
 */
define('js!SBIS3.CORE.Button', ['js!SBIS3.CORE.ButtonAbstract', 'html!SBIS3.CORE.Button', 'html!SBIS3.CORE.Button/Button_image', 'Core/BackgroundMapper', 'css!SBIS3.CORE.Button'], function( ButtonAbstract, dotTplFn, btnImageTpl, BackgroundMapper ) {

   'use strict';

   var MENU_HEAD_LEFT_WIDTH = 16,
       MENU_HEAD_RIGHT_WIDTH = 28;

   $ws._const.Button = {
      offsetClassicButton: { left: 0, top: 4 },
      offsetLinkButton: { left: -5, top: -5 },
      offsetLinkButtonWithoutImage: { left: -9, top: -5 },
      offsetAddButton: { left: -2, top: 4 },
      additionalMenuWidth: 24,
      initializedMenu: {} //Объект, содержащий инициализированные меню
   };

   /**
    * Кнопка
    *
    * @class $ws.proto.Button
    * @extends $ws.proto.ButtonAbstract
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.Button' style='width: 100px'>
    *    <option name='caption' value='Кнопка'></option>
    * </component>
    * @icon buttonIcon.png
    * @category Button
    * @designTime actions /design/design
    */
   $ws.proto.Button = ButtonAbstract.extend(/** @lends $ws.proto.Button.prototype */{
      /**
       * @event onActivated Происходит при активации кнопки (клик мышкой, кнопки клавиатуры)
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Boolean} pressed Нажата ли кнопка (при использовании опции press).
       * @example
       * <pre>
       *    onButtonClick: function(event) {
       *       var list = this.getChildControlByName('listOfPersons');
       *       list.sendCommand('newItem');
       *    }
       * </pre>
       */
      $protected: {
         _options : {
            /**
             * @cfg {String} Идентификатор меню, привязанного к кнопке
             * Устанавливается методом {@link setMenu}.
             * <wiTag group="Управление">
             * Этот параметр связывает меню с указанным идентификатором с данной кнопкой.
             * Меню открывается при клике на кнопку.
             * @example
             * <pre>
             *     //в качестве значения указывается путь до меню,
             *     //если всё находится в одном компоненте, то перед именем просто ставится "/"
             *     <option name="menu">/Menu</option>
             * </pre>
             * @editor InternalComponentChooser
             * @editorConfig filterByType SBIS3.CORE.Menu
             */
            menu: '',
            /**
             * @cfg {String} Адрес, который откроется при клике на кнопку-ссылку
             * <wiTag group="Управление">
             * Изменяется методом {@link setOpenLink}.
             * @example
             * <pre>
             *     <option name="openLink">https://www.google.ru</option>
             * </pre>
             * @see openLinkInNewTab
             */
            openLink : '',
            /**
             * @cfg {Boolean} Открывать ссылку в новой закладке
             * <wiTag group="Управление">
             */
            openLinkInNewTab: true,
            /**
             * <wiTag noShow>
             */
            displayCaptionForAddButton: false,
            cssClassName: 'ws-field-button',
            imageTemplate: btnImageTpl
         },
         _menuInitialized: false,
         _menuContent: undefined,
         _menuMouseHandler: undefined, //Обработчик мыши для кнопки с меню
         _menuHeaderLeft: undefined,
         _menuHeaderRight: undefined,
         _menuOpenHandler: undefined,
         _menuCloseHandler: undefined,
         _menuToggleHandler: undefined,
         _menuAfterRenderHandler: undefined,
         _menuStyle: 'classic',
         _menuProcessed: false,
         _drawAddButton: false, //Флаг рендера кнопки добавить
         _cloneContainer: undefined,
         _isUseCaptionInTitle: true
      },
      _dotTplFn : dotTplFn,
      $constructor: function(cfg){
         var self = this;
         if(cfg.menuName !== undefined) {
            this._options.menu = cfg.menuName;
         }
         this._drawAddButton = this._options.image.indexOf('icon-AddButton') !== -1 && !this._options.displayCaptionForAddButton;
         this._container.toggleClass('ws-add-button', this._drawAddButton);
         this._setRenderStyleClass();
      },
      _setRenderStyleClass: function() {
         if (this._options.renderStyle === 'asLink' && !this._drawAddButton) {
            this._menuStyle = 'iconDropdown';
         } else {
            this._menuStyle = 'classic';
         }
      },
      /**
       * Обновляет классы на меню
       * @private
       */
      _updateMenuClasses: function(toAdd){
         this._menuControl.getContainer().find('.menu-ul')
            .toggleClass(this._menuStyle === 'classic' ?
               'ws-button-menu-content' :
               (this._container.find('.icon-16').length ? 'menu-ul-24' : 'menu-ul-32')
            , toAdd);
      },
      /**
       * Возвращает адрес, который должен открыться при клике на кнопку-ссылку
       * <wiTag group="Управление">
       * @example
       * <pre>
       *    var btn = $ws.single.ControlStorage.getByName("myButton");
       *    if (btn.getOpenLink() !== "http://google.com"){
       *       btn.setOpenLink("http://google.com");
       *    }
       * </pre>
       * @returns {string} Адрес, открываемый при клике на кнопку-ссылку.
       * @see openLink
       */
      getOpenLink: function(){
         return this._options.openLink;
      },
      /**
       * Устанавливает для кнопки-ссылки адрес, который будет открыт при клике на кнопку
       * <wiTag group="Управление">
       * @example
       * <pre>
       *    var btn = $ws.single.ControlStorage.getByName("myButton");
       *    if (btn.getOpenLink() !== "http://google.com"){
       *       btn.setOpenLink("http://google.com");
       *    }
       * </pre>
       * @see openLink
       */
      setOpenLink: function(openLink){
         this._options.openLink = openLink;
      },
      useCaptionInTitle: function (value) {
         this._isUseCaptionInTitle = !!value;
      },
      /**
       * Добавляет в меню верхний элемент с тултипом
       * @private
       */
      _prepareMenuTitle: function() {
         var
            image = this._options.image,
            title = $('<li class="ws-menu-item ws-menu-button-title' +
                            (image ? ' ws-button-with-image"><div class="ws-menu-button-title-image"></div>' : ' ws-menu-item-without-image">') +
                         '<div class="ws-menu-button-title-text">' +
                            ((this._isUseCaptionInTitle && this._options.caption) || this._options.tooltip) +
                         '</div>' +
                      '</li>'),
            imageContainer = title.find('.ws-menu-button-title-image');
         if (image) {
            if (image.indexOf('sprite:') > -1) {
               imageContainer.addClass(image.split('sprite:')[1].replace('icon-primary', 'icon-hover'));
            } else {
               BackgroundMapper.makeBackground(imageContainer, image);
            }
         }
         title.bind('click', function(){
            this._toggleSubMenu();
         }.bind(this));
         this._menuContent.prepend(title);
      },
      /**
       * Обработчик открытия меню
       * @private
       */
      _onMenuOpen: function() {
         var
            button = this.getContainer(),
            headElements,
            buttonWidth;
         if (this._menuControl.isShow() && !this._menuProcessed) {
            this._menuProcessed = true;
            if (this._menuStyle === 'classic') {
               headElements = button.find('.ws-header-element');
               button.addClass('ws-field-button-element-active');
               //определяем контейнер, который будет являться копией кнопки
               this._cloneContainer = this._menuControl.getContainer().find('.ws-button-menu-clone-container');
               //очищаем контейнер-копию от всех вложенных в него элементов, изменяем ширину в соответствии с шириной
               //подлинного контейнера кнопки, определяем классы у контейнера-копии и соответственно делаем клон
               //вложенных элементоы контейнера кнопки и вставляем в копию
               buttonWidth = button.width();
               this._cloneContainer.empty()
                     .append($('<div></div>').css('width', '100%')
                     .addClass(button.attr('class')).append($(button.html()).clone(true)));
               // Если у клон-контейнера ширина меньше чем у кнопки, то стоит не автоширина -> задаём клону ширину оригинальной кнопки
               // зачем сделано: в chrome текст клона кнопки с автошириной не влезает, если задать строгую ширину
               // (где там логика - не понятно, т.к. автоширина выдает контейнеру ровно столько же пикселей)
               if (this._cloneContainer.width() < buttonWidth) {
                  this._cloneContainer.width(buttonWidth);
               }
               if (headElements.length === 0) {
                  this._prepareMenuHeader();
               } else {
                  headElements.removeClass('ws-hidden');
               }
               this._menuContent.addClass('ws-button-menu-content');
            }
         }
      },
      /**
       * Обработчик закрытия меню
       * @private
       */
      _onCloseMenu: function(){
         if(this._menuControl.isShow()){
            this._menuProcessed = false;
            $ws._const.$win.unbind('scroll.button' + this.getId());
            if(this._menuStyle === 'classic'){
               this._container.removeClass('ws-field-button-element-active');
               this._menuContent.removeClass('ws-button-menu-content');
               this._container.removeClass('ws-button-menu-header-content').find('.ws-header-element').addClass('ws-hidden');
               this._updateMenuClasses(false);
            }
            else{
               this._menuContent.children('.ws-menu-button-title').remove();
               if(this._menuContent.data('added-class')){
                  this._menuContent.removeClass('ws-menu-image-padding');
               }
            }
         }
      },
      /**
       * Подготавливает меню
       * @param menuControl
       * @returns {*}
       * @private
       */
      _prepareMenu: function(menuControl){
         this._menuControl = menuControl;
         this._initializeMenuContent();
         menuControl.subscribe('onOpen', this._menuOpenHandler = this._onMenuOpen.bind(this));
         menuControl.subscribe('onClose', this._menuCloseHandler = this._onCloseMenu.bind(this));
         menuControl.subscribe('onAfterRender', this._menuAfterRenderHandler = this._initializeMenuContent.bind(this));
         return menuControl;
      },
      _initializeMenuContent: function () {
         this._menuContent = this._menuControl.getContainer().find('.ws-main-menu');
      },
      /**
       * Ожидает меню, руководствуясь значение this._options.menu. Поддерживает как ownerName так и ID
       * @returns {$ws.proto.Deferred}
       * @private
       */
      _waitMenuInstance: function() {
         // меню передано как ownerName
         var parent = this.getTopParent();
         if (this._options.menu.indexOf('/') !== -1) {
            return parent.waitChildControlByName(this._options.menu.split('/').pop());
         } else {
            if(parent.hasChildControlByName(this._options.menu)){
               //если нам отдали имя, то отдадим сразу контрол
               return new $ws.proto.Deferred().callback(parent.getChildControlByName(this._options.menu));
            } else {
               // меню передано как ID
               return parent.waitChildControlById(this._options.menu);
            }
         }
      },
      /**
       * Инициализирует меню
       * @private
       */
      _initMenu: function() {

         var self = this;

         this._waitMenuInstance().addCallback(function(menu) {
            if ($ws._const.Button.initializedMenu[menu.getId()]) {
               $ws.single.ioc.resolve('ILogger').log(this._options.menu.split('/')[1] + ' (id: ' + menu.getId() + ')', "Данное меню уже привязано к другой кнопке");
            } else {
               this._menuMouseHandler = function(e) {
                  if (self._menuControl && self._menuControl.isShow instanceof Function && !self._menuControl.isShow()) {
                     $(this).toggleClass('ws-field-button-element-active', e.type == 'mousedown');
                  }
               };

               this._container.bind('mousedown mouseup mouseleave', this._menuMouseHandler);

               $ws._const.Button.initializedMenu[menu.getId()] = true;

               if(this._menuInitialized) {
                  return;
               }
               this._menuInitialized = true;

               this.subscribe('onActivated', this._menuToggleHandler = function() {
                  this._toggleSubMenu();
               }.bind(this));
               this.getContainer().attr('data-menu-id', this._options.menu);
               this._prepareMenu(menu);
            }
         }.bind(this));
      },
      _redraw : function(){
         $ws.proto.Button.superclass._redraw.apply(this, arguments);
         if(this._options.menu) {
            this._initMenu();
         }
      },
      _getTopParentContainer: function() {
         var topParent = this.getTopParent();
         if (topParent === this) {
            return $ws._const.$body;
         }
         return topParent.getContainer();
      },
      /**
       * Возвращает контейнер, от которого нужно рассчитывать отступ для меню
       * @returns {jQuery}
       * @private
       */
      _getOffsetContainer: function(){
         if (this._menuStyle === 'classic') {
            return this._container;
         }
         if (this._options.image) {
            return this._container.find('.ws-button-image');
         }
         return this._container.find('.ws-button-caption');
      },
      /**
       * Показывает / скрывает меню с указанным идентификатором
       * @private
       */
      _toggleSubMenu: function(){
         var container = this._container,
             self = this;
         if (this._menuStyle !== 'classic'){
            if (this._menuControl.isShow instanceof Function && !this._menuControl.isShow()) {
               this._prepareMenuTitle();
            }
            if(this._options.image && !this._menuContent.hasClass('ws-menu-image-padding')){
               this._menuContent.addClass('ws-menu-image-padding').data('added-class', true);
            }
         }
         this._menuContent.css('min-width', '');
         this._updateMenuClasses(true);
         this._waitMenuInstance().addCallback(function(menuControl) {
            var renderAsLink = self._options.renderStyle === 'asLink',
                buttonWidth = container.width() + (renderAsLink ? (self._drawAddButton ? 24 : 0) : $ws._const.Button.additionalMenuWidth),
                buttonImage = container.find('.ws-button-image'),
                hasImage = !!buttonImage.length;
            menuControl.getContainer().css('min-width', buttonWidth).toggleClass('menu-left-turn', self._drawAddButton);
            menuControl.getMenuUL().css('min-width', buttonWidth + (renderAsLink && !self._drawAddButton ? -$ws._const.Button.offsetLinkButton.left : 0));
            menuControl.setEnabled(this.isEnabled());
            menuControl.toggle(renderAsLink && hasImage ? buttonImage : container,
               this._drawAddButton ? $ws._const.Button.offsetAddButton : (renderAsLink ? 
                  (hasImage ? $ws._const.Button.offsetLinkButton : 
                     $ws._const.Button.offsetLinkButtonWithoutImage) : 
                  $ws._const.Button.offsetClassicButton),
               {
                  targetTop: renderAsLink && !this._drawAddButton,
                  targetLeft: !self._drawAddButton,
                  objectLeft: !self._drawAddButton
               },{
                  vertical: renderAsLink && !self._drawAddButton,
                  doFit: renderAsLink && !self._drawAddButton
               });
            return menuControl;
         }.bind(this));
      },
      destroy: function() {
         if (this._options.menu && $ws.helpers.instanceOfModule(this._menuControl, 'SBIS3.CORE.Menu')) {
            delete $ws._const.Button.initializedMenu[this._menuControl.getId()];
         }
         $ws.proto.Button.superclass.destroy.apply(this, arguments);
      },
      /**
       * Устанавливает меню для кнопки.
       * Можно передать пустую строку, чтобы снять меню.
       * <wiTag group="Управление">
       * @param {String|Control} menuId Идентификатор или сам контрол меню (или ничего).
       * Указанное меню должно обязательно иметь родителя и иметь с кнопкой общего верхнего родителя
       * @see getTopParent
       * @see $ws.proto.Menu
       * @example
       * <pre>
       *    $ws.core.attachInstance('SBIS3.CORE.Menu', {
       *       data: [],
       *       handlers : {
       *          onInit : function(){
       *             var btn = $ws.single.ControlStorage.getByName("myButton");
       *             btn.setMenu(this.getId());
       *          }
       *       }
       *    });
       * </pre>
       */
      setMenu: function(menuId){
         if(this._menuControl){
            this._menuControl.unsubscribe('onOpen', this._menuOpenHandler);
            this._menuControl.unsubscribe('onClose', this._menuCloseHandler);
         }
         if(this._menuInitialized){
            this.unsubscribe('onActivated', this._menuToggleHandler);
         }
         this._menuInitialized = false;
         this._menuContent = undefined;
         if (this._options.menu && $ws.helpers.instanceOfModule(this._menuControl, 'SBIS3.CORE.Menu')) {
            delete $ws._const.Button.initializedMenu[this._menuControl.getId()];
         }
         this._menuControl = undefined;
         if (!menuId) {
            this._container.unbind('mousedown mouseup mouseleave', this._menuMouseHandler);
         }
         this._options.menu = $ws.helpers.instanceOfModule(menuId, 'SBIS3.CORE.Menu') ? menuId.getId() : menuId;
         this._container.removeAttr('data-menu-id');
         this._container.toggleClass('ws-button-with-menu', !!menuId);
         if(menuId){
            this._initMenu();
         }
      },
      /**
       * Возвращает идентификатор привязанного меню
       * <wiTag group="Управление">
       * @example
       * <pre>
       *    var myBtn = $ws.single.ControlStorage.getByName("myButton");
       *    var otherBtn = $ws.single.ControlStorage.getByName("otherButton");
       *
       *    otherBtn.setMenu(myBtn.getMenu());
       * </pre>
       * @returns {string}
       */
      getMenu: function(){
         return this._options.menu;
      },
      /**
       * Возвращает инстанс контрола меню
       * <wiTag group="Управление">
       * @returns {$ws.proto.Menu}
       */
      getMenuControl: function(){
         return this._menuControl;
      },
      _setEnabled : function(enable){
         if ($ws.helpers.instanceOfModule(this._menuControl, 'SBIS3.CORE.Menu')) {
            this._menuControl.setEnabled(enable);
         }
         $ws.proto.Button.superclass._setEnabled.apply(this, arguments);
      },
      /**
       * Подготавливает шапку меню и вставляет ее в контейнер-копию кнопки
       * @private
       */
      _prepareMenuHeader: function(){
         var width = this.getContainer().width(),
             diff = MENU_HEAD_RIGHT_WIDTH/2;
         this._cloneContainer.prepend([
            '<div class="ws-header-element ws-button-menu-header-left"></div>',
            '<div style="width:'+ (width - MENU_HEAD_LEFT_WIDTH - diff) +'px;" class=" ws-header-element ws-button-menu-header-center"></div>',
            '<div class="ws-header-element ws-button-menu-header-right"></div>'
         ].join(''));
         this._cloneContainer.toggleClass('ws-add-button-menu', this._options.renderStyle === 'asLink' && this._drawAddButton);
      }
   });

   return $ws.proto.Button;

});
