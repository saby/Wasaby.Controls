/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 10:50
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.ToolBar', ['js!SBIS3.CORE.AreaAbstract', 'html!SBIS3.CORE.ToolBar', 'js!SBIS3.CORE.Menu', 'js!SBIS3.CORE.Button', 'js!SBIS3.CORE.FloatArea',
   'css!SBIS3.CORE.ToolBar', 'is!browser?js!Ext/jquery-ui/jquery-ui-position'], function( AreaAbstract, dotTplFn, Menu, Button, FloatArea ) {

   'use strict';

   $ws._const.Toolbar = {
      menuOffsetDefault: { left: 0, top: 0 }, //Отступ от кнопки открытия меню при стиле рендера "default"
      menuOffsetDocument: { left: 5, top: -5}, //Отступ от кнопки открытия меню при стиле рендера "document"
      menuOffsetTransfer: { left: 1, top: -5}, //Отступ от кнопки открытия меню при стиле рендера "transfer"
      menuOffsetExtended: { x: 5, y: -4}, //Отступ от кнопки открытия меню при стиле рендера "transfer" и меню по шаблону
      iconSize: '16px', //Размер иконки в тулбаре
      menuItemHeight: 32 //Высота пункта меню тулбара
   };

   //Стиль рендера "по умолчанию"
   var TBSTYLE_DEFAULT = 0,
   //Стиль рендера "документ"
       TBSTYLE_DOCUMENT = 1,
   //Стиль рендера "кнопки перехода"
       TBSTYLE_TRANSFER = 2;

   /**
    * Тулбар (панель инструментов)
    *
    * @class $ws.proto.ToolBar
    * @extends $ws.proto.AreaAbstract
    * @control
    */
   $ws.proto.ToolBar = AreaAbstract.extend(/** @lends $ws.proto.ToolBar.prototype */{
      /**
       * @event onBeforeLoad Перед загрузкой кнопок тулбара
       * Событие, возникающее перед загрузкой кнопок панели инструментов.
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @example
       * <pre>
       *    toolBar.subscribe('onBeforeLoad', function() {
       *    loadingIndicator.show();
       *    });
       * </pre>
       */
      /**
       * @event onAfterLoad После загрузки кнопок тулбара
       * Событие, возникающее после загрузки кнопок тулбара.
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @example
       * <pre>
       *    toolBar.subscribe('onAfterLoad', function() {
       *    loadingIndicator.hide();
       *    });
       * </pre>
       */
      /**
       * @event onButtonAdded При добавлении кнопки
       * Событие, возникающее при добавлении кнопки на панель инструментов.
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {$ws.proto.Button} button - созданная кнопка.
       * @example
       * <pre>
       *    var counter = 0;
       *    toolBar.subscribe('onButtonAdded', function(event, button) {
       *       button.subscribe('onActivated', function() {
       *          if (++counter === 5) {
       *             toolBar.setEnabled(false);
       *          }
       *       });
       *    });
       *
       * </pre>
       */
      $protected : {
         _menuReady: undefined,           //Deferred готовности меню
         _buttonsCounter: 0,              //Счётчик количества кнопок: испрользуется для просчёта идентификатора новой кнопки
         _separators : [],                //Массив с разделителями
         _menu: undefined,                //Контрол меню с кнопками
         _menuButton: undefined,          //Кнопка открытия меню
         _menuHideButton: undefined,      //Кнопка открытия меню
         _toolbarBlock: undefined,        //Блок, содержащий в себе кнопки
         _toolbarExtendedMenu: undefined, //Расширенное меню (построенное по шаблону)
         _toolbarMenuArea: undefined,     //Контрол, который используется в качестве меню
         _defaultButton: undefined,       //Кнопка по-умолчанию (используется для стиля "Кнопки перехода"
         _menuWidth: 0,                   //Ширина меню
         _toolbarStyle: 0,                //Стиль панели инструментов (TBSTYLE_DEFAULT, TBSTYLE_DOCUMENT или TBSTYLE_TRANSFER)
         _options : {
            /**
             * @cfg {String} Вид панели инструментов
             * <wiTag group="Отображение">
             * Возможные значения:
             * <ul>
             *    <li>'document' - режим "Документ": списки кнопок на панели и в выпадающем меню совпадают, при создании скрыть кнопку можно только с панели;</li>
             *    <li>'transfer' - режим "Кнопки перехода": в выпадающем меню список кнопок создаётся отдельно, а не дублируется с панели инструментов; все кнопки с текстом.</li>
             * </ul>
             * @see btnCfg
             * @see subBtnCfg
             * @see subMenuTemplate
             */
            renderStyle: '',
            /**
             * @typedef {Object} Button
             * @property {String} id
             * @property {String} name
             * @property {String} img
             * @property {String} tooltip
             * @property {Boolean} displayCaption
             * @property {Boolean} visible
             * @property {Boolean} inMenu
             * @property {Object} handlers
             */
            /**
             * @cfg {Button[]} Конфиг для всего набора кнопок
             * <wiTag group="Данные">
             * Массив конфигов для каждой отдельной кнопки панели инструментов.
             * В описании каждой кнопки могут быть следующие параметры:
             * <ol>
             *    <li>id - уникальный идентификатор;</li>
             *    <li>name - имя, может совпадать с идентификатором;</li>
             *    <li>img - иконка вида 'sprite:icon-24 icon-DocumentTerm icon-primary', размер 24px;</li>
             *    <li>tooltip - текст всплывающей подсказки, этот же текст будет у кнопки, если не задать caption;</li>
             *    <li>caption - текст на кнопке;</li>
             *    <li>displayCaption - отображать ли текст у кнопки, для режима "Документ";</li>
             *    <li>visible - показана ли кнопка;</li>
             *    <li>handlers - список команд для кнопки, только onActivated;</li>
             *    <li>inMenu - в меню ли кнопка, для режима "Кнопки перехода".</li>
             * </ol>
             * @example
             * <pre>
             * btnCfg: [
             *    {
             *       //идентификатор кнопки
             *       id: 'btn1',
             *
             *       //имя кнопки
             *       name: 'btn1',
             *
             *       //иконка
             *       img: 'sprite:icon-24 icon-DocumentTerm icon-primary',
             *
             *       //текст подсказки
             *       tooltip: 'Кнопка 1',
             *
             *       //видимость кнопки на панели
             *       visible: false,
             *
             *       //отображать ли текст у кнопки
             *       displayCaption: false,
             *
             *       //команда для кнопки
             *       handlers: {
             *          onActivated: function(){
             *             $ws.core.alert('Вы нажали на кнопку Btn1');
             *          }
             *       }
             *    },
             *    {
             *       id: 'btn2',
             *       name: 'btn2',
             *       img: 'sprite:icon-24 icon-Attach icon-primary',
             *       tooltip: 'Кнопка 2',
             *       visible: true,
             *       displayCaption: true,
             *       handlers: {
             *          onActivated: function(){
             *             $ws.core.alert('Вы нажали на кнопку Btn2');
             *          }
             *       }
             *    },
             *    {
             *       id: 'btn3',
             *       name: 'btn3',
             *       img: 'sprite:icon-24 icon-Print icon-primary',
             *       tooltip: 'Печать',
             *       visible: true,
             *       displayCaption: true,
             *       handlers: {
             *          onActivated: function(){
             *             $ws.core.alert('Вы нажали на кнопку Btn3');
             *          }
             *       }
             *    }
             * ]
             * </pre>
             * @see subBtnCfg
             * @see buttonsSide
             * @see toggleButton
             * @see addButton
             */
            btnCfg : [],
             /**
              * @cfg {Array} Массив с набором кнопок меню
              * <wiTag group="Данные">
              * Опция актуальна только для режима "Кнопки перехода".
              * Массив с набором кнопок, которые нужно отобразить в меню.
              * В режиме "Документ" в меню попадут все кнопки и разделители. Т. е. даже если какая-то кнопка скрыта, то
              * в меню будет отображён список всех кнопок.
              * @see renderStyle
              * @see btnCfg
              * @see toggleMenuButton
              * @see toggleButton
              */
            subBtnCfg: [],
             /**
              * @cfg {$ws.proto.TemplatedArea} Шаблон меню для стиля "Кнопки перехода"
              * <wiTag group="Данные">
              * В данной опции указывается имя шаблона меню, если оно строится не из кнопок.
              * @see subBtnCfg
              * @see toggleMenuButton
              */
            subMenuTemplate: null,
            /**
             * @cfg {String} Позиция кнопок внутри тулбара
             * <wiTag group="Отображение">
             * Возможные значения:
             * <ol>
             *    <li>left - слева;</li>
             *    <li>right - справа.</li>
             * </ol>
             */
            buttonsSide: 'left',
             /**
              * @cfg {String} Позиция тулбара
              * <wiTag noShow>
              * Позиция тулбара, только 'top' или 'bottom', 'right' или 'left'
              * @deprecated с 3.5 не использовать: панель инструментов теперь только сверху
              */
            position: 'top',
             /**
              * @cfg {String} Позиция по вертикали
              * <wiTag group="Отображение">
              * Возможные значения:
              * <ol>
              *    <li>top - зафиксирована сверху;</li>
              *    <li>bottom - зафиксирована внизу;</li>
              *    <li>none - не фиксирована, какие координаты указали, там и находится (как отступ сверху).</li>
              * </ol>
              * @see horizontalPosition
              */
            verticalPosition: 'none',
             /**
              * @cfg {String} Позиция по горизонтали
              * <wiTag group="Отображение">
              * Возможные значения:
              * <ol>
              *    <li>left - зафиксирована слева;</li>
              *    <li>right - зафиксирована справа;</li>
              *    <li>none - не фиксирована, какие координаты указали, там и находится (как отступ слева).</li>
              * </ol>
              * @see verticalPosition
              */
            horizontalPosition: 'none',
            /**
             *@cfg {Boolean} Относительной ли вёрсткой создан шаблон
             * <wiTag group="Данные">
             * Шаблон может быть создан относительной или абсолютной вёрсткой.
             * Для тулбара по умолчанию стоит значение true, и ресайз не требуется.
             * Свойство требуется только разработчикам.
             */
            isRelativeTemplate: true
         }
      },
      $constructor: function(cfg) {
         var
            configButtons = $ws.helpers.type(cfg.buttons) === 'array',
            arrayButtons = configButtons ? cfg.buttons : this._options.btnCfg,
            image,
            spriteText,
            spriteTextLength,
            sizeInfo;

         this._publish('onBeforeLoad', 'onAfterLoad', 'onActivate', 'onButtonAdded');

         this._menuReady = new $ws.proto.Deferred();

         this._toolbarStyle = this._options.renderStyle === 'document' ? TBSTYLE_DOCUMENT :
            this._options.renderStyle === 'transfer' ? TBSTYLE_TRANSFER : TBSTYLE_DEFAULT;

         if (this._toolbarStyle === TBSTYLE_DOCUMENT) {
            $ws.helpers.forEach(arrayButtons, function(button) {
               image = button.img;
               if (typeof image === 'string' && image.length) {
                  spriteText = 'sprite:icon-';
                  spriteTextLength = spriteText.length;
                  sizeInfo = image.indexOf(spriteText);
                  if (sizeInfo !== -1 && image.slice(spriteTextLength, 2) !== '24') {
                     button.img = spriteText + '24' + image.slice(spriteTextLength + 2, image.length);
                  }
               }
               //Если конфигурация кнопок передана через конструктор, то дублируем её в btnCfg
               configButtons && this._options.btnCfg.push($ws.core.clone(button));
               this._options.subBtnCfg.push($ws.core.clone(button));
            }, this);
         } else if (this._toolbarStyle === TBSTYLE_TRANSFER) {
            for (var i = 0, button; i < arrayButtons.length; i++) {
               button = arrayButtons[i];
               if (button.inMenu) {
                  this._options.subBtnCfg.push(button);
                  if (button.handlers) {
                     this._options.subBtnCfg.handlers = button.handlers;
                  }
                  //Если конфигурация из options.btnCfg - то не забываем удалить этот элемент от туда
                  if (!configButtons) {
                     arrayButtons.splice(i, 1);
                     i -= 1;
                  }
               } else if (configButtons) {
                  this._options.btnCfg.push(button);
                  if (button.handlers) {
                     this._options.btnCfg.handlers = button.handlers;
                  }
               }
            }
         } else if (configButtons) {
            this._options.btnCfg = cfg.buttons.slice();
         }
         var additionClass = this._toolbarStyle === TBSTYLE_DEFAULT ? this._options.position :
                             'size-24px' + (this._toolbarStyle === TBSTYLE_TRANSFER ? ' transfer-style': '');
         this._container.addClass('ws-toolbar ' + additionClass).removeClass('ws-area');
         this._toolbarBlock = $('<div class="ws-toolbar-block"></div>').appendTo(this._container);
         if (this._toolbarStyle != TBSTYLE_DEFAULT) {
            this._container.css('width', 'auto');
            if (this._options.horizontalPosition !== 'none') {
               this._container.css({ 'position': 'relative',
                                     'float': this._options.horizontalPosition //слева или справа
                                  });
            }
            if (this._options.verticalPosition !== 'none') {
               this._container.css({ 'top': this._options.verticalPosition === 'top' ? '0px' : '',
                                     'bottom': this._options.verticalPosition === 'bottom' ? '0px' : ''
                                  });
            } else {
               //Удаляем свойства элемента, заданные КОДОМ (по другому свойства не удаляются!)
               this._container.css({ 'top': '',
                  'bottom': '',
                  'left': '',
                  'right': ''
               });
               this._toolbarBlock.css((this._options.horizontalPosition !== 'none' ? this._options.horizontalPosition : this._options.buttonsSide), '0');
            }
         } else if (this._options.position === 'top' || this._options.position === 'bottom') {
            this._toolbarBlock.css(this._options.buttonsSide, '0');
         }
         this._buttonsCounter = this._options.btnCfg.length;
         this._addMenuButton(this._options.btnCfg);
         this._notify('onBeforeLoad');
         this._draw(this._options.btnCfg);
         this._buildMenu();
      },
      _dotTplFn: dotTplFn,

      /**
       * Глушим функцию _loadDescendents, поскольку вся инициализация дочерних контролов происходит в конструкторе
       * @private
       */
      _loadDescendents: function() {},

      /**
       * Глушим функцию _childrenLoadCallback, поскольку вся инициализация дочерних контролов происходит в конструкторе
       * @private
       */
      _childrenLoadCallback: function() {},

      /**
       * Вычисляем дополнительный класс для стиля отображения "кнопки перехода"
       * @private
       */
      _getAdditionalClass: function (pos) {
         if (pos === 0) {
            return 'ws-toolbar__transfer-button-first';
         } else if (pos >= this._getLastButtonNumber()) { //если позиция больше/равна позиции последней кнопки
               return 'ws-toolbar__transfer-button-last';
         } else {
            return 'ws-toolbar__transfer-button-middle';
         }
      },

      /**
       * Метод отрисовки всего тулбара
       * @param {Array} buttons Массив с конфигом кнопок
       */
      _draw: function (buttons){
         var self = this;
         this._dChildReady.push(this._menuReady);
         for (var i = 0, l = buttons.length; i < l; i++){
            if (Object.isEmpty(buttons[i])) {
               this.addSeparator();
            } else {
               var btnDiv = $('<div></div>'),
                   btnCfg = $.extend({}, buttons[i], {
                                                        element: btnDiv,
                                                        parent: this,
                                                        textAlign: 'left',
                                                        renderStyle: this._toolbarStyle === TBSTYLE_TRANSFER ? undefined: 'asLink',
                                                        autoWidth: true,
                                                        caption: this._toolbarStyle === TBSTYLE_TRANSFER ||
                                                                 this._toolbarStyle === TBSTYLE_DOCUMENT && buttons[i].displayCaption ? buttons[i].tooltip : '',
                                                        displayCaption: this._toolbarStyle === TBSTYLE_DOCUMENT && buttons[i].displayCaption === true || true,
                                                        imgAlign: 'left',
                                                        isRelative: true,
                                                        width: '100%'
                                                     });
               this._toolbarBlock.append(btnDiv);
               if (this._toolbarStyle === TBSTYLE_TRANSFER && !btnCfg.menuButton) {
                  btnCfg.className = this._getAdditionalClass(i);
               }
               this._drawButton(btnCfg, buttons[i].tooltip);
            }
         }
         this._dChildReady.done().getResult().addCallback(function(){
            self._notify('onAfterLoad');
            self._notify('onReady');
         }).addCallback(function(){
            if (self._toolbarStyle === TBSTYLE_TRANSFER) {
               self._toggleDefaultClassMenuButton();
            }
         });
      },
       /**
        * <wiTag group="Управление">
        * Скрыть/показать кнопку вызова меню.
        * @param {Boolean} visible Видимость кнопки вызова меню.
        * Возможные значения:
        * <ol>
        *    <li>true - показать;</li>
        *    <li>false - скрыть.</li>
        * </ol>
        * @example
        * По готовности меню скрыть кнопку его вызова:
        * <pre>
        *     var a = this.getChildControlByName('Тулбар');
        *     a.getMenuReady().addCallback(function() {
        *        a.toggleMenuButton(false);
        *     });
        * </pre>
        * @see subMenuTemplate
        * @see subBtnCfg
        * @see btnCfg
        * @see setButtonEnabled
        */
      toggleMenuButton: function(visible) {
         visible = !!visible;
         if (this._menuButton instanceof $) {
            var menuHidden = !this._menuButton || !visible;
            this._container.toggleClass('hide-menu-button', menuHidden);
            this._menuButton.toggleClass('ws-hidden', !visible);
            this._options.btnCfg[this._options.btnCfg.length - 1].visible = visible;
            if (this._toolbarStyle === TBSTYLE_TRANSFER) {
               this._toggleNewClasses(visible, this._options.btnCfg.length - 1);
            }
         }
      },
      _getChildContainer: function(id) {
         var result = this.getButton(id);
            if (result instanceof $ws.proto.Button) {
               result = result.getContainer();
            }
         return result;
      },
      /**
       * Расчитывает и применяет классы к скрываемой/отображаемой (удаляемой/добавляемой) кнопке, а также к кнопкам слева и справа от неё
       * @private
       */
      _toggleNewClasses: function(visible, btnPos) {
         var leftButton,
             thisButton,
             hasOwnerButton,
             rightButton,
             foundButton,
             foundButtonCfg,
             btnCfg = this._options.btnCfg,
             _toggleFirstMiddleLast = function(btn) {
                                         if (btn && btn.container) {
                                            btn.container.toggleClass('ws-toolbar__transfer-button-last', btn.weight === 1)
                                                         .toggleClass('ws-toolbar__transfer-button-first', btn.weight === 2)
                                                         .toggleClass('ws-toolbar__transfer-button-middle', btn.weight === 3);
                                         }
                                      };
         foundButton = this._getFirstVisibleButton(btnPos, true, true);
         foundButtonCfg = btnCfg[foundButton];
         if (foundButton >= 0) { //Если нашли кнопку левее позиции обрабатываемой кнопки
            leftButton = {
               container: this._getChildContainer(foundButtonCfg.id),
               weight: this._getFirstVisibleButton(foundButton, true, true) < 0 ? 0 : 1
            };
         }
         foundButton = this._getFirstVisibleButton(btnPos, false, true);
         foundButtonCfg = btnCfg[foundButton];
         if (foundButton >= 0) { //Если нашли кнопку правее позиции обрабатываемой кнопки
            rightButton = {
               container: foundButtonCfg.menuButton ? this._menuButton : this._getChildContainer(foundButtonCfg.id),
               weight: this._getFirstVisibleButton(foundButton, false, true) < 0 ? 0 : 2
            };
            if (leftButton) {
               leftButton.weight += 2;
               rightButton.weight += 1;
            }
         }
         if (visible) { //Если мы показали обрабатываемую кнопку
            if (rightButton && !leftButton) {
               rightButton.weight += 1;
            }
            if (leftButton && !rightButton) {
               leftButton.weight += 2;
            }
            thisButton = {
               container: this._getChildContainer(btnCfg[btnPos].id),
               weight: 0 + (leftButton ? 1 : 0) + (rightButton ? 2 : 0)
            };
            _toggleFirstMiddleLast(thisButton);
         }
         _toggleFirstMiddleLast(leftButton);
         _toggleFirstMiddleLast(rightButton);
         //Есть ли другие кнопки? + тогглим в зависимости от этого класс "ws-toolbar__transfer-button-one"
         hasOwnerButton = (leftButton && leftButton.weight !== 0 ? 1 : 0) + (thisButton && thisButton.weight !== 0 ? 1 : 0) + (rightButton && rightButton.weight !== 0 ? 1 : 0);
         this._container.toggleClass('ws-toolbar__transfer-button-one', hasOwnerButton === 0);
      },

      /**
       * Функция вешает/снимает класс ws-default-button у кнопки меню (в зависимости от того, какая кнопка перед ней)
       */
      _toggleDefaultClassMenuButton: function() {
         if (this._menuButton instanceof $) { //Тогглим классы, только если кнопка реально существует
            var x = this._getLastButtonNumber(),
                isDefault = false;
            if (x >= 0) {
               var lastButton = this.getButton(this._options.btnCfg[x].id);
               if (lastButton) {
                  isDefault = lastButton.isDefaultButton();
               }
            }
            this._menuButton.toggleClass('ws-default-button', isDefault);
            if (this._menuHideButton instanceof $) {
               this._menuHideButton.toggleClass('ws-default-button', isDefault);
            }
         }
      },

      /**
       * <wiTag group="Управление">
       * Скрыть/показать указанную кнопку.
       * @param {String} name - Имя скрываемой/отображаемой кнопки.
       * @param {Boolean} visible - Скрыть/показать.
       * @param {Boolean} [inMenu] - Если нет этого параметра, то скрывать/отображать и на панели, и в меню.
       * Если false - только на панели, если true - только в и меню.
       * @example
       * По готовности меню скрыть указанную кнопку:
       * <pre>
       *     var a = this.getChildControlByName('Тулбар');
       *     a.getMenuReady().addCallback(function() {
       *        //скрываем кнопку с именем btn1
       *        a.toggleButton('btn1', false, inMenu);
       *     });
       * </pre>
       * @see toggleMenuButton
       * @see btnCfg
       * @see setButtonEnabled
       */
      toggleButton: function(name, visible, inMenu) {
         if (inMenu !== true) {
            var tbItem = this.getButton(name);
            if (tbItem) {
               var btnPos = this._getButtonNumberByName(name),
                   btnConfig = this._options.btnCfg[btnPos];
               tbItem.toggle(visible);
               btnConfig.visible = visible === undefined ? !btnConfig.visible : !!visible;
               if (this._toolbarStyle === TBSTYLE_TRANSFER) {
                  this._toggleNewClasses(btnConfig.visible, btnPos);
                  this._toggleDefaultClassMenuButton();
               }
            }
         }
         if (inMenu !== false && this._menu) {
            this._menu.toggleItem(name, visible);
         }
      },
      /**
       * <wiTag group="Управление">
       * Сделать указанную кнопку активной/неактивной.
       * @param {String} name - Имя кнопки.
       * @param {Boolean} enable - Активная(true)/неактивная(false).
       * @param {Boolean} [inMenu] - Если этого параметра нет, то сделать активной/неактивной и на панели, и в меню.
       * Если false - только на тулбаре, если true - только в меню тулбара.
       * @example
       * По готовности меню сделать указанную кнопку неактивной:
       * <pre>
       *     var a = this.getChildControlByName('Тулбар');
       *     a.getMenuReady().addCallback(function() {
       *        //делаем кнопку с именем btn1 неактивной как на панели, так и в меню
       *        a.setButtonEnabled('btn1', false);
       *     });
       * </pre>
       * @see btnCfg
       * @see toggleButton
       */
      setButtonEnabled: function(name, enable, inMenu) {
         if (inMenu !== false) {
            this.getMenu().setItemEnabled(name, enable);
         }
         if (inMenu !== true) {
            var tbItem = this.getButton(name);
            if (tbItem) {
               tbItem.setEnabled(enable);
            }
         }
      },
      /**
       * Добавляет кнопку для показа меню
       * @param {Array}    list     Список кнопок, куда нужно добавить эту
       */
      _addMenuButton: function(list) {
         var self = this;
         this._hideExtendedMenu = function(e) {
            //TODO hotfix для 3.6.2.20 если кликнули в браузер автодополнение, нельзя скрывать меню. выглядит не очень
            var window = self._toolbarExtendedMenu,
               target = $(e.target),
               suggestParent,
               wsControl,
               topParent,
               opener,
               childParent;
            if (!target.closest('.ui-datepicker').length && !target.closest(window)[0]) {
               suggestParent = target.parents('.ws-suggest-browser')[0];
               wsControl = target.wsControl && target.wsControl();
               topParent = wsControl && wsControl.getTopParent();
               opener = topParent && topParent.getOpener();
               childParent = opener && opener.getContainer().closest(window)[0];
               if (!childParent && !suggestParent) {
                  this._toolbarMenuArea.hide();
                  $(document).unbind('mousedown', this._hideExtendedMenu);
               }
            }
         }.bind(this);
         if (!this._menuButton) {
            this._menuButton = true;
         }
         list.push({
                      id: this.getName()+'-menu-button',
                      name: this.getName()+'-menu-button',
                      menuButton: true,
                      tooltip: this._toolbarStyle === TBSTYLE_DOCUMENT ? 'Дополнительные фазы и операции' :
                               this._toolbarStyle === TBSTYLE_TRANSFER ? 'Дополнительные операции' :
                                                                         'Открыть меню с дополнительными командами',
                      image: $ws._const.wsRoot + 'img/toolbar/menu.png',
                      handlers: {
                         'onActivated': $.proxy(self._showMenu, self)
                      },
                      visible: true
                   });
      },
      /**
       *
       * @param {Object} objToolbar - объект меню
       */
      _createHideMenuButton: function() {
         if (this._toolbarStyle === TBSTYLE_DOCUMENT || this._toolbarStyle === TBSTYLE_TRANSFER) {
            var menu = this._menu,
                menuUL = menu.getMenuUL();
            menuUL.addClass('has-hide-menu-button');
            this._menuHideButton = $('<div class="ws-toolbar-menu-button-24px' + (this._toolbarStyle === TBSTYLE_TRANSFER ? ' transfer-style': '') + ' open" title="Свернуть меню"></div>')
               .bind('click', function(){
                  menu.hide();
               }.bind(this));
            menuUL.append(this._menuHideButton);
            if (this._toolbarStyle === TBSTYLE_TRANSFER) {
               this._toggleDefaultClassMenuButton();
            }
         }
      },

      /**
       * Отображает/скрывает меню тулбара, построенное по шаблону
       * @private
       */

      _toggleExtendedMenu: function() {
         if (this._toolbarMenuArea.isVisible()) {
            $(document).unbind('mousedown', this._hideExtendedMenu);
            this._menuHideButton.unbind('click');
            this._toolbarMenuArea.hide();
         } else {
            this._toolbarMenuArea.show();
            this._menuHideButton.toggleClass('short-style', parseInt(this._menuButton.width(), 10) <= 24); //Если маленькая кнопка меню, то вешаем класс short-style
            $(document).bind('mousedown', this._hideExtendedMenu);
         }
      },

      /**
       * Показывает меню тулбара
       */
      _showMenu: function() {
         if ((this._toolbarStyle === TBSTYLE_TRANSFER || this._toolbarStyle === TBSTYLE_DOCUMENT) && this._options.subMenuTemplate) {
            var self = this;
            if (!this._toolbarExtendedMenu) {
               this._menuReady.addCallback(function() {
                  self._toggleExtendedMenu();
               });
               this._buildMenu();
            } else {
               this._toggleExtendedMenu();
            }
         } else {
            if (!this._menu) {
               this._buildMenu();
            } else {
               var toolbarContainer = this._container,
                   offset = toolbarContainer.offset(); //Получаем отступы тулбара
               this._container.trigger('mousedown'); //Вызываем mousedown
               var toolbarWidth = this._container.outerWidth();
               //Расчет горизонтальной и вертикальной координат
               offset.left += toolbarWidth;
               offset.top -= this._toolbarStyle !== TBSTYLE_DEFAULT ? $ws._const.Toolbar.menuOffsetDocument.top : 0;
               if (this._toolbarStyle === TBSTYLE_DOCUMENT) { //Для стиля "документ" перекрываем тулбар контейнером меню
                  this._menu.getContainer().css('minWidth', toolbarWidth); //Устанавливаем ширину и для контейнера тулбара
                  this._menu.getMenuUL().css('minWidth', toolbarWidth);
               } else if (this._toolbarStyle === TBSTYLE_DEFAULT) { //Для стиля "по-умолчанию" увеличиваем верхний отступ
                  offset.top += $ws._const.Toolbar.menuOffsetDefault.top;
               }
               this._menu.show(this._menuButton,
                  this._toolbarStyle === TBSTYLE_DOCUMENT || (this._toolbarStyle === TBSTYLE_TRANSFER && this._container.hasClass('ws-toolbar__transfer-button-one')) ?
                     $ws._const.Toolbar.menuOffsetDocument :
                        this._toolbarStyle === TBSTYLE_TRANSFER ?
                           $ws._const.Toolbar.menuOffsetTransfer :
                              $ws._const.Toolbar.menuOffsetDefault, //Задаём оступы для разворота меню
                  this._toolbarStyle !== TBSTYLE_DEFAULT ? //Разворачиваем меню влево, если стиль не "по-умолчанию"
                     {
                        objectLeft: false,
                        targetLeft: false
                     } : //Иначе - верхнюю границу меню прикрепляем к нижней границе тулбара
                     {
                        targetTop: false
                     });
            }
         }
      },
      /**
       * Строит меню
       * @private
       */
      _buildMenu: function() {
         var self = this;
         if ((this._toolbarStyle === TBSTYLE_TRANSFER || this._toolbarStyle === TBSTYLE_DOCUMENT) && this._options.subMenuTemplate) {
            this.toggleMenuButton(true);
            this._menuReady.addCallback(function() {
               self._menuHideButton = $('<div class="ws-toolbar-menu-button-24px transfer-style open" title="Свернуть меню"></div>').bind('click', function() {
                  self._toolbarMenuArea.hide();
                  $(document).unbind('mousedown', self._hideExtendedMenu);
               });
               self._toolbarExtendedMenu.prepend(self._menuHideButton);
               self._toggleDefaultClassMenuButton();
            });
            //Строим меню по шаблону
            this._toolbarMenuArea = new FloatArea({
               id: this.getId() + '-menuControl',
               border: false,
               autoShow: false,
               template: self._options.subMenuTemplate,
               animation: 'off',
               autoWidth: true,
               autoHeight: true,
               parent: this,
               opener: this,
               target: self._menuButton,
               direction: 'left',
               side: 'right',
               offset: $ws._const.Toolbar.menuOffsetExtended,
               visible: false,
               handlers: {
                  onReady: function() {
                     self._toolbarExtendedMenu = this.getContainer();
                     if (!self._menuReady.isReady()) {
                        self._menuReady.callback();
                     }
                  }
               }
            });
         } else {
            var rows = [];
            for (var i = 0, len = this._options.subBtnCfg.length; i < len; ++i) {
               var buttonConfig = this._options.subBtnCfg[i],
                   rowConfig = {
                                 caption: buttonConfig.caption ? buttonConfig.caption : buttonConfig.tooltip,
                                 imgSrc: buttonConfig.img,
                                 id: buttonConfig.name || $ws.helpers.randomId(),
                                 renderStyle : buttonConfig.renderStyle
                               };
               if (buttonConfig.handlers && buttonConfig.handlers.onActivated) {
                  rowConfig.handlers = {
                     'onActivated': buttonConfig.handlers.onActivated
                  };
               }
               rows.push(rowConfig);
            }
            this._menu = $('<div class="ws-toolbar-menu' + (this._toolbarStyle !== TBSTYLE_DEFAULT ? ' menu-left-turn item-height-32px' : '') + '"></div>').appendTo(document.body);
            var instance = new Menu({
               id: this.getId() + '-menuControl',
               data: rows,
               element: this._menu,
               parent: this,
               handlers: {
                  onReady: function(){
                     self._menuReady.addCallback(function(event) {
                        self._createHideMenuButton();
                        return event;
                     });
                     self._menuReady.callback(self._menu = this);
                     self.toggleMenuButton(self._options.subBtnCfg.length > 0 || self._options.subMenuTemplate);
                  }
               }
            });
         }
      },
      /**
       * <wiTag group="Данные">
       * Получить меню.
       * @returns {*} Возвращает меню или TemplatedArea - когда опция {@link renderStyle} выставлена 'transfer' и меню создано по шаблону.
       * @example
       * <pre>
       *     var a = this.getChildControlByName('Тулбар');
       *     var buttons_menu = a.getMenu(),
       *         menuId = buttons_menu.getId();
       * </pre>
       * @see subBtnCfg
       * @see subMenuTemplate
       * @see getMenuReady
       */
      getMenu: function(){
         if ((this._toolbarStyle === TBSTYLE_TRANSFER || this._toolbarStyle === TBSTYLE_DOCUMENT) && this._options.subMenuTemplate && this._toolbarMenuArea) {
            return this._toolbarMenuArea;
         } else {
            return this._menu;
         }
      },
      /**
       * <wiTag group="Управление">
       * Получить Deferred с готовностью меню.
       * @returns {$ws.proto.Deferred|*}
       * @example
       * По готовности меню скрыть кнопку его вызова:
       * <pre>
       *     var a = this.getChildControlByName('Тулбар');
       *     //дождёмся готовности меню
       *     a.getMenuReady().addCallback(function() {
       *        a.toggleMenuButton(false);
       *     });
       * </pre>
       * @see subBtnCfg
       * @see subMenuTemplate
       * @see getMenu
       */
      getMenuReady: function(){
         return this._menuReady;
      },
      /**
       * <wiTag group="Управление">
       * Задать кнопку "по умолчанию".
       * Одновременно может быть задана лишь одна кнопка.
       * При наличии в тулбаре кнопки "по умолчанию" кнопка вызова меню тоже будет оранжевой.
       * @param {String} defButton Идентификатор кнопки.
       * @param {Boolean} [value]  При значении false - убирает у кнопки вид "по умолчанию".
       * @example
       * При готовности меню задать кнопку btn3 "по умолчанию":
       * <pre>
       *     var a = this.getChildControlByName('Тулбар');
       *     a.getMenuReady().addCallback(function() {
       *        //делаем btn3 кнопкой "по умолчанию"
       *        a.setDefaultButton('btn3', true);
       *     });
       * </pre>
       * @see btnCfg
       * @see subBtnCfg
       */
      setDefaultButton: function (defButton, value) {
         if (this._toolbarStyle === TBSTYLE_TRANSFER) {
            var
               newDefButton = defButton instanceof $ws.proto.Button ? defButton :
                              typeof defButton === 'string' && defButton.length > 0 ? this.getButton(defButton) :
                              undefined,
               topParent,
               parentDefButton;
            if (newDefButton) {
               topParent = this.getTopParent();
               //Если у topParent уже есть дефолтная кнопка - запоминаем её родителя
               parentDefButton = topParent._defaultButton instanceof $ws.proto.Button && topParent._defaultButton.getParent && topParent._defaultButton.getParent();
               if (value !== false) {
                  if (this._defaultButton instanceof $ws.proto.Button) {
                     this._defaultButton.setDefaultButton(false);
                     topParent.unregisterDefaultButton(this._defaultButton);
                  }
                  this._defaultButton = newDefButton;
                  topParent.registerDefaultButton(this._defaultButton);
                  this._defaultButton.setDefaultButton(true);
               } else {
                  if (newDefButton == this._defaultButton) {
                     this._defaultButton = undefined;
                  }
                  newDefButton.setDefaultButton(false);
                  topParent.unregisterDefaultButton(newDefButton);
               }
               this._toggleDefaultClassMenuButton();
               //Если родитель старой кнопки - тулбар, то посылаем ему команду переключения дефолтных классов
               if (parentDefButton instanceof $ws.proto.ToolBar) {
                  parentDefButton._toggleDefaultClassMenuButton();
               }
            }
         }
      },
      /**
       * Отрисовка кнопки по параметрам.
       * @param {Object} btnCfg Конфигурационные параметры для кнопки
       * @param {String} btnTooltip Необязательный параметр "подсказка"
       * @return {$ws.proto.Deferred} событие, стреляющее по готовности кнопки
       */
      _drawButton: function(btnCfg, btnTooltip){
         var self = this,
             resultButton = new Button(btnCfg),
             container = resultButton.getContainer();
         container.addClass('ws-item-toolbar').toggleClass('ws-toolbar-item-hide-caption', btnCfg.displayCaption === false).toggleClass('ws-hidden', btnCfg.visible === false);
         if (this._toolbarStyle === TBSTYLE_TRANSFER) {
            if (btnCfg.isDefault) {
               this.setDefaultButton(resultButton);
            }
         }
         if (btnCfg.menuButton !== undefined) {
            this._menuButton = container;
            if (this._toolbarStyle === TBSTYLE_DOCUMENT || this._toolbarStyle === TBSTYLE_TRANSFER) {
               var tooltip = btnTooltip !== undefined ? ' title="' + btnTooltip + '"' : '';
               container.empty()
                  .append($('<div class= "ws-toolbar-menu-button-24px' + (this._toolbarStyle === TBSTYLE_TRANSFER ? ' transfer-style': '') + '"' + tooltip + '></div>')
                  .click(function(event) {
                     if (resultButton.isEnabled()) {
                        //$(document).trigger('mousedown');
                        event.stopImmediatePropagation();
                        self._showMenu();
                     }
                  }));
            }
         }
         if(!this.isEnabled()){
            resultButton.setEnabled(false);
         }
         this._notify('onButtonAdded', resultButton);
         return resultButton;
      },
      /**
       * Цепляет блок в нужное место
       * @param {jQuery}         block    Блок, который нужно вставить
       * @param {Number|String}  position Номер блока, перед которым вставить, или имя кнопки, перед которой вставить
       * @private
       */
      _insertBlock: function(block, position){
         var string = (typeof(position) === 'string'),
            childs = this._toolbarBlock.children(),
            before;
         if(!position && position !== 0 || !string && !childs[position] || string && !this.hasChildControlByName(position)){
            if (this._menuButton instanceof $) {
               before = this._menuButton;
            }
            else{
               block.appendTo(this._toolbarBlock);
               return;
            }
         }
         else{
            before = (string ? this.getButton(position).getContainer() : childs[position]);
         }
         block.insertBefore(before);
      },
      _getButtonNumberByName: function(name, byId) {
         var findBtnName = byId ? this.getId() + '-' + name : name;
         for (var idx = 0, cnt = this._options.btnCfg.length; idx < cnt ; idx++) {
            if (this._options.btnCfg[idx].id === findBtnName) {
               return idx;
            }
         }
         return '';
      },
      /**
       * <wiTag group="Управление">
       * Вставляет кнопку в тулбар с возможностью выбора её позиции.
       * @param {Object} config Конфигурация кнопки.
       * @param {Number|String} position Номер блока, перед которым вставить, или имя кнопки, перед которой вставить.
       * @returns {$ws.proto.Deferred} Деферред готовности кнопки.
       * @example
       * <pre>
       *    toolBar.insertButton({
       *       name: 'config',
       *       tooltip: 'Открыть окно конфигурации',
       *       img: 'sprite:icon-24 icon-Admin icon-primary',
       *       handlers: {
       *          onActivated: showConfigurationWindow
       *       }
       *    }, 'convert');
       * </pre>
       * @see addButton
       * @see getButton
       * @see getButtonByName
       * @see addSeparator
       * @see insertSeparator
       * @see btnCfg
       * @see subBtnCfg
       */
      insertButton: function(config, position) {
         //Проверяем параметр config, если он отсутствует или undefined - сразу выходим из функции
         if (!config && Object.prototype.toString.call(config) !== '[object Object]') {
            $ws.single.ioc.resolve('ILogger').log('Toolbar', 'element can not be created, because parameter "config" is undefined.');
            return;
         }
         if (!config.img || config.img === null) {
            config.img = '';
         }
         if (config.visible !== true) {
            config.visible = false;
         }
         config.textAlign = config.imgAlign = 'left';
         //Проверяем параметр position, если он отсутствует или отрицательный - устанавливаем его самостоятельно
         var hasMenu = !!this._toolbarExtendedMenu || !!this._menu,
            itemsCount = this._options.btnCfg.length > 0 ? this._options.btnCfg.length - (hasMenu ? 1 : 0) : 0, //".length - 1" - чтобы вставить ПЕРЕД кнопкой открытия меню
            self = this;
         if (position === undefined) {
            position = itemsCount > 0 ? itemsCount : 0;
         } else if (typeof position === 'string') { //Если передан ID - высчитываем порядковый номер нового элемента
            position = this._getButtonNumberByName(position);
         }
         this._options.btnCfg.splice(position, 0, config);
         var block = $('<div></div>'),
            btnCfg = $.extend({}, config, {element : block, parent : this, textAlign: 'left', renderStyle : 'asLink'});

         if (this._toolbarStyle === TBSTYLE_DOCUMENT) {
            var addItem = { name: config.name ? config.name : '',
               id: config.id ? config.id : '',
               imgSrc: config.img,
               enabled: config.tooltip && config.tooltip.length,
               handlers: config.handlers && config.handlers.onActivated ? { onActivated: config.handlers.onActivated } : {},
               caption: config.tooltip ? config.tooltip : '' };
            if (this._menu instanceof $ws.proto.Menu) {
               this._menu.insertItem(addItem, position);
            }
            this._options.subBtnCfg.splice(position, 0, addItem);
         } else if (this._toolbarStyle === TBSTYLE_TRANSFER) {
            btnCfg.renderStyle = undefined;
            btnCfg.className = this._getAdditionalClass(position);
            btnCfg.autoWidth = true;
         }
         if (config.caption && config.caption.length) {
            this._insertBlock(block, position);
            var newButton = this._drawButton(btnCfg);
            if (self._toolbarStyle === TBSTYLE_TRANSFER) {
               self._toggleNewClasses(config.visible, position);
               self._toggleDefaultClassMenuButton();
            }
            return newButton;
         } else {
            this.insertSeparator(position);
         }
      },
      /**
       * <wiTag group="Данные">
       * Получить признак, есть ли кнопка с указанным идентификатором.
       * @param {String} id Идентификатор.
       * @returns {Boolean} Вернёт true - есть кнопка с указанным id, false - нет такой кнопки.
       * @example
       * <pre>
       *    if (toolBar.hasButton('config')) {
       *       toolBar.getButton('config').setEnabled(false);
       *    }
       * </pre>
       * @see getButton
       * @see btnCfg
       */
      hasButton: function(id){
         return this._childsMapId[this.getId() + '-' + id] !== undefined;
      },
      /**
       * <wiTag group="Управление">
       * Добавить кнопку в тулбар.
       * Для добавления кнопки в конфиг обязательно передаётся параметр caption. Если текст на кнопке не нужен, то в
       * значении указывается пробел. Если caption не передать, то будет добавлен сепаратор.
       * @param {Object} config Объект вида:
       *       name: 'имя кнопки',
       *       tooltip: 'подсказка/текст у кнопки',
       *       caption: 'Текст на кнопке',
       *       img: 'sprite:icon-24 icon-Admin icon-primary',
       *       handlers: {
       *          'onActivated': обработчик нажатия кнопки
       *       }
       * @returns {$ws.proto.Deferred} Деферред готовности кнопки.
       * @example
       * <pre>
       *    toolBar.addButton({
       *       name: 'config',
       *       tooltip: 'Открыть окно конфигурации',
       *       //текст на кнопке не нужен, передаём пробел
       *       caption: ' ',
       *       img: 'sprite:icon-24 icon-Admin icon-primary',
       *       handlers: {
       *          onActivated: showConfigurationWindow
       *       }
       *    });
       * </pre>
       * @see insertButton
       * @see getButton
       * @see getButtonByName
       * @see addSeparator
       * @see insertSeparator
       * @see btnCfg
       * @see subBtnCfg
       */
      addButton : function(config){
         return this.insertButton(config);
      },
      /**
       * <wiTag group="Управление">
       * Вставить разделитель в указанное место.
       * @param {Number|String} position Номер блока, перед которым вставить; или имя кнопки, перед которой вставить.
       * @example
       * При готовности меню вставить разделитель перед кнопкой btn3:
       * <pre>
       *     var a = this.getChildControlByName('Тулбар');
       *     a.getMenuReady().addCallback(function() {
       *        //вставляем разделитель перед кнопкой btn3
       *        a.insertSeparator('btn3');
       *     });
       * </pre>
       * @see addSeparator
       * @see getSeparator
       */
      insertSeparator: function(position){
         var separator = $('<div class="ws-toolbar-separator"></div>');
         this._insertBlock(separator, position);
         this._separators.push(separator);
      },
      /**
       * <wiTag group="Управление">
       * Вставить разделитель в конец тулбара.
       * @example
       * Добавление в панель инструментов кнопки с последующей вставкой в конец разделителя:
       * <pre>
       *    toolBar.addButton({
       *       name: 'config',
       *       tooltip: 'Открыть окно конфигурации',
       *       img: 'sprite:icon-24 icon-Admin icon-primary',
       *       handlers: {
       *          onActivated: showConfigurationWindow
       *       }
       *    });
       *    toolBar.addSeparator();
       * </pre>
       * @see insertSeparator
       * @see getSeparator
       */
      addSeparator: function(){
         this.insertSeparator(-1);
      },
      /**
       * <wiTag group="Данные">
       * Получить кнопку по её идентификатору (разделители не учитываются).
       * @param {String} id Идентификатор кнопки.
       * @returns {$ws.proto.Button} Возвращает кнопку с указанным id.
       * @example
       * <pre>
       *    if (toolBar.hasButton('config')) {
       *       toolBar.getButton('config').setTooltip('Новый текст у кнопки');
       *    }
       * </pre>
       * @see btnCfg
       * @see subBtnCfg
       * @see getButtonByName
       */
      getButton: function(id){
         var result;
         try {
            result = this.getChildControlById(id);
         } catch(e) {
            $ws.single.ioc.resolve('ILogger').log('Toolbar', 'element "' + id + '" is not present in this toolbar container.');
         }
         return result;
      },
      /**
       * <wiTag group="Данные">
       * Получить кнопку по её имени (разделители не учитываются).
       * @param {String} name Имя кнопки.
       * @returns {$ws.proto.Button} Возвращает кнопку с указанным именем.
       * @example
       * <pre>
       *    var button = toolBar.getButton('config');
       *    button.setEnabled(false);
       *    button.setTooltip('Конфигурация (недоступно - в процессе конфигурации)');
       *
       * </pre>
       * @see btnCfg
       * @see subBtnCfg
       * @see getButton
       */
      getButtonByName: function(name){
         var result;
         try {
            result = this.getChildControlByName(name);
         } catch(e) {
            $ws.single.ioc.resolve('ILogger').log('Toolbar', 'element "' + name + '" is not present in this toolbar container.');
         }
         return result;
      },
      /**
       * <wiTag group="Данные">
       * Получить разделитель по его номеру
       * @param {Number} number Номер разделителя.
       * Номер разделителя определяется порядком создания, нумерация начинается с 0.
       * @returns {jQuery} Возвращает разделитель с указанным номером.
       * @example
       * <pre>
       *     //получить третий разделитель
       *     toolBar.getSeparator(2);
       * </pre>
       * @see addSeparator
       * @see insertSeparator
       */
      getSeparator: function(number){
         return this._separators[number];
      },
      /**
       * <wiTag group="Управление">
       * Уничтожить все объекты: кнопки, разделители.
       * @param notIgnoreMenu - Удалять и кнопку открытия меню (вместе с самим меню).
       * @example
       * <pre>
       *    button.subscribe('onActivated', function() {
       *       toolBar.clear();
       *    });
       * </pre>
       */
      clear: function(notIgnoreMenu){
         var
            i,
            len,
            newChildControls = [],
            newBtnCfg = [];
         for(i = 0, len = this._separators.length; i < len; ++i){
            this._separators[i].empty().remove();
         }
         this._separators = [];
         for(i = 0, len = this._childControls.length; i < len; ++i){
            if (this._childControls[i] instanceof $ws.proto.Button && (notIgnoreMenu || this._childControls[i].getName() !== this.getName() + '-menu-button')) {
               this._childControls[i].destroy();
            } else {
               newChildControls.push(this._childControls[i]);
            }
         }
         if (notIgnoreMenu) {
            this._childControls = [];
            this._options.btnCfg = [];
            this._options.subBtnCfg = [];
         } else {
            $.each(this._options.btnCfg, function(idx, btn) {
               if (btn.name === this.getName() + '-menu-button') {
                  newBtnCfg.push(btn);
                  return false;
               }
            }.bind(this));
            this._options.btnCfg = newBtnCfg;
            this._childControls = newChildControls;
         }
      },
      _setEnabled: function(enable){
         $ws.proto.ToolBar.superclass._setEnabled.apply(this, arguments);
         if (this._isInitComplete){
            for (var i = 0, len = this._childControls.length; i < len; ++i) {
               if (this._childControls[i] && this._childControls[i].setEnabled){
                  this._childControls[i].setEnabled(enable);
               }
            }
         }
      },
      destroy: function(){
         if (this._menuHideButton) {
            this._menuHideButton.unbind('click');
         }
         this.clear(true);
         if(this._menu instanceof $ws.proto.Menu){
            this._menu.destroy();
         }
         $ws.proto.ToolBar.superclass.destroy.apply(this, arguments);
      },
      /**
       * Возвращает ближайшую видимую кнопку тулбара
       * @private
       */
      _getFirstVisibleButton: function(start, backward, notIgnoreMenu) {
         if (backward) {
            for (var i = start - 1; i >= 0; i--) {
               var curBtn = this._options.btnCfg[i];
               if (curBtn.visible && (!curBtn.menuButton || notIgnoreMenu)) {
                  return i;
               }
            }
         } else {
            for (var j = start + 1; j < this._options.btnCfg.length; j++) {
               var currentBtn = this._options.btnCfg[j];
               if (currentBtn.visible && (!currentBtn.menuButton || notIgnoreMenu)) {
                  return j;
               }
            }
         }
         return -1;
      },
      /**
       * Возвращает последнюю видимую кнопку тулбара
       * @private
       */
      _getLastButtonNumber: function() {
         for (var i = this._options.btnCfg.length - (this._menuButton ?  2 : 1); i >= 0; i--) {
            if (this._options.btnCfg[i].visible) {
               return i;
            }
         }
         return -1;
      },
      /**
       * <wiTag group="Управление">
       * Удалить указанную кнопку.
       * @param {String} name Имя или идентификатор кнопки (config.name).
       * @returns {Boolean} True - кнопка удалилась, false - кнопку не нашли.
       * @example
       * По готовности меню удалить указанную кнопку:
       * <pre>
       *     var a = this.getChildControlByName('Тулбар');
       *     a.getMenuReady().addCallback(function() {
       *        //удаляем кнопку с именем btn1
       *        a.deleteButton('btn1');
       *     });
       * </pre>
       * @see btnCfg
       * @see subBtnCfg
       * @see addButton
       * @see insertButton
       * @see setButtonEnabled
       */
      deleteButton: function(name){
         var button = this._childControls[this._childsMapName[name]],
            id;
         if(!button){
            id = this.getId() + '-' + name;
         }
         else{
            id = button.getId();
         }
         if (button || this._childsMapId[id]) {
            if (this._toolbarStyle === TBSTYLE_TRANSFER) {
               this._toggleNewClasses(false, this._getButtonNumberByName(name));
            }
            this.destroyChild(id);
            if (Object.prototype.toString.call(this._options.btnCfg) === '[object Array]') {
               this._options.btnCfg.splice([this._getButtonNumberByName(id)], 1);
            } else {
               delete (this._options.btnCfg[this._getButtonNumberByName(id)]);
            }
            if (this._menu) {
               this._menu.removeItem(name);
            }
            return true;
         }
         return false;
      }
   });

   return $ws.proto.ToolBar;

});