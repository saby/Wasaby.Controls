/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 23:15
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.Menu', ['js!SBIS3.CORE.Control', 'html!SBIS3.CORE.Menu', 'html!SBIS3.CORE.Menu/Menu_item', 'css!SBIS3.CORE.Menu', 'is!browser?js!Ext/jquery-ui/jquery-ui-position'], function(Control, dotTplFn, menuItemTpl) {

   'use strict';

   $ws._const.Menu = {
      menuBorderWidth: 2,
      offsetSubMenu: { //Дополнительный для подменю
         top: -1,
         left: -3
      },
      subMenuIconWidth: 24,
      imagePadding: 32
   };

   /**
    * @class $ws.proto.Menu
    * @extends $ws.proto.Control
    *
    * @cfgOld {Number} params.showDelay Количество миллисекунд ожидания до открытия подменю
    * <wiTag group="Данные">
    * Определяет колличество миллисекунд, по истечении которых будет отображено подменю при наведении курсора мыши на элемент меню.
    * Значение по умолчанию 200 миллисекунд.
    * <pre>
    *    $ws.core.attachInstance('Control/Menu', {
    *       element: 'menu',
    *       name: "Контекстное меню 1",
    *       params: {
    *          showDelay: 300
    *       },
    *       data: //элементы меню
    *    });
    * </pre>
    * @cfgOld {Number} params.hideDelay Количество миллисекунд ожидания до закрытия подменю
    * <wiTag group="Данные">
    * Определяет колличество миллисекунд, по истечении которых будет закрыто подменю при покидании курсора мыши элемента меню.
    * Значение по умолчанию 200 миллисекунд.
    * <pre>
    *    $ws.core.attachInstance('Control/Menu', {
    *       element: 'menu',
    *       name: "Контекстное меню 1",
    *       params: {
    *          hideDelay: 50
    *       },
    *       data: //элементы меню
    *    });
    * </pre>
    * @cfgOld {Number} params.hoverOpenDelay Количество миллисекунд ожидания до открытия основного меню
    * <wiTag group="Данные">
    * Определяет колличество миллисекунд, по истечении которых будет открыто основное меню при наведении курсора мыши на меню (без клика).
    * Значение по умолчанию 0.
    * <pre>
    *    $ws.core.attachInstance('Control/Menu', {
    *       element: 'menu',
    *       name: "Контекстное меню 1",
    *       params: {
    *          hoverOpenDelay: 100
    *       },
    *       data: //элементы меню
    *    });
    * </pre>
    * @cfgOld {Number} params.offsetTop Отступ меню от верхнего края
    * <wiTag group="Данные">
    * Отступ меню от верхнего края относительно начала страницы.
    * Значение по умолчанию 0.
    * <pre>
    *    $ws.core.attachInstance('Control/Menu', {
    *       element: 'menu',
    *       name: "Контекстное меню 1",
    *       params: {
    *          offsetTop: 250
    *       },
    *       data: //элементы меню
    *    });
    * </pre>
    * @cfgOld {Number} params.offsetLeft Отступ меню слева
    * <wiTag group="Данные">
    * Отступ меню от левого края относительно начала страницы.
    * Значение по умолчанию 0.
    * <pre>
    *    $ws.core.attachInstance('Control/Menu', {
    *       element: 'menu',
    *       name: "Контекстное меню 1",
    *       params: {
    *          offsetLeft: 30
    *       },
    *       data: //элементы меню
    *    });
    * </pre>
    * @cfgOld {Number} params.minWidth Минимальная ширина меню
    * <wiTag group="Данные">
    * Минимальная ширина меню.
    * По умолчанию ширина зависит от контента элементов меню.
    * Значение по умолчанию 0.
    * <pre>
    *    $ws.core.attachInstance('Control/Menu', {
    *       element: 'menu',
    *       name: "Контекстное меню 1",
    *       params: {
    *          minWidth: 100
    *       },
    *       data: //элементы меню
    *    });
    * </pre>
    * @cfgOld {Boolean} params.contextMenu Контекстное меню
    * <wiTag group="Данные">
    * Определяет является ли меню контекстным.
    * Меню будет показано по клику именно правой кнопки мыши.
    * По умолчанию не контекстное.
    * <pre>
    *    $ws.core.attachInstance('Control/Menu', {
    *       element: 'menu',
    *       name: "Контекстное меню 1",
    *       params: {
    *          contextMenu: true
    *       },
    *       data: //элементы меню
    *    });
    * </pre>
    * @cfgOld {String} params.arrowSrc Индикатор подменю
    * <wiTag group="Данные">
    * Картика, которая будет отображаться в качестве индикатора подменю,
    * если не указана, то наличие подменю никак не будет обозначено.
    * <pre>
    *    $ws.core.attachInstance('Control/Menu', {
    *       element: 'menu',
    *       name: "Контекстное меню 1",
    *       params: {
    *          arrowSrc: //путь до указателя на подменю
    *       },
    *       data: //элементы меню
    *    });
    * </pre>
    *
    * @control
    * @category Navigation
    */
   $ws.proto.Menu = Control.Control.extend(/** @lends $ws.proto.Menu.prototype */{
      /**
       * @event onActivated При клике на пункт меню
       * Событие, происходящее при клике на пункт меню.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} idItem Идентификатор выбранного пункта.
       * @param {Object} element Объект, по которому был сконфигурирован данный пункт меню.
       * @example
       * <pre>
       *    menu.subscribe("onActivated", function(eventObject, idItem, element){
       *       if(idItem === "someId")
       *          menu.setItemText(id, "new text");
       *    });
       * </pre>
       */
      /**
       * @event onClose При закрытии меню
       * Событие, происходящее при закрытии меню.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Number} level Уровень меню, первый уровень имеет номер 0.
       * @example
       * <pre>
       *    menu.subscribe("onClose", function(eventObject, level){
       *       if(level === 0)
       *          button.setCaption("Открыть меню");
       *    });
       * </pre>
       */
      /**
       * @event onOpen При открытии меню
       * Событие, происходящее при открытии меню.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    menu.subscribe("onOpen", function(eventObject){
       *       button.setCaption("Закрыть меню");
       *    });
       * </pre>
       */
      /**
       * @event onMouseEnter При наведении мыши на меню
       * Событие, происходящее при наведении мыши на меню.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    menu.subscribe("onMouseEnter", function(eventObject){
       *       this.getContainer().addClass("someClass");
       *    });
       * </pre>
       */
      /**
       * @event onMouseLeave В момент перемещения мыши с меню
       * Событие, происходящее в момент перемещения мыши с меню.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    menu.subscribe("onMouseLeave", function(eventObject){
       *       this.getContainer().removeClass("someClass");
       *    });
       * </pre>
       */
      /**
       * @event onItemsChange При изменении дочерних элементов
       * Событие, наступающее при изменении дочерних элементов.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    menu.subscribe("onItemsChange", function(eventObject){
       *       //...
       *    });
       * </pre>
       */
      $protected: {
         _options: {
            itemRender: undefined,
            /**
             * @typedef {Object} Target
             * @variant _blank _blank
             * @variant '' _self
             * @variant _parent _parent
             * @variant _top _top
             */
            /**
             * @typedef {Object} Dictionary
             * @property {String} id
             * @property {String} caption
             * @property {String} addClass
             * @property {String} url
             * @property {Target} target
             * @property {String} imgSrc
             * @editor imgSrc ImageEditor
             * @property {Boolean} enabled
             * @property {Dictionary[]} subMenu
             */
            /** @cfg {Dictionary[]} Массив данных для отображения в меню
             * <wiTag group="Данные">
             * Каждый пункт задается ассоциированным массивом и может содержать следующие пункты:
             * caption - заголовок элемента меню;
             * id - идентификатор соответствующего пункта меню;
             * url - страница куда ссылается этот пункт;
             * target - как открыть указанный url;
             * addClass - класс или классы, которые будут указаны у этого пункта меню;
             * imgSrc - адрес картинки, которую следует отобразить слева от пункта меню;
             * enabled - можно ли работать с элементом;
             * subMenu - подменю указанного пункта, описывается аналогично описанному выше.
             * Если есть необходимость вставить разделитель, то нужно отдать пустой объект.
             * <pre>
             *    [
             *       {
            *          caption: "Print",
            *          imgSrc: "sprite:icon-16 icon-Print icon-primary",
            *          id: "print",
            *          enabled: false
            *       },
             *       {},
             *       {
            *          caption: "Playback",
            *          id: "playback",
            *          subMenu: [
            *             {
            *                caption: "Prev",
            *                id: "prev",
            *                url: "http://someurl/"
            *                target: "_blank"
            *             },
            *             {
            *                caption: "Play",
            *                id: "play",
            *                addClass: "myClass"
            *             }
            *          ]
            *       }
             *    ]
             * </pre>
             */
            data: [],
            /**
             * @cfg {Boolean} Опция, позволяющая по-умолчанию разворачивать подменю влево
             * <wiTag group="Управление">
             */
            turnLeftSubMenu: false,
            dataSource: undefined,
            captionColumn: undefined
         },
         _itemEvents: {},
         _visible: false,
         _menu: undefined,     //Объект меню
         _windowResizeHandler: undefined,
         _initialized: false,
         _fontProperties: {   //Настройки шрифта меню
            styles: {},
            underline: false
         },
         _focusOutHandler: undefined,
         _optionsShowMenu: {},
         _keyDownHandler: undefined
      },
      $constructor : function(){
         if (this._initialized) {
            return;
         }
         this._initialized = true;
         this._publish('onClose', 'onOpen', 'onMouseEnter', 'onMouseLeave', 'onActivated', 'onItemsChange', 'onAfterRender');
         var body = $ws._const.$doc.find('body'),
               isBuildOnRS;
         if (this._container) {
            this._container.detach().appendTo(body);
         } else {
            body.append(this._container = $('<div></div>'));
         }
         if (!Object.isEmpty(this._options.dataSource || {})) {
            this.setData(new $ws.proto.RecordSet(this._options.dataSource));
            isBuildOnRS = true;
         }
         this._container.addClass('ws-menu ws-menu-container').attr('id', this.getId());
         this._container.addClass('ws-hidden');
         this._getFontProperties(); //Сохраняем настройки шрифта с контейнера меню
         if (!isBuildOnRS) {
            //если меню изначально строилось по источнику данных, то отрисовку не вызываем,
            //метод _drawMenu() уже вызывался
            this._drawMenu();
         }
         this._initMenuEvents();
         this._notify('onReady', this);
      },
      /**
       * Отрисовка и построение пунктов меню
       * @private
       */
      _drawMenu: function ( ) {
         this._container.empty().prepend(dotTplFn(this._options, this));
         this._menu = $(this._container.find('.menu-ul')[0]).addClass('ws-main-menu');
         this._makeMenuItems(this._menu, this._options.data);
         this._notify('onAfterRender');
      },
      /**
       * Устанавливает колонку, значения которой у записей используются для текса пунктов меню при построении меню
       * с помощью выборки
       * @param {String} column название колонки, используемой для текста пунктов меню
       * @example
       * <pre>
       *    menu.setCaptionColumn(column);
       *    menu.setData(newRecordSet);
       * </pre>
       */
      setCaptionColumn: function (column) {
         if (column && typeof column === 'string') {
            this._options.captionColumn = column;
         }
      },
      /**
       * Строит меню по переданной иерархической выборке
       * @param {$ws.proto.RecordSet} data иерархическая ваборка
       * @example
       * <pre>
       *    dataView.recordSetReady().addCallback(function(){
       *       menu.setData(newRecordSet);
       *    });
       * </pre>
       */
      setData: function (data) {
         if (data instanceof $ws.proto.RecordSet && this._options.captionColumn) {
            var records = this._getChildItems(data, data.recordChilds(null)),
                items;
            this.hide();
            items = this._buildItems(data, records);
            if (items.length > 0) {
               this._options.data = items;
               this._itemEvents = {};
            }
            this._drawMenu();
         }
      },
      /**
       * Формирование пунктов меню по выборке
       * @param {$ws.proto.RecordSet} rs иерархическая выборка
       * @param {Array} records массив записей текущего уровня меня
       * @private
       */
      _buildItems: function (rs, records) {
         var items = [],
               record;
         for (var i = 0, l = records.length; i < l; i++) {
            record = records[i];
            if (record.hasColumn(this._options.captionColumn)) {
               var caption = record.get(this._options.captionColumn),
                     key = record.getKey(),
                     recordChilds;
               if (caption) {
                  items.push({
                     id: key,
                     caption: caption
                  });
                  if (record.isBranch()) {
                     recordChilds = rs.recordChilds(key);
                     if (recordChilds.length > 0) {
                        items[i].subMenu = this._buildItems(rs, this._getChildItems(rs, recordChilds));
                     }
                  }
               }
            }
         }
         return items;
      },
      /**
       * Отбор записей, соответствующих определенному уровню меню
       * @param {$ws.proto.RecordSet} rs иерархическая выборка
       * @param {Array} keys массив ключей записей, по которым строится данный уровень меню
       * @private
       */
      _getChildItems: function (rs, keys) {
         var records = [];
         for (var i = 0, l = keys.length; i < l; i++) {
            records.push(rs.getRecordByPrimaryKey(keys[i]));
         }
         return records;
      },
      /**
       * Замена набора данных в меню
       * Подстановка нового источника данных.
       * Меню построится по рекордсету, созданным по переданному источнику ланных.
       * @param {Object} dataSource источник данных
       */
      setSource : function(dataSource){
         if (dataSource instanceof Object) {
            this.setData(new $ws.proto.RecordSet(dataSource));
            this._options.dataSource = dataSource;
         }
      },
      /**
       * Считывает и сохраняет заданные настройки шрифта меню
       * @private
       */
      _getFontProperties : function() {
         this._fontProperties.styles = {};
         var styles = ['font-family', 'font-size', 'font-weight', 'font-style', 'text-align', 'color'],
             container = this._container,
             fontStyles = this._fontProperties.styles;
         //Сохраняем стили, примененные к контейнеру меню
         for (var i = 0, length = styles.length; i < length; fontStyles[styles[i]] = container.css(styles[i++])) {
         }
         //Сохраняем наличие подчеркивания как булевское свойство, в будущем по этому свойству тоглим класс 'ws-font-with-underline'
         this._fontProperties.underline = container.css('text-decoration').indexOf('underline') != -1;
      },
      /**
       * Применяет ранее считанные стили к указанному меню
       * @param menu
       * @private
       */
      _applyFontProperties : function(menu) {
         var fontProperties = this._fontProperties;
         menu.toggleClass('ws-font-with-underline', fontProperties.underline);
         menu.css(fontProperties.styles);
      },
      /**
       * Возвращает UL созданного меню
       * @returns {*|jQuery}
       */
      getMenuUL: function() {
         return this._menu;
      },
      _makeMenuItems: function (menu, itemsData) {
         var self = this;
         this._applyFontProperties(menu);
         for (var i = 0, len = itemsData.length; i < len; i++) {
            (function() {
               var curCfg = itemsData[i],
                   curItem = $(menu.children()[i]),
                   subMenu = curCfg.subMenu;
               curCfg.parentCfg = itemsData;
               if (subMenu) {
                  curCfg.subMenuId = $ws.helpers.randomId();
                  subMenu.parentMenu = itemsData;
                  var appendingMenu = $(dotTplFn(subMenu, self)).attr('id', curCfg.subMenuId);
                  self._container.append(appendingMenu);
                  self._makeMenuItems.call(self, appendingMenu, subMenu);
               } else {
                  //Запоминает хэндлеры элементов меню, вместо метода _rememberItemHandlers()
                  if (curCfg.id !== undefined && !Object.isEmpty(curCfg.handlers)) {
                     self._itemEvents[curCfg.id] = curCfg.handlers;
                  }
               }
               self._initItemEvents(curItem, curCfg);
            })();
         }
         if (menu.find('.ws-menu-hasImg').length > 0) {
            menu.addClass('ws-menu-image-padding');
         }
      },
      _renderElement: function (id, caption) {
         var htmlText = caption,
             renderResult;
         if (typeof(this._options.itemRender) === 'function') {
            renderResult = this._options.itemRender.apply(this, arguments);
            if (renderResult) {
               if (renderResult instanceof Object && 'jquery' in renderResult) {
                  renderResult = renderResult[0].outerHTML;
               }
               if (typeof(renderResult) === 'string') {
                  htmlText = $ws.helpers.escapeTagsFromStr(renderResult, ['script']);
               }
            }
         }
         return htmlText;
      },
      _initItemEvents: function (element, options) {
         if (options.caption) {
            var self = this,
                id = options.id;
            element.bind({
               'click': function (event) {
                  if (!self._container.hasClass('ws-disabled') && !element.hasClass('ws-disabled')) { //Если меню и элемент не задизаблены
                     // Поймать клик можно только от элементов, у которых нет подменю
                     if(!options.subMenu) {
                        //т.к. hide - это просто скрытие jQuery, а не контрола. нельзя пробрасывать клик дальше. IE страдает
                        event.stopImmediatePropagation();
                        self._notify('onActivated', id, options);
                        self._activateItemMenuHandler(id, options, event);
                        self.hide();
                     }
                  }
               },
               'mouseleave': function () {
                  self._itemHoverHandler(element, options);
                  self._notify('onMouseLeave', id, element);
               },
               'mouseenter': function () {
                  self._itemHoverHandler(element, options, true);
                  self._notify('onMouseEnter', id, element);
               }
            });
         }
      },
      _onKeyDown: function(e) {
         if (e.keyCode === 27) {
            this.hide();
         }
      },
      _initMenuEvents: function ( ) {
         var self = this;

         this._windowResizeHandler = this._closeOnResize.bind(this);
         this._focusOutHandler = this._hideOnFocusOut.bind(this);
         this._keyDownHandler = this._onKeyDown.bind(this);

         this.subscribe('onOpen', function ( ) {
            $ws._const.$win.bind('resize', self._windowResizeHandler);
            $ws._const.$doc.bind('mouseup', self._focusOutHandler);
            $ws._const.$doc.bind('keydown', self._keyDownHandler);
         });

         this.subscribe('onClose', function ( ) {
            $ws._const.$win.unbind('resize', self._windowResizeHandler);
            $ws._const.$doc.unbind('mouseup', self._focusOutHandler);
            $ws._const.$doc.unbind('keydown', self._keyDownHandler);
         });
      },
      _closeOnResize: function ( ) {
         if (this._visible) {
            this.hide();
         }
      },
      /**
       * Обработчик на скрытие меню
       * @private
       */
      _hideOnFocusOut: function (e) {
         var
            target = $(e.target),
            buttonOwner = target.parents('.ws-button-menu-clone-container'),
            parent = target.parents('.ws-menu-container')[0],
            menuChild = target.closest('.ws-has-parent-menu');
         if ((this._visible && //Если меню открыто
            target.data('openedMenuId') != this.getId() && //и в data таргета нет его ID
            $(parent).attr('id') != this.getId() && //и нет родителя с ID равным ID меню
            !menuChild.length && menuChild.attr('for-menu') != this.getId()) || //и таргет (или один из его предков) не является частью, оторванной от контейнера контрола
            buttonOwner.length) { //или щелкнули на клон-контейнер кнопки, по которой открыли меню
            this.hide(); //Только тогда скрываем меню!
         }
      },
      _hideAllSubMenu: function (activeCfg, id) {
         if (activeCfg.activeMenu) {
            if (activeCfg.activeMenuCfg.activeMenu) {
               this._hideAllSubMenu.call(this, activeCfg.activeMenuCfg);
            }
            this._container.find('#' + activeCfg.activeMenu).addClass('ws-hidden');
            if (id) {
               this._container.find('#' + id).closest('.menu-ul').find('.ws-menu-item-active').removeClass('ws-menu-item-active');
               this._removeActiveClass(activeCfg);
            }
            delete activeCfg.activeMenuCfg;
            delete activeCfg.activeMenu;
         }
      },
      /**
       * Удаляем у закрытых меню классы, идентифицирующие активные пункты меню
       * @param activeCfg
       * @private
       */
      _removeActiveClass: function (activeCfg) {
         if (typeof activeCfg !== 'undefined') {
            for (var i = 0, l = activeCfg.length; i < l; i++) {
               var id = activeCfg[i].subMenuId;
               if (id) {
                  this._container.find('#' + id + ' .ws-menu-item-active').removeClass('ws-menu-item-active');
                  this._removeActiveClass(activeCfg.activeMenuCfg);
               }
            }
         }
      },
      _itemHoverHandler: function (element, options, isMouseOn) {
         if (!this._container.hasClass('ws-disabled') && !element.hasClass('ws-disabled')) {
            if (isMouseOn) {
               //Проверяем было ли открыто другое меню и если да - то закрываем его
               this._hideAllSubMenu(options.parentCfg, options.id);
               if (options.subMenu) {
                  if (options.parentCfg) { //Если открываем дочернее окно - сохраняем его ID в Object-родителе
                     options.parentCfg.activeMenu = options.subMenuId;
                     options.parentCfg.activeMenuCfg = options.subMenu;
                  }
                  var openedMenu = this._container.find('#' + options.subMenuId);
                  element.addClass('ws-menu-item-active');
                  openedMenu.removeClass('ws-hidden');
                  openedMenu.position({
                     my: (this._options.turnLeftSubMenu ? 'right' : 'left') + ' top',
                     at: (this._options.turnLeftSubMenu ? 'left' : 'right') + ' top',
                     collision: 'flip',
                     of: element,
                     offset: (this._options.turnLeftSubMenu ? -$ws._const.Menu.offsetSubMenu.left : $ws._const.Menu.offsetSubMenu.left) + ' ' + $ws._const.Menu.offsetSubMenu.top
                  });
               }
            }
         } else if (isMouseOn) {
            this._hideAllSubMenu(options.parentCfg, options.id);
         }
      },
      isShow: function ( ) {
         return this._visible;
      },
      /**
       * Для всех меню, имеющих пункты с подменю добавляет на меню класс-ндикатор наличия подменю или убирает его
       * в противном случае
       * @private
       */
      _checkOnSubMenu: function ( ) {
         this._container.find('.menu-ul').each(function (index, element) {
            var menuUL = $(element);
            menuUL.toggleClass('ws-menu-with-submenu', menuUL.find('.ws-with-submenu:not(.ws-hidden)').length > 0);
         });
      },
      /**
       * <wiTag group="Отображение">
       * Отображает меню
       * @param target {Object} Таргет-объект, относительно которого отображается меню.
       * Может быть DOM-элемент, JQuery-объект, JQuery-event или объект с координатами: { top: xxx, left: xxx }
       * @param offset {Object} Дополнительные отступы меню по вертикали и горизонтали: { top: xxx, left: xxx }
       * @param [fixedAngle=true] {Object} Объект, задающий угол фиксации меню. По-умолчанию используется левый верхний угол
       * Возможны следующие параметры:
       *    objectLeft - прикрепляем меню его левой стороной (true/false)
       *    objectTop - прикрепляем меню его верхней стороной (true/false)
       *    targetLeft - прикрепляем меню к левой стороне таргета (true/false)
       *    targetTop - прикрепляем меню к верхней стороне таргета (true/false)
       * @param flip {Object} Объект, разрешающий выполнение разворота меню. Внимание: по-умолчанию разворот разрешен!
       * Возможны следующие параметры:
       *    horizontal - разрешить разворот по горизонтали (true/false)
       *    vertical - разрешить разворот по вертикали (true/false)
       *    doFit - делать смещение а не разворот (true/false)
       * @param notRecalculate {Boolean} Запретить пересчет позиции меню, в зависимости от позиции его таргета
       * @see hide
       * @example
       * <pre>
       *    //Отобразить меню с координатами 100px по вертикали и 200px по горизонтали
       *    menu.show({ top: 100, left: 200 });
       * </pre>
       */
      show: function (target, offset, fixedAngle, flip, notRecalculate) {
         this._checkOnSubMenu();
         if (target instanceof Element) { //Если передан DOM-элемент - оборачиваем его JQuery
            target = $(target);
         }
         var
            container = this._container,
            self = this,
            targetElement = target ? //Кто передан в качестве таргета: JQuery-объект = true, координаты = false, иначе = null
               (target instanceof $ ?
                  true :
                  target instanceof Object ? false : null) :
               null,
            targetMenu = targetElement !== null ? //Запоминаем таргет
               (targetElement ? target : //Если цель JQuery-объект, то его и используем в качестве цели
                  jQuery.Event('', { //Если координаты - создаем event
                     pageX: target.left || target.clientX,
                     pageY: target.top || target.clientY
                  })) : //Иначе - цели не будет
               null;
         this._optionsShowMenu = {
            fixedMenuAngle: { //Расчитываем фиксированные углы из переданных параметров
               objectTop: fixedAngle && fixedAngle.objectTop !== undefined ? fixedAngle.objectTop : true,
               objectLeft: fixedAngle && fixedAngle.objectLeft !== undefined ? fixedAngle.objectLeft : true,
               targetTop: fixedAngle && fixedAngle.targetTop !== undefined ? fixedAngle.targetTop : true,
               targetLeft: fixedAngle && fixedAngle.targetLeft !== undefined ? fixedAngle.targetLeft : true
            },
            menuOffset: { //Расчитываем оффсет из переданных параметров
               left: offset && offset.left ? offset.left : 0,
               top: offset && offset.top ? offset.top : 0
            },
            needFlip: { //Расчитываем необходимость поворота из переданных параметров
               horizontal: flip && flip.horizontal !== undefined ? flip.horizontal : true,
               vertical: flip && flip.vertical !== undefined ? flip.vertical : true,
               doFit: flip && flip.doFit !== undefined ? flip.doFit : false
            },
            menuTarget: targetMenu || target
         };
         this._hideAllSubMenu(this._options.data); //Скрываем все подменю
         container.removeClass('ws-hidden'); //Отображаем контейнер и меню
         this._menu.removeClass('ws-hidden');
         this._visible = true;
         this._notify('onOpen'); //Стреляем открытие меню
         if (this._optionsShowMenu.menuTarget instanceof $) {
            $(this._optionsShowMenu.menuTarget).data('openedMenuId', this.getId());
            if (notRecalculate !== true) {
               $ws.helpers.trackElement(this._optionsShowMenu.menuTarget).subscribe('onMove', function() {
                  self._recalculateMenu();
               }, this);
            }
         }
         this._recalculateMenu();
      },

      _recalculateMenu: function() {
         if (this._visible) {
            var
               container = this._container,
               menuWidth = this._menu.width() + $ws._const.Menu.menuBorderWidth, //Учитываем в ширине контейнера рамки меню
               menuHeight = this._menu.height(),
               config = this._optionsShowMenu,
               topParent = this.getTopParent(),
               menuItemMaxWidth = $ws._const.$body.width() / 2,
               targetOffset = config.menuTarget instanceof $ ? //Запоминаем координаты таргета
                  config.menuTarget.offset() :
               {
                  left: config.menuTarget.pageX,
                  top: config.menuTarget.pageY
               };
            menuItemMaxWidth -= (this._menu.hasClass('ws-menu-with-submenu') ? $ws._const.Menu.subMenuIconWidth : 0 +
               this._menu.hasClass('ws-menu-with-submenu') ? $ws._const.Menu.subMenuIconWidth : 0);
            container.css({ minWidth: menuWidth, minHeight: menuHeight }); //Устанавливаем контейнеру размеры основного меню
            this._menu.find('.menu-span').css({ maxWidth: menuItemMaxWidth, overflow: 'hidden', 'text-overflow': 'ellipsis' });
            container.position({
               my: (config.fixedMenuAngle.objectLeft ? 'left' : 'right') + ' ' + (config.fixedMenuAngle.objectTop ? 'top' : 'bottom'),
               at: (config.fixedMenuAngle.targetLeft ? 'left' : 'right') + ' ' + (config.fixedMenuAngle.targetTop ? 'top' : 'bottom'),
               collision: (config.needFlip.horizontal ? (config.needFlip.doFit ? 'fit' : 'flip') : 'none') + ' ' +
                  (config.needFlip.vertical ? (config.needFlip.doFit ? 'fit' : 'flip') : 'none'),
               of: config.menuTarget,
               within: topParent && topParent.getContainer() || $ws._const.$win,
               using: function(pos) { //Переопределяем функцию позиционирования
                  var
                     leftTurned = pos.left < Math.round(targetOffset.left), //Был ли разворот меню влево?
                     topTurned = pos.top < Math.round(targetOffset.top); //Был ли разворот меню вверх?
                  container.toggleClass('menu-left-turn', leftTurned) //Тоглим классы в зависимости от разворотов
                     .toggleClass('menu-top-turn', topTurned);
                  //Добавляем дополнительные отступы, в зависимости от разворотов
                  pos.left += config.fixedMenuAngle.objectLeft ?
                     (leftTurned && !config.needFlip.doFit ? -config.menuOffset.left : config.menuOffset.left) :
                     (leftTurned && !config.needFlip.doFit ? config.menuOffset.left : -config.menuOffset.left);
                  pos.top += config.fixedMenuAngle.objectTop ?
                     (topTurned ? -config.menuOffset.top : config.menuOffset.top) :
                     (topTurned ? config.menuOffset.top : -config.menuOffset.top);
                  container.css({ //Позиционируем контейнер меню
                     top: pos.top, left: pos.left
                  });
               }
            });
         }
      },

      /**
       * <wiTag group="Отображение">
       * Скрывает меню
       * @param [hideIfShowed] {Boolean} Опционально: скрывать меню только если оно показано
       * @see show
       * @example
       * <pre>
       *    menu.hide();
       * </pre>
       */
      hide: function (hideIfShowed) {
         //TODO Сообщить здесь в контрол о состоянии скрытия, ибо тут происходит только "внешнее" скрытие.
         //Контрол считается акативным
         if (!hideIfShowed || this.isShow()) { //Опционально: скрываем меню, если оно показано
            if (this._optionsShowMenu && this._optionsShowMenu.menuTarget instanceof $) {
               this._optionsShowMenu.menuTarget.removeData('openedMenuId');
               $ws.helpers.trackElement(this._optionsShowMenu.menuTarget, false);
            }
            this._hideAllSubMenu(this._options.data);
            this._container.find('.ws-menu-item-active').removeClass('ws-menu-item-active');
            this._container.addClass('ws-hidden');
            if (this._menu) {
               this._menu.addClass('ws-hidden');
            }
            this._notify('onClose');
            this._visible = false;
         }
      },
      toggle: function () {
         return this[this._visible ? 'hide' : 'show'].apply(this, arguments);
      },
      /**
       * Возвращает текущую ширину основного меню
       * @return {Number} текущая ширина
       */
      getMenuWidth: function ( ) {
         var tempMenuContainer = $("<div id='template_platformMenu' class='ws-menu-container' style='visibility: hidden;'></div>"),
             tempMenu = $(this._menu.clone()).css({ width: 'auto', visibility: 'hidden' }).
               removeClass('ws-hidden')
               .appendTo(tempMenuContainer);
         tempMenuContainer.css('width', 'auto');
         $('body').append(tempMenuContainer);
         var menuWidth = tempMenu.outerWidth();
         $(tempMenuContainer).remove();
         return menuWidth;
      },
      /**
       * Устанавливает ширину основного меню
       * @param {Number} width Устанавливаемая щирина
       */
      setMenuWidth: function (width) {
         if (typeof width === 'number') {
            this._menu.css('width', width + 'px');
         } else if (width === 'auto') {
            this._menu.css('width', width);
         }
      },
      /**
       * <wiTag group="Данные">
       * Является ли данный контрол меню
       * @returns {boolean}
       * @example
       * <pre>
       *    control.isMenu();
       * </pre>
       */
      isMenu: function ( ) {
         return true;
      },
      _activateItemMenuHandler: function (id, options, event) {
         this._itemHandlers(id, options, 'onActivated', event);
      },
      /**
       * Вызываает хэндлер события handlerName, если он был указан у элемента с заданным id
       * @param {Number} id идентификатор выбранного пункта
       * @param {Object} options объект, по которому был сконфигурирован данный пункт меню
       * @param {String} handlerName Название события
       */
      _itemHandlers: function (id, options, handlerName, event) {
         var handler = this._itemEvents[id] ? this._itemEvents[id][handlerName] : false;
         if(handler && typeof(handler) == 'function') {
            handler.apply(this, handler.isCommand === true ? [new $ws.proto.EventObject(event)] : [id, options]);
         }
      },
      /**
       * <wiTag group="Отображение">
       * Показывает элемент меню с указанным id
       * @see hideItem
       * @param {String} id - id пункта меню
       * @example
       * <pre>
       *    menu.showItem(id);
       * </pre>
       */
      showItem: function (id) {
         if (this.hasItem(id)) {
            this._container.find('#' + id).removeClass('ws-hidden');
            this._recalculateMenu();
            this._notify('onItemsChange');
         }
      },
      /**
       * <wiTag group="Отображение">
       * Скрывает элемент меню с указанным id
       * @see showItem
       * @param {String} id - id пункта меню
       * @example
       * <pre>
       *    menu.hideItem(id);
       * </pre>
       */
      hideItem: function (id) {
         if (this.hasItem(id)) {
            var element = this._findMenuElementAndDoAction(this._options.data, id);
            if (element.subMenu && element.subMenu.parentMenu) {
               this._hideAllSubMenu(element.subMenu.parentMenu);
            }
            this._container.find('#' + id).addClass('ws-hidden');
            this._recalculateMenu();
            this._notify('onItemsChange');
         }
      },
      /**
       * <wiTag group="Отображение">
       * Отображает/скрывает элемент меню с указанным id
       * @see showItem, hideItem
       * @param {String} id - id пункта меню
       * @param {Boolean} visible - показать(true)/скрыть(false)
       * @example
       * <pre>
       *    menu.toggleItem(id, visible);
       * </pre>
       */
      toggleItem: function (id, visible) {
         if (this.hasItem(id)) {
            this[visible ? 'showItem' : 'hideItem'](id);
         }
      },
      /**
       * <wiTag group="Управление">
       * Устанавливает активным/неактивным элемент меню с указанным id
       * @param {String} id ID пункта меню
       * @param {Boolean} status Состояние активности: актинвый(true)/неактивный(false)
       * @example
       * <pre>
       *    menu.setEnabledById(id, status);
       * </pre>
       */
      setEnabledById: function (id, status) {
         if (this.hasItem(id)) {
            status = !!status;
            this._container.find('#' + id).toggleClass('ws-disabled', !status);
         }
      },
      /**
       * <wiTag group="Управление">
       * Устанавливает активным/неактивным элемент меню с указанным id
       * @deprecated Не использовать. Для замены использовать {@link setEnabledById}. Удаляется с 3.7
       * @param {String} id ID пункта меню
       * @param {Boolean} enabled Состояние активности: актинвый(true)/неактивный(false)
       * @example
       * <pre>
       *    menu.setItemEnabled(id, enabled);
       * </pre>
       */
      setItemEnabled: function (id, enabled) {
         this.setEnabledById(id, enabled);
      },

      /**
       * <wiTag group="Отображение">
       * Добавляет подменю элементу меню с указанным id
       * @see hasSubMenu
       * @see destroySubMenu
       * @param {String} elementId - id пункта меню
       * @param {Array} subMenu - описание подменю
       * @example
       * <pre>
       *    menu.addSubMenu(elementId, [
       *       {
       *          caption: 'save',
       *          imgSrc: "sprite:icon-16 icon-Save icon-primary",
       *          id: "save",
       *          handlers: {
       *             'onActivated': function(){
       *                //...
       *             }
       *          }
       *       },
       *       {
       *          caption: 'print',
       *          imgSrc: "sprite:icon-16 icon-Print icon-primary",
       *          id: "print",
       *          handlers: {
       *             'onActivated': function(){
       *                //...
       *             }
       *          }
       *       }
       *    ]);
       * </pre>
       */
      addSubMenu: function (elementId, subMenu) {
         if (this.hasSubMenu(elementId)) {
            this.destroySubMenu(elementId);
         }
         if(elementId && this.hasItem(elementId) && subMenu && subMenu.constructor === Array) {
            var element = this._findMenuElementAndDoAction(this._options.data, elementId, this._addSubMenu, subMenu),
                appendingMenu = $(dotTplFn(subMenu, this)).attr('id', element.subMenuId),
                menuItem = this._container.find('#' + element.id);
            this.hide();
            this._container.append(appendingMenu);
            menuItem.addClass('ws-with-submenu')
               .append($('<span class="ws-submenu-icon"></span>'));
            delete this._itemEvents[elementId];
            this._makeMenuItems(appendingMenu, subMenu);
            if (appendingMenu.find('.ws-menu-hasImg:first').length > 0) {
               appendingMenu.addClass('ws-menu-image-padding');
            }
         }
      },
      _addSubMenu: function (array, index, subMenu) {
         var curItem = array[index];
         curItem.subMenu = subMenu;
         curItem.subMenuId = $ws.helpers.randomId();
         curItem.subMenu.parentMenu = curItem.subMenu.parentCfg = curItem;
      },
      /**
       * <wiTag group="Данные">
       * Возвращает есть ли подменю у элемента меню с указанным id
       * @see addSubMenu
       * @see destroySubMenu
       * @param {String} id - id пункта меню
       * @returns {Boolean} есть ли подменю
       * @example
       * <pre>
       *    menu.hasSubMenu();
       * </pre>
       */
      hasSubMenu: function (id) {
         return this.hasItem(id) ? this._container.find('#' + id).hasClass('ws-with-submenu') : false;
      },
      /**
       * <wiTag group="Управление">
       * Удаляет подменю у элемента меню с указанным id если оно есть
       * @see addSubMenu
       * @see hasSubMenu
       * @param {String} elementId - id пункта меню
       * @example
       * <pre>
       *    menu.destroySubMenu(elementId);
       * </pre>
       */
      destroySubMenu: function (elementId) {
         if (elementId && this.hasItem(elementId)) {
            var element = this._findMenuElementAndDoAction(this._options.data, elementId);
            if (element.subMenu) {
               this.hide();
               this._container.find('#' + element.id + ' .ws-submenu-icon').remove();
               this._destroySubMenu(element);
               this._container.find('#' + element.id).removeClass('ws-with-submenu');
               this._notify('onItemsChange');
            }
         }
      },
      _destroySubMenu: function (element) {
         for (var i = 0, len = element.subMenu.length; i < len; i++) {
            if (element.subMenu[i].subMenu) {
               this._destroySubMenu(element.subMenu[i]);
            }
         }
         this._container.find('#' + element.subMenuId).remove();
         delete element.subMenu;
         delete element.subMenuId;
      },
      _addItem: function (array, index, item) {
         item.parentCfg = array[index].parentCfg;
         array.splice(index, 0, item);
      },
      /**
       * <wiTag group="Отображение">
       * Добавляет элемент в меню
       * @see insertItem
       * @see removeItem
       * @see hasItem
       * @param {Object} item Конфигурация элемента
       * @example
       * <pre>menu.addItem({
       *    'caption': 'caption',
       *    'imgSrc': 'path/to/image',
       *    'id': 'someUniqueId',
       *    'handlers': {
       *       'onActivated': function(){
       *          //...
       *       }
       *    }
       * });
       * </pre>
       */
      addItem: function (item) {
         this.insertItem(item);
      },
      /**
       * <wiTag group="Отображение">
       * Вставляет элемент в меню до указанного элемента
       * @see addItem
       * @see removeItem
       * @see hasItem
       * @param {Object} item Конфигурация нового элемента
       * @param {String|Number} [before] Идентификатор или порядковый номер элемента, до которого нужно вставить новый
       * @example
       * <pre>menu.insertItem({
       *    'caption': 'caption',
       *    'imgSrc': 'path/to/image',
       *    'id': 'someUniqueId',
       *    'handlers': {
       *       'onActivated': function(){
       *          //...
       *       }
       *    }
       * }, 'someMenuItemId');
       * </pre>
       */
      insertItem: function (item, before) {
         //Проверяем параметр item, если он отсутствует или undefined - сразу выходим из функции
         if (!item && Object.prototype.toString.call(item) !== '[object Object]') {
            $ws.single.ioc.resolve('ILogger').log('Menu', 'element can not be created, because parameter "item" is undefined.');
            return;
         }
         //Проверяем, не добавлялся ли ранее данный элемент
         if (this.hasItem(item.id)) {
            $ws.single.ioc.resolve('ILogger').log('Menu', 'element can not be created, because ID ' + item.id + '" is already used.');
            return;
         }
         var lastItemIndex = this._options.data.length - 1;
         if (before === undefined) { //Устанавливаем параметр before, если он отсутствует
            before = this._options.data.length;
         }
         var newItem = $(menuItemTpl(item, this)),
            targetItem;
         this._recalculateMenu();
         if (item.id !== undefined && item.caption !== undefined) { //Если есть ID и caption - добавляем НЕ separator
            if(item.handlers && item.handlers instanceof Object){
               this._itemEvents[item.id] = item.handlers;
            }
            this._itemEvents[item.id] = item.handlers;
            this._initItemEvents(newItem, item);
         }
         //Если предыдущего нет (before < 0), то добавляем через append в самое начало, иначе (before > 0) append, иначе - insertBefore
         if (typeof before === 'number') {
            if (before < 0) {
               this._menu.prepend(newItem);
               item.parentCfg = this._options.data;
               this._options.data.push(item);
            } else if (before > lastItemIndex) {
               this._menu.append(newItem);
               item.parentCfg = this._options.data;
               this._options.data.push(item);
            } else {
               before = this._options.data[before].id;
               if (!before) {
                  return;
               }
               targetItem = this._findMenuElementAndDoAction(this._options.data, before, this._addItem, item);
               newItem.insertBefore(this._container.find('#' + targetItem.id));
            }
         } else {
            targetItem = this._findMenuElementAndDoAction(this._options.data, before, this._addItem, item);
            newItem.insertBefore(this._container.find('#' + targetItem.id));
         }
         this._recalculateMenu();
         this._notify('onItemsChange');
      },
      /**
       * <wiTag group="Отображение">
       * Применяет css элементу меню с указанным itemID
       * @param {String|Number} item Идентификатор или порядковый номер элемента меню
       * @param {Object} style Применяемый стиль
       */
      applyItemStyle: function (item, style) {
         if (!Object.isEmpty(style)) {
            var itemType = Object.prototype.toString.call(item),
                  element;
            itemType = itemType.slice(8, itemType.length - 1);
            if (itemType === 'Number') {
               element = this._container.find('.ws-main-menu li').eq(item - 1);
            } else if (itemType === 'String') {
               element = this._container.find('#' + item);
            }
            if (element.length > 0) {
               element.css(style);
            }
         }
      },
      /**
       * Находит элемент, выполняет над ним указанную функцию и возвращает его конфигурацию
       * @param searchArray Массив, в котором осуществляется поиск
       * @param searchId ID искомого элемента
       * @param action Выполняемая функция
       * @param addition Дополнительный параметр, передаваемый в исполняемую функцию последним
       * @returns {*} Конфигурация найденного элемента
       * @private
       */
      _findMenuElementAndDoAction: function (searchArray, searchId, action, addition) {
         var currentElement,
            result;
         for (var i = 0, len = searchArray.length; i < len; i++) {
            currentElement = searchArray[i];
            if (currentElement.id && currentElement.id === searchId) {
               result = currentElement;
               if (typeof action === 'function') {
                  action(searchArray, i, addition);
               }
               break;
            } else if (currentElement.subMenu) {
               result = this._findMenuElementAndDoAction(currentElement.subMenu, searchId, action, addition);
            }
         }
         return result;
      },
      /**
       * <wiTag group="Отображение">
       * Удаляет элемент
       * @see addItem
       * @see removeItem
       * @see hasItem
       * @param {String} id Идентификатор нужного элемента меню
       * @example
       * <pre>
       *    menu.removeItem(id);
       * </pre>
       */
      removeItem: function (id) {
         if (id && this.hasItem(id)) {
            this.destroySubMenu(id);
            var elementDOM = this._container.find('#' + id);
            if (elementDOM.length) {
               elementDOM.remove();
            }
            this._findMenuElementAndDoAction(this._options.data, id, this._removeItem);
            this._recalculateMenu();
            this._notify('onItemsChange');
         }
      },
      _removeItem: function (array, index) {
         array.splice(index, 1);
      },
      /**
       * <wiTag group="Данные">
       * Возвращает описание элементов меню
       * @return {Array} Массив объектов с описанием пунктов меню
       * @example
       * <pre>
       *    var items = menu.getData();
       *    if(!items.length){
       *       menu.hide();
       *    }
       * </pre>
       */
      getData: function () {
         return this._options.data;
      },
      /**
       * <wiTag group="Данные">
       * Определяет, есть ли элемент с указанным идентификатором
       * @see addItem
       * @see insertItem
       * @see removeItem
       * @param {String} id Идентификатор элемента, который необходимо проверить
       * @returns {Boolean}
       * @example
       * <pre>
       *    menu.hasItem();
       * </pre>
       */
      hasItem: function (id) {
         return typeof id === 'string' && id.length && this._container.find('#' + id).length > 0;
      },
      /**
       * <wiTag group="Данные">
       * Возвращает минимальную ширину контрола
       * @returns {Number}
       * @example
       * <pre>
       *    menu.getMinWidth();
       * </pre>
       */
      getMinWidth: function ( ) {
         return 0;
      },
      /**
       * <wiTag group="Данные">
       * Возвращает минимальную высоту контрола
       * @returns {Number}
       * @example
       * <pre>
       *    menu.getMinHeight();
       * </pre>
       */
      getMinHeight: function ( ) {
         return 0;
      },
      /**
       * <wiTag group="Управление">
       * Разрушает экземпляр класса
       * @example
       * <pre>
       *    menu.destroy();
       * </pre>
       */
      destroy: function ( ) {
         this._closeOnResize();
         this._menu = null;
         this._windowResizeHandler = null;
         this._focusOutHandler = null;
         $ws.proto.Menu.superclass.destroy.call(this, arguments);
      },
      /**
       * <wiTag group="Отображение">
       * Устанавливает текст для элемента
       * @see setItemIcon
       * @see setItemClickHandler
       * @param {String} id Идентификатор нужного элемента меню
       * @param {String} text Текст, который нужно будет поставить на нужный пункт меню
       * @example
       * <pre>
       *    menu.setItemText(id, text);
       * </pre>
       */
      setItemText: function (id, text) {
         if (this.hasItem(id)) {
            text = text || '';
            this._container.find('#' + id + ' .menu-span').text(text);
            this._findMenuElementAndDoAction(this._options.data, id, function(cfg, index){
               cfg[index].caption = text;
            });
            this._recalculateMenu();
            this._notify('onItemsChange');
         }
      },
      /**
       * <wiTag group="Отображение">
       * Устанавливает иконку для элемента
       * @see setItemText
       * @see setItemClickHandler
       * @param {String} id Идентификатор нужного элемента меню
       * @param {String} icon иконка из спрайта
       * @example
       * <pre>
       *    menu.setItemIcon(id, icon);
       * </pre>
       */
      setItemIcon: function (id, icon) {
         if (typeof icon === 'string' && this.hasItem(id) && icon.indexOf('sprite:') !== -1) {
            var itemContainer = this._container.find('#' + id),
                iconContainer = itemContainer.find('.ws-menu-image');
            if (iconContainer.length === 0) {
               itemContainer.prepend(iconContainer = $('<div class="ws-menu-image"></div>'));
               itemContainer.removeClass('ws-menu-item-without-image').addClass('ws-menu-hasImg');
            }
            iconContainer.removeClass(iconContainer.attr('class').split('ws-menu-image')[1]).addClass(icon.split('sprite:')[1]);
            this._findMenuElementAndDoAction(this._options.data, id, function(cfg, index){
               cfg[index].imgSrc = icon;
            });
            this._notify('onItemsChange');
         }
      },
      /**
       * <wiTag group="Управление">
       * Устанавливает обработчик на клик по указанному пункту меню
       * @see setItemText
       * @see setItemIcon
       * @param {String} id Идентификатор пункта меню
       * @param {Function} handler Функция, которую нужно вызывать
       * @example
       * <pre>
       *    menu.setItemClickHandler(id, function(){
       *       //...
       *    });
       * </pre>
       */
      setItemClickHandler: function (id, handler) {
         if (!this.hasSubMenu(id) && typeof handler === 'function') {
            if (typeof(this._itemEvents[id]) === 'undefined') {
               this._itemEvents[id] = {};
            }
            this._itemEvents[id].onActivated = handler;
         }
      },
      /**
       * <wiTag group="Отображение">
       * Устанавливает подсказку для элемента меню
       * @see setItemText
       * @see setItemClickHandler
       * @param {String} id Идентификатор нужного элемента меню
       * @param {String} tooltip подсказка
       * @example
       * <pre>
       *    menu.setItemTooltip(id, tooltip);
       * </pre>
       */
      setItemTooltip: function (id, tooltip) {
         if (this.hasItem(id)) {
            this._container.find('#' + id).attr('title', tooltip);
            this._findMenuElementAndDoAction(this._options.data, id, function(cfg, index){
               cfg[index].tooltip = tooltip;
            });
            this._notify('onItemsChange');
         }
      }
   });

   return $ws.proto.Menu;

});
