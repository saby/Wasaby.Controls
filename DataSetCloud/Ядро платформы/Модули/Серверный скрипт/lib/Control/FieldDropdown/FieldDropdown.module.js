/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 18:38
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.FieldDropdown', ['js!SBIS3.CORE.FieldAbstract', 'js!SBIS3.CORE.TDataSource', 'html!SBIS3.CORE.FieldDropdown', 'css!SBIS3.CORE.FieldDropdown', 'is!browser?js!Ext/jquery-ui/jquery-ui-position'], function( FieldAbstract, TDataSource, dotTplFn ) {

   'use strict';

   var
      BORDER_SIZE = 1,
      MAX_HEIGHT = 300,
      MAX_WIDTH_HOVER_STYLE = 650,
      EMPTY_TEXT = 'Не выбрано',

      position = {
         my : {
            standard:   'left top-1',
            simple:     'left-1 top-2',
            hover:      'left-5 top-1'
         },
         at : {
            standard:   'left bottom',
            simple:     'left top',
            hover:      'left top'
         }
      };

   /**
    * Выпадающий список. 
    * 
    * Добавлен управлящий класс .ws-dropdown-fixed-width, фиксирующий ширину выпадающего списка даже при длинных значениях. 
    * При этом у не поместившихся значений добавляется троеточие в конце и тултип с полным сообщением. 
    * 
    * @class $ws.proto.FieldDropdown
    * @extends $ws.proto.FieldAbstract
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.FieldDropdown'></component>
    * @category Select
    * @designTime actions SBIS3.CORE.FieldString/design/design
    * @designTime plugin /design/DesignPlugin
    * @ignoreOptions width
    */
   $ws.proto.FieldDropdown = FieldAbstract.extend(/** @lends $ws.proto.FieldDropdown.prototype */{
      /**
       * @event onAfterLoad При окончании загрузки
       * Событие, извещающее об окончании загрузки из внешнего источника {@link dataSource}.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Boolean} isSuccess Успешна ли загрузка. true - успех.
       * @param {Object} data Полученные данные или объект ошибки в случае не успеха.
       * @example
       * <pre>
       *    dropdown.subscribe('onAfterLoad', function(event, success, data) {
       *       if (success) {
       *          if(Array.indexOf(this.getKeys(), 48) !== -1) {
       *             this.insertOption(56, this.getValueByKey(48));
       *             this.removeOption(48);
       *          }
       *       }
       *    });
       * </pre>
       * @see dataSource
       */
      /**
       * @event onBeforeLoad Перед началом загрузки
       * Событие, извещающее о начале загрузки.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    dropdown.subscribe('onBeforeLoad', function(event) {
       *       $ws.helpers.message('Началась загрузка выпадающего списка!');
       *    });
       * </pre>
       */
      /**
       * @event onClickMore При клике по системной опции 'hasMore' (текст "Еще...") выпадающего списка.
       * Актуально только(!) для renderStyleHover = 'hover'
       * Опция не устанвливается в качестве выбранной. Используется в {@link $ws.proto.PathFilter}
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       */
      $protected: {
         _recordSet: null,
         _initialFilter: {},
         _options: {
            /**
             * @cfg {Boolean} Разрешить пустое значение
             * <wiTag page=1>
             * Добавить значение null в выборку в режиме 'Источник данных'.
             * @see emptyValue
             * @see setEmptyValue
             */
            allowEmpty: false,
            /**
             * @cfg {String} Текст пустого значения
             * <wiTag page=1>
             * Текст, отображаемый в null-опции при активированной опции allowEmpty.
             * @see isAllowEmpty
             * @see setAllowEmpty
             * @translatable
             * @see allowEmpty
             * @see setEmptyValue
             */
            emptyValue: '',
            /**
             * @typedef {Object} FilterParam
             * @property {string} fieldName Имя поля
             * @property {boolean} [autoreload=true] Перезагружать данные при изменении поля в контексте
             */
            /**
             * @cfg {Object.<string, boolean|number|string|FilterParam>} Параметры фильтрации списочного метода бизнес-логики
             * <wiTag page=1>
             * Параметры, использующиеся для фильтрации данных при запросе их из внешних источников.
             * Могут иметь константное значение, являться результатом вызова обработчика или быть полем текущего контекста.
             * <pre>
             *    filterParams : {
             *       "Подразделение" : "Управление",
             *       "УчетныйГод" : function() {
             *          return (new Date).getFullYear();
             *       },
             *       "Сотрудник" : {
             *          "fieldName" : "Запись.ФиоСотрудника"
             *       }
             *    }
             * </pre>
             * @group Data
             */
            filterParams: {},
            /**
             * @cfg {Object} Источник данных
             * <wiTag page=1>
             * Описание внешнего источника данных:
             * 1. источник статических данных;
             * 2. источник динамических данных (метод бизнес-логики);
             * @example
             * Пример задания источника динамических данных:
             * <pre>
             *     dataSource : {
             *        firstRequest : true,
             *        readerParams : {
             *           queryName : "Список",
             *           linkedObject : "СвязанныйОбъект",
             *           format : "БазовоеРасширение"
             *        }
             *     }
             * </pre>
             * @see data
             * @see mode
             * @see onAfterLoad
             * @editor TDataSourceEditorNoMethods
             * @group Data
             */
            dataSource: TDataSource,
            /**
             * @cfg {Function} Пользовательская функция рендеринга отображаемого значения
             * <wiTag group="Отображение">
             * TODO описание, пример
             */
            valueRender: '',
            /**
             * @cfg {Function} Функция рендеринга значения в контейнере выпадающего списка
             */
            titleRender: '',
            /**
             * @cfg {String} Колонка записи, используемая для отображения
             * <wiTag page=1>
             * Данный параметр отвечает за текст, отображаемый в выпадающем списке.
             * Определяет колонку данных, из которой будет заполняться этот текст.
             * Работает при взятии данных с {@link dataSource}.
             * @see dataSource
             * @see mode
             * @see getDisplayColumn
             * @see setDisplayColumn
             * @group Data
             * @editor BLFieldsChooser
             */
            displayColumn: '',
            /**
             * @typedef {Object} Elements
             * @property {String} key ключ
             * @property {String} value значение
             */
            /**
             * @cfg {Elements[]} Данные, доступные для выбора из выпадающего списка
             * <wiTag page=2>
             * Опция не используется в режимах month и year. Подробнее смотреть в {@link mode}.
             * Задаётся в виде [{key : <ключ1>, value : <значение1>}, {key : <ключ2>, value : <значение2>}, ...]
             * @example
             * <pre>
             *     <options name='data' type='array'>
             *        <options>
             *           <option name='key' value='ДЕТИ'></option>
             *           <option name='value' value='ДЕТИ'></option>
             *        </options>
             *        <options>
             *           <option name='key' value='ДЕКРЕТ'></option>
             *           <option name='value' value='ДЕКРЕТ'></option>
             *        </options>
             *        <options>
             *           <option name='key' value='ДОГОВОР'></option>
             *           <option name='value' value='ДОГОВОР'></option>
             *        </options>
             *     </options>
             * </pre>
             * @see setData
             * @see dataSource
             * @see mode
             * @group Data
             */
            data: '',
            //TODO FieldDropdown ширина в IE с px не поддерживается(падает).
            /**
             * @cfg {String} Ширина
             * <wiTag group="Отображение">
             * В FieldDropdown при определении ширины как string(с px), в IE падает.
             * @noShow
             */
            width: '100px',
            /**
             * @cfg {String} Режим отображения данных
             * <wiTag group="Данные">  
             * Если передать '' или не передать вовсе, то поиск данных пойдёт по пути:
             * <ol>
             * <li> сначала {@link data},</li>
             * <li> затем {@link dataSource} - внешний источник данных/метод бизнес-логики.</li>
             * </ol>    
             * @see data
             * @see dataSource
             * @see firstYear
             * @see lastYear
             * @variant month отображать список месяцев
             * @variant year отображать диапазон лет
             * @variant '' для всех остальных режимов
             */
            mode: '',
            /**
             * @cfg {String} Колонка записи, используемая как ключ элемента списка
             * <wiTag page=1>
             * Данный параметр отвечает за значения элементов выпадающего списка.
             * Определяет колонку данных, из которой будут браться эти значения.
             * @see getItemValueColumn
             * @see setItemValueColumn
             * @group Data
             * @editor BLFieldsChooser
             */
            itemValueColumn: '',
            /**
             * @cfg {Boolean} Разрешить перенос текста
             * <wiTag group="Отображение">
             */
            wordWrap: false,
            /**
             * @cfg {Number} Первый отображаемый год
             * <wiTag page=3>
             * Год, с которого начинается диапазон лет.
             * Используется в режиме отображения year.
             * @see mode
             */
            firstYear: 2008,
            /**
             * @cfg {Number} Последний отображаемый год
             * <wiTag page=3>
             * При значении 0 устанавливается текущий год.
             * Используется в режиме отображения year.
             * @see mode
             */
            lastYear : 0,
            /**
             * @cfg {Boolean} Обязательно ли выбирать значение (+ нельзя выбрать пустое значение)
             */
            required: false,
            /**
             * @cfg {String} Отображение
             * <wiTag group="Отображение">
             * @variant standard обычный select
             * @variant simple упрощеный вариант в виде ссылки
             * @variant hover список показывается при наведении
             */
            renderStyle: 'standard',
            /**
             * @cfg {Boolean} Показывать ли текущий элемент в общем списке
             * <wiTag group="Отображение">
             */
            showSelectedInList: true,
            /**
             * @cfg {Boolean} Показывать ли подсказку в шапке выпадающего списка. Опция актуально только для renderStyle = 'Hover
             * <wiTag group="Отображение">
             */
            showTooltip : false
         },
         _menuTarget: undefined,
         _enum: '',
         _desiredDefaultValue: '',
         _dSetReady: '',
         _valueSet: false,
         _optCont: null,
         _optContHead: null,
         _optContList: null,
         _optArrow: undefined,
         _lastQueryFilter: undefined,
         _emptyInit: false,
         _hovered: false,
         _fKeyType: '',
         _dataType: ''
      },
      $constructor: function(){
         this._configChecking();
         this._publish('onAfterLoad', 'onBeforeLoad', 'onClickMore');
         this._createLoadingIndicator();
         this._dSetReady = this._prepareDeferredChain();
         this._initialFilter = $ws.core.merge({}, this._options.filterParams);
         this._lastQueryFilter = this._initialFilter;
         var
            data = this._options.data,
            isUserData = typeof(data) == 'object' && !Object.isEmpty(data),
            self = this;
         // Взводим переменную allowEmpty если в пользовательских данных есть строка с ключем null
         if (isUserData) {
            data = this._options.data = this._convertDataToExpectedFormat(data);
            var keys = data.keys;
            for (var i = 0, l = keys.length; i < l; i++) {
               if (keys[i] === null) {
                  if (!this.isAllowEmpty()) {
                     this.setAllowEmpty(true);
                  }
               } else if (typeof keys[i] !== 'string') {
                  keys[i] = keys[i].toString();
               }
            }
         }
         this._container
            .attr('title', this._options.tooltip)
            .css('width', this._options.width + 'px')
            .find('.ws-field')
               .addClass('ws-field-dropdown');
         // скрываем нативные списки если смотрим на мобильных устройствах в режиме hover
         if (($ws._const.browser.isMobileSafari || $ws._const.browser.isMobileAndroid) && this.isHover()) {
            this._container.addClass('ws-mobile')
         }
         this._inputControl.css('width', this._options.width + 'px');
         var
            container = this._container,
            renderStyle = this.getRenderStyle(),
            dom = [
               '<div class="custom-select' + (renderStyle === 'simple' ? ' asLink' : '') + '">',
                  '<div class="custom-select-text">Загрузка...</div>',
                  '<div class="custom-select-arrow"></div>',
               '</div>'
            ],
            dropdown = [
               '<div class="custom-options-container ws-hidden not-hovered' +
               ' custom-options-container-' + renderStyle + '"' +
               ' dropdown-owner-name="' + (this.getName() || '') + '"' +
               '>',
               '</div>'
            ],
            options = this._inputControl[0].childNodes,
            showAndPlace = function() {
               // для мобильных устройствах оставляем нативный селект (кроме режима hover)
               if (($ws._const.browser.isMobileSafari || $ws._const.browser.isMobileAndroid) && !self.isHover()) {
                  return;
               }
               $(document).bind('keydown.' + self.getId(), function (e) {
                  if (~$.inArray(e.which || e.keyCode, [$ws._const.key.tab, $ws._const.key.esc])) {
                     self._hideOptions();
                  }
               });
               var
                  // [Object] набор css-свойств контейнера выпадающего списка
                  css = {},
                  // [Object] jQuery поле выпадающего списка
                  select = container.find('.custom-select'),
                  // [Number] ширина поля (select)
                  containerWidth = select.parent().width(),
                  // [Boolean] итмеет ли список фиксированную ширину
                  fixedWidth = self._container.hasClass('ws-dropdown-fixed-width'),
                  // [Number] Ширина горизонтального скролла браузера
                  scrollWidth = $ws.helpers.getScrollWidth(),
                  // [Boolean] скрыт ли список
                  isHidden = self._optCont.hasClass('ws-hidden'),
                  // [Object] Range
                  range,
                  rects, rect,
                  // [Number] Ширина контейнера списка
                  width,
                  // [Number] Высота контейнера списка
                  height,
                  // [Boolean] имеет ли список список вертикальный скроллбар
                  hasScrollbar,
                  // [Object] jQuery элемент списка
                  $o,
                  // заголовок элемента списка
                  optTitle = null;
               self._optCont.css('overflow-y', 'hidden').removeClass('ws-hidden');
               width = self._optCont.width() + BORDER_SIZE * 2;
               height = self._optCont.height() + BORDER_SIZE * 2;
               hasScrollbar = ((self._optCont.get(0).scrollHeight > MAX_HEIGHT) && !self.isHover()) || $ws.helpers.hasScrollbar(self._optCont);
               // ie не включает ширину скроллбара в min-width
               css['min-width'] = containerWidth - (hasScrollbar && self.isHover() ? scrollWidth : 0);
               css['max-width'] = fixedWidth ? css['min-width'] : '';
               css['overflow-y'] = '';
               if (hasScrollbar && self.isHover() && width + scrollWidth < MAX_WIDTH_HOVER_STYLE) {
                  width += scrollWidth;
                  css['width'] = width;
               }
               self._optContList
                  .toggleClass('custom-options-container-with-scrollbar', hasScrollbar)
                  .css(css);
               self._menuTarget = self._container.find('.ws-field');
               self._recalculateMenu(position);
               $ws.helpers.trackElement(self._menuTarget).subscribe('onMove', function () {
                  self._recalculateMenu(position);
               }, self);
               // Проставляем title опциям, которые визуально не убрались и снимаем тем, которые поместились.
               if (!$ws._const.browser.isIE) {
                  $ws.helpers.forEach(self._optCont.find('.custom-select-option'), function (o) {
                     range = document.createRange();
                     range.selectNodeContents(o);
                     rects = range.getClientRects();
                     rect = rects[0];
                     $o = $(o);
                     if (rect && rect.width > $o.width()) {
                        optTitle = $o.text();
                     }
                     if (optTitle && (!this.isHover() || (this.isHover() && this._options.showTooltip))) {
                        $o.attr('title', optTitle);
                     }
                  });
               }
               // TODO выпилить стрелки\спрайты, перевести все на шрифты
               if (isHidden) {
                  if (!self.isHover()) {
                     self._optArrow.addClass('custom-select-arrow-open');
                  }
                  self._container.trigger('wsSubWindowOpen');
               } else {
                  self._hideCustomContainer();
               }
            },
            changeFunc = function(select){
               var
                  // Если отображаем выбранную запись в общем списке, то ищем её в dom, иначе - берем сохраненное в _textSelectedRow значение
                  txt = (self.isShowSelectedInList() ? self._optCont.find('[value="'+ select.value +'"]').html() : self._textSelectedRow) || '&nbsp;',
                  cont = container.find('.custom-select-text'),
                  record = self._recordSet && self._recordSet.contains(select.value) && self._recordSet.getRecordByPrimaryKey(select.value),
                  value,
                  titleRender = self.getTitleRender(),
                  data = self._options.data;
               for (var i = 0, len = data.k.length; i < len; ++i) {
                  if (data.k[i] == select.value) {
                     value = data.v[i];
                     break;
                  }
               }
               if (self._isEmptyOption(select.value, txt)) {
                  cont
                     .addClass('ws-dropdown-placeholder')
                     .text(self.getTooltip());
               } else {
                  cont.removeClass('ws-dropdown-placeholder');
                  if (typeof titleRender === 'function') {
                     cont.empty().append(titleRender.apply(self, record ? [record] : [select.value, value]));
                  } else {
                     cont.html(txt);
                  }
                  self._optCont
                     .find('div')
                     .removeClass('selected-option')
                     .each(function(){
                        if ($(this).attr('value') == select.value) {
                           $(this).addClass('selected-option');
                        }
                     });
               }
            };
         container
            .find('.ws-field')
               .append(dom.join(''))
               .end()
            .find('.dropdown-fake')
               .remove();
         this._optCont = $(dropdown.join('')).addClass(this._options.cssClassName);
         this._optContHead = $(
            '<div></div>',
            {'class': 'custom-options-container-head'}
         ).appendTo(this._optCont);
         this._optContList = $(
            '<div></div>',
            {'class': 'custom-options-container-list'}
         ).appendTo(this._optCont);
         this._optArrow = container.find('.custom-select-arrow');
         if (this.isHover()) {
            this._optArrow
               .addClass('custom-select-arrow-hover icon-16 icon-DayForward icon-primary')
               .insertBefore(this._container.find('.custom-select-text'));
         }
         $('body').append(this._optCont);
         this._optCont
            .mousedown(function(e){
               e.stopImmediatePropagation();
            })
            .bind('mousewheel', function(event){
               event.stopPropagation();
               return true;
            });
         var customSelect = container
            .find('.custom-select')
               .mousedown(function(e){
                  if (!self._optCont.hasClass('ws-hidden')) {
                     e.stopImmediatePropagation();
                  }
               })
               .click(function(){
                  if (!container.hasClass('ws-disabled')){
                     self._inputControl.focus();
                     showAndPlace();
                  }
               });
         if (typeof this.getValueRender() !== 'function' && this.getRenderStyle() === 'simple') {
            this._optContList.addClass('ws-custom-options-border');
         }
         if (this.isHover()) {
            customSelect
               .mouseenter(function(){
                  if (!container.hasClass('ws-disabled')){
                     showAndPlace();
                  }
               })
               .mouseleave(function(){
                  self._hideOptionsAfterTimeout();
               });
            this._optContList
               .mouseleave(function(){
                  self._hideOptionsAfterTimeout();
               })
               .mouseenter(function(){
                  self._hovered = true;
               });
            this._optContHead
               .mouseleave(function(){
                  self._hideOptionsAfterTimeout();
               })
               .mouseenter(function(){
                  self._hovered = true;
               });
         }
         $(document).bind('mousedown.' + this.getId() + ' wsmousedown.' + this.getId(), function() {
            if (self._optCont) {
               self._hideOptions();
            }
         });
         self._container.bind('keydown', function(e){
            if (e.which == $ws._const.key.esc && self._optCont && !self._optCont.hasClass('ws-hidden')) {
               self._hideOptions();
               e.stopImmediatePropagation();
            } else if (e.altKey && (e.keyCode == $ws._const.key.down || e.keyCode == $ws._const.key.up)) {
               if (self._optCont && self._optCont.hasClass('ws-hidden')) {
                  showAndPlace();
               }
               return false;
            } else if (e.keyCode == $ws._const.key.enter && !e.ctrlKey && !e.altKey && !e.shiftKey) {
               return false;
            }
         });
         this._inputControl
            .blur(function(){
               if (!self.isActive()) {
                  self._hideOptions();
               }
            })
            .bind('change.themed keypress keyup', function() {
               if (!self._options.showSelectedInList) {
                  self._fillDropdown();
               }
               changeFunc(this);
            });
         this.subscribe('onAfterLoad', function() {
            self._fillDropdown();
            self._dSetReady.addCallback(function(d) {
               changeFunc(self._inputControl[0]);
               return d;
            });
         });
      },
      _recalculateMenu: function(position) {
         var
            targetOffset = this._menuTarget.offset(),
            menuTurned,
            renderStyle = this.getRenderStyle(),
            leftMargin = 0;
         this._optCont.position({
            my: position.my[renderStyle],
            at: position.at[renderStyle],
            collision: 'flip',
            of: this._menuTarget,
            using: function(pos) {
               // Обязательно округляем отступ таргета + учитываем оффсет -5px для стиля "hover"
               menuTurned = Math.round(targetOffset.left) - 5 > pos.left;
               this._optCont.css(pos);
            }.bind(this)
         });
         if (this.isHover()) {
            // Если сработал flip, то задаём head-контейнеру маржин, равный разнице ширин списка контейнера и заголовка (иначе - обнуляем маржин)
            if (menuTurned) {
               leftMargin = this._optContList.width() - this._optContHead.width();
               if (leftMargin < 0) {
                  leftMargin = 0;
               }
            }
            this._optContHead
               .css('margin-left', leftMargin + 'px')
               .toggleClass('custom-options-container-head-reversed', parseFloat(this._optContList.css('top')) < -1)
               // Установка title т.к. текст может не влезать.
               .attr('title', this._options.showTooltip ? this._optContHead.text() : '');
         }
      },

      /**
       * Скрытие меню без выбора значения
       */
      hideMenu : function(){
         this._hideOptions();
      },
      _hideOptionsAfterTimeout: function() {
         this._hovered = false;
         var self = this;
         setTimeout(function(){
            if(self.isDestroyed()) {
               return;
            }
            if(!self._hovered) {
               self._hideOptions();
            }
         }, 42);
      },
      _configChecking: function() {
         if(this.isHover()) {
            this.setShowSelectedInList(false);
         }
      },
      _canValidate: function() {
         return this.isRequired() || $ws.proto.FieldDropdown.superclass._canValidate.apply(this, arguments);
      },

      _isEmpty: function() {
         var value = this._curValue();
         return (typeof(value) === 'undefined' || value === null || value === null);
      },
      _invokeValidation: function() {
         // ToDo: копипаста из FieldString, нужно рефакторить
         var parentResult = $ws.proto.FieldDropdown.superclass._invokeValidation.apply(this, arguments);
         if (this.isRequired() && this._isEmpty()) {
            parentResult.result = false;
            parentResult.errors.push(this._options.errorMessageFilling);
         }
         return parentResult;
      },
      /**
       * Отображается ли выпадающий список в режиме "по ховеру"
       * @returns {boolean}
       */
      isHover: function(){
         return this.getRenderStyle() === 'hover';
      },
      _valuesAreEqual: function(key) {
         return this._curval === null || this._curval === 'null'
            ? key === null || key === 'null'
            : key == this._curval;
      },
      _fillDropdown: function() {
         var
            data = this._options.data,
            // содержимое data
            keys, values, rendered,
            // div с выбранной записью
            row,
            // Что отображаем визуально
            visual;
         if (!data) {
            return;
         }
         keys = data.k;
         values = data.v;
         rendered = data.r;
         this._optCont
            .find('.custom-select-option')
               .unbind('click')
               .remove();
         for (var i = 0, l = keys.length; i < l; i++) {
            visual = rendered[i] || values[i];
            // Если необязательно выбирать значение или не пустой итем
            if (!this.isRequired() || !this._isEmptyOption(keys[i], visual)) {
               row = this._createCustomRow(keys[i], visual);
               // Если нужно показывать выбранное в общем списке или значения не равны
               if (this.isShowSelectedInList() || !this._valuesAreEqual(keys[i])) {
                  this._toggleCurrentRow(row, false);
                  this._optContList.append(row);
                  // Иначе - обрабатываем выбранную (текущую) запись
               } else {
                  this._textSelectedRow = values[i];
                  if(this.getRenderStyle() === 'simple') {
                     this._toggleCurrentRow(row);
                     this._optContList.prepend(row, true);
                  } else if (this.isHover()) {
                     if (this._options.titleRender) {
                        row = this._options.titleRender.apply(this, [keys[i], values[i]]);
                        row = this._createCustomRow(keys[i], row);
                     } else {
                        row = row.clone();
                     }
                     row
                        .prepend(
                           this._optArrow.clone()
                              .addClass('custom-select-arrow-open' + (this.isHover() ? ' icon-ArrowDown icon-hover' : ''))
                              .removeClass('icon-DayForward icon-primary'))
                        .prependTo(this._optContHead);
                     this._toggleCurrentRow(row, true);
                  }
               }
            }
         }
      },
      /**
       * устанавливает/убирает класс текущей строки для переданной
       * @param {jQuery} row Строка выпадающего списка, которая должна стать текущей
       * @param {Boolean} isCurrent - параметр указывающий на то какая строка передается для обработки
       * @private
       */
      _toggleCurrentRow: function(row, isCurrent){
         var selectedRowClass = 'ws-field-dropdown-current';
         if (isCurrent === undefined) {
            isCurrent = true;
         }
         if (!isCurrent && row.hasClass(selectedRowClass)) {
            row.removeClass(selectedRowClass);
         } else if (isCurrent) {
            // текущей может быть только одна строка, поэтому с остальных строк пометку снимаем, если найдем такие
            this._optContList.find('.' + selectedRowClass).removeClass(selectedRowClass);
            row.addClass(selectedRowClass); //Вешаем на строку класс, что она "текущая"
         }
      },
      /**
       * Является ли опция пустой
       * @param {String} key Первичный ключ
       * @param {String} value Отображаемый текст
       * @returns {Boolean}
       * @private
       */
      _isEmptyOption: function(key, value){
         value = value + '';
         return ((key === 'null' || key === null) && (value == 'null' || value.replace(/^\s+|\s+$/g, '') === '' || value === '&nbsp;')) || value === EMPTY_TEXT;
      },
      _hideCustomContainerIfVisible: function() {
         if (this._optCont && !this._optCont.hasClass('ws-hidden')) {
            this._hideCustomContainer();
         }
      },
      /**
       * Скрывает выпадающее меню и сообщает об этом
       * @private
       */
      _hideCustomContainer: function(){
         this._optArrow.removeClass('custom-select-arrow-open');
         this._optCont.addClass('ws-hidden');
         $ws.helpers.trackElement(this._menuTarget, false);
         this._container.trigger('wsSubWindowClose');
      },
      /**
       * Скрывает выпадающее меню (для кастомного выпадающего списка), если оно было открыто
       * @private
       */
      _hideOptions: function() {
         this._hideCustomContainerIfVisible();
         $(document).unbind('keypress.' + this.getId());
      },
      /**
       * Создаёт строку для кастомного списка
       * @param {*} key Ключ
       * @param {*} value Значение
       * @return {jQuery} Новая строка
       * @private
       */
      _createCustomRow: function(key, value){
         var
            custom = value instanceof jQuery,
            container = custom ? value : $('<div></div>'),
            self = this,
            isEmpty = !value;
         container
            .addClass('custom-select-option')
            .attr('value', key + '')
            .click(this._selectingEvent.bind(this));
         if (!custom){
            container
               .css({'whiteSpace' : self.isWordWrap() ? 'normal' : 'nowrap'})
               .html($ws.helpers.escapeHtml('' + (value === null ? '' : value)) || EMPTY_TEXT);
            if(isEmpty){
               container.addClass('ws-field-dropdown-empty');
            }
         }
         return container;
      },
      /**
       * Обработка события выбора элемента списка
       * @param {Event} e Передаваемое событие
       * @private
       */
      _selectingEvent: function(e) {
         this._curval = $(e.target).closest('.custom-select-option').attr('value');
         // Для режима hover не надо обрабатывать клик, если значения одинаковые - иначе слетает max-width
         if (!this.isHover() || (this._inputControl.val() !== this._curval)) {
            this._hideOptions();
            if (this._curval !== 'hasMore') {
               this._inputControl.val(this._curval);
               this._inputControl.change();
            } else {
               this._notify('onClickMore');
               return false;
            }
            this._inputControl.focus();
         }
         e.stopImmediatePropagation();
      },
      _dotTplFn: dotTplFn,
      _bindInternals: function() {
         this._inputControl = this._container.find('select');
      },
      init: function(){
         this._fillData();
         $ws.proto.FieldDropdown.superclass.init.apply(this, arguments);

         this._dSetReady.addBoth(function(res){
            this._notify("onReady");
            return res;
         }.bind(this)).addCallback(function(res){
            this._initialValueSetted = true;
            return res;
         }.bind(this));
      },
      _prepareFillData: function() {
         this._inputControl.children().remove();
         this._createLoadingIndicator(); //Для рекордСета
         this._emptyInit = false;
         this._dSetReady = this._prepareDeferredChain();
         this._initialValueSetted = true;
      },
      _fillData: function() {
         var
            data = this._options.data,
            today = new Date(),
            mode = this.getMode(),
            curYear = today.getFullYear(),
            firstYear = this.getFirstYear(),
            lastYear = this.getLastYear() || curYear;
         if (mode !== '') {
            switch (mode) {
               case 'month':
                  data = {
                     keys :   [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ],
                     values : [
                        'январь', 'февраль', 'март',
                        'апрель', 'май', 'июнь',
                        'июль', 'август', 'сентябрь',
                        'октябрь', 'ноябрь', 'декабрь'
                     ]
                  };
                  this._desiredDefaultValue = today.getMonth();
                  break;
               case 'year':
                  data = { keys: [], values: [] };
                  if (firstYear >= lastYear) {
                     lastYear = firstYear;
                  }
                  for (var year = firstYear; year <= lastYear; year++) {
                     data.keys.push(year);
                     data.values.push(year);
                  }
                  this._desiredDefaultValue = firstYear;
                  if (curYear <= lastYear && curYear >= firstYear) {
                     this._desiredDefaultValue = curYear;
                     if(!this._options.value){
                        this._options.value = curYear;
                     }
                  }
                  break;
               default:
                  throw new Error("Wrong predefined type specified for FieldDropdown: " + mode);
            }
            this._dSetReady.callback(data);
         } else if (typeof(data) === 'object' && !Object.isEmpty(data)) {
            this._dSetReady.callback(data);
         } else if (this._options.dataSource.isConfigured()) {
            this._prepareRecordSet();
         } else {
            this._dSetReady.callback({
               keys: [],
               values: []
            });
            this._emptyInit = true;
         }
      },
      /**
       * Помечаем, что установлено начальное значение, только после загрузки рекордсета
       * @private
       */
      _markInitialValueSetted: function(){
      },
      /**
       * <wiTag group="Данные" page=1>
       * Установить текст пустого значения выпадающего списка или заменить текст, ранее заданный параметром {@link emptyValue}.
       * Имеет смысл только для режима 'Источник данных'.
       * @param {String} newEmptyValue Новый текст пустого значения.
       * @see mode
       * @see allowEmpty
       * @see emptyValue
       */
      setEmptyValue: function(newEmptyValue){
         if (this.isAllowEmpty() && newEmptyValue) {
            this.setValue(newEmptyValue);
            this.getEmptyValue()
               ? this.changeValueByIndex(null, newEmptyValue)
               : this.insertOption(null, newEmptyValue, this.getKeys()[0]);
            this._inputControl.trigger('change.themed');
            this._options.emptyValue = newEmptyValue;
         }
      },
      /**
       * <wiTag group="Данные" page=1>
       * Получить параметр emptyValue — текст пустого значения выпадающего списка.
       * @return {String} свойство emptyValue выпадающего списка
       */
      getEmptyValue: function() {
         return this._options.emptyValue;
      },
      /**
       * <wiTag page=3>
       * Изменить начальный год списка.
       * Имеет смысл только для режима 'Год'.
       * @param {Number} firstYear Новый начальный год.
       * @see mode
       * @see setLastYear
       */
      setFirstYear: function(firstYear){
         this.setYears(firstYear, this._options.lastYear);
      },
      /**
       * Установка максимальной ширины для выпадающих списков в режиме 'hover'
       * @param {Number} width
       */
      setMaxWidthForHoverStyle : function(width) {
         if (width && this.isHover()) {
            this._optContHead.find('div').css('max-width', width + 'px');
         }
      },
      /**
       * Установка минимальной ширины элементов выпадающего списка списка  в режиме 'hover'
       * @param {Number} width
       */
      setMinWidthListForHoverStyle: function(width){
         if (width && this._options.renderStyle === 'hover') {
            this._optContList.find('div').css('min-width', width + 'px');
            this._options.width = width + 'px';
            this._container.css('width', this._options.width + "px");
            this._inputControl.css('width', this._options.width + "px");
         }
      },
      /**
       * <wiTag page=3>
       * Изменить конечный год списка.
       * Имеет смысл только для режима 'Год'.
       * @param {Number} lastYear Новый конечный год.
       * @see mode
       * @see setFirstYear
       */
      setLastYear: function(lastYear){
         this.setYears(this._options.firstYear, lastYear);
      },
      /**
       * <wiTag page=3>
       * Изменяет начальный и конечный года списка.
       * @param {Number} firstYear Новый начальный год.
       * @param {Number} lastYear Новый конечный год.
       * @see mode
       * @see setLastYear
       * @see setFirstYear
       */
      setYears: function(firstYear, lastYear){
         if(this.getMode() === 'year'){
            var
               data = { keys: [], values: [] },
               currentValue = this.getValue(),
               self = this;
            if (isNaN(firstYear)) {
               firstYear = this.getFirstYear();
            } else {
               this._options.firstYear = firstYear;
            }
            if(isNaN(lastYear)) {
               lastYear = this.getLastYear();
            } else {
               this._options.lastYear = lastYear;
            }
            for (var year = firstYear; year <= lastYear; year++) {
               data.keys.push(year);
               data.values.push(year);
            }
            this._inputControl.children().remove();
            this._dSetReady = this._prepareDeferredChain();
            this._dSetReady.addCallback(function(data) {
               if (Array.indexOf(data.k, self._castValue(currentValue)) !== -1) {
                  self.setValue(currentValue);
               } else {
                  var val = data.v[0];
                  if (val !== undefined || currentValue !== val) {
                     self.setValue(val);
                     self._notify('onChange', val);
                  }
               }
               return data;
            });
            this._dSetReady.callback(data);
         }
      },
      /**
       * <wiTag group="Данные" page=1>
       * Возвращает свойство {@link displayColumn} — колонку записи, используемую при отображении.
       * @returns {String} Свойство displayColumn выпадающего списка.
       * @see displayColumn
       * @see setDisplayColumn
       */
      getDisplayColumn: function() {
         return this._options.displayColumn;
      },
      /**
       * <wiTag group="Данные" page=1>
       * Возвращает свойство {@link itemValueColumn} — колонку записи, используемую для значения (ключа) элемента списка.
       * @returns {String} Свойство itemValueColumn выпадающего списка.
       * @see itemValueColumn
       */
      getItemValueColumn: function() {
         return this._options.itemValueColumn;
      },
      /**
       * <wiTag group="Данные" page=1>
       * Устанавливает свойство displayColumn — колонку записи, используемую при отображении.
       * @param {String} displayColumn Имя колонки рекордсета, которая будет отображаться в выпадающем списке.
       * @see displayColumn
       */
      setDisplayColumn: function(displayColumn) {
         this._options.displayColumn = displayColumn;
      },
      /**
       * <wiTag group="Данные" page=1>
       * Устанавливает свойство itemValueColumn — колонку записи, используемую для значений выпадающего списка.
       * Задайте '' для использования ключа записи.
       * @param {String} itemValueColumn Имя колонки рекордсета, которая будет использоваться для значений.
       */
      setItemValueColumn: function(itemValueColumn) {
         this._options.itemValueColumn = itemValueColumn;
      },
      /**
       * <wiTag group="Данные">
       * Установить новые данные.
       * Возможна установка статических данных или рекордсета.
       * @param {Object|$ws.proto.RecordSet} data Возможны два формата данных:
       * <ul>
       *    <li>[{key : <ключ1>, value : <значение1>}, {key : <ключ2>, value : <значение2>}, ...];</li>
       *    <li>{@link $ws.proto.RecordSet RecordSet}.</li>
       * </li>
       * @see data
       * @throws {TypeError} Если в качестве data передан не объект
       * @throws {TypeError} Если data имеет два массива keys и values различной длины
       * @throws {TypeError} Если передан RecordSet, но не задана отображаемая колонка записи
       */
      setData:function (data) {
         var
            obj = data,
            self = this,
            oldValue = this.getValue();

         if(typeof data !== 'object') {
            throw new TypeError('В метод setData можно передать либо простой JavaScript-объект либо RecordSet');
         }

         if(data instanceof $ws.proto.RecordSet) {
            if(this.getDisplayColumn() === '') {
               throw new TypeError('Невозможно установить данные через RecordSet т.к. не задана отображаемая колонка записи. Задайте отображаемую конолку через setDisplayColumn.');
            }
            // TODO Проверить, что в записях переданного рекордсета есть нужная колонка
         }

         this._prepareFillData();
         this._dSetReady.addCallback(function(data){
            self.setValue(oldValue);
            return data;
         });

         // Если пришел Object - преобразуем в нужный формат (рекордсет пробрасываем дальше)
         obj = this._convertDataToExpectedFormat(data);
         // Если у нас был рекордсет, обнулим ссылку на него чтобы не работали методы типа reload() и setQuery() со старым рекордсетом
         if (this._recordSet !== null) {
            this._recordSet = null;
         }
         this._dSetReady.callback(obj);
      },

      _convertDataToExpectedFormat: function(data) {
         var obj = data,
             keyToString = function(key) {
                return key === undefined ? '' : (typeof key === 'string' ? key : key + '');
             };
         if(!(data instanceof $ws.proto.RecordSet)) {
            if(data.keys instanceof Array && data.values instanceof Array) { // объект уже предположительно в нужном формате
               if(data.keys.length !== data.values.length) {
                  throw('setData, keys and values have different length');
               }
            } else {
               obj = { keys:[], values:[] };
               if($ws.helpers.type(data) === 'array') {
                  for (var j = 0; j < data.length; ++j) {
                     obj.keys.push(keyToString(data[j].key));
                     obj.values.push(data[j].value || '');
                  }
               } else {
                  for (var i in data) {
                     if (data.hasOwnProperty(i)) {
                        obj.keys.push(keyToString(i));
                        obj.values.push(data[i]);
                     }
                  }
               }
            }
         }

         return obj;
      },
      _setEnabled : function(enable) {
         $ws.proto.FieldDropdown.superclass._setEnabled.apply(this, arguments);
      },
      setActive: function(active, shiftKey, noFocus, control) {
         if (!active) {
            this._hideCustomContainerIfVisible();
         }
         // На iOS выпадающие списки <select> при получении фокуса сразу выпадают.
         // Пытаемся это предотвратить
         // Если на мобильном Safari,
         // передадим в метод родительского класса параметр noFocus == true (3 аргумент), чтобы реально фокус на элемент не перешел
         // передадим следующий контрол, куда уйдет фокус или с которого фокус уходит (4 аргумент)
         $ws.proto.FieldDropdown.superclass.setActive.apply(this, [active, undefined, ($ws._const.browser.isMobileSafari && !this.isHover()), control]);
      },
	   /**
         * <wiTag group="Данные"> 
		 * Устанавливает свойство required(обязательно ли выбирать значение) в зависимости от переданного параметра
		 * @param {Boolean} required Обязательно для выбора.
         * @see isRequired 
		 */
      setRequired: function(required) {
         required = !!required;
         this._options.required = required;
      },
      /**
       * <wiTag group="Данные">
       * Возвращает, обязательно ли выбирать значение.
       * @returns {Boolean}
       */
      isRequired: function() {
         return this._options.required;
      },
      _prepareRecordSet: function() {
         if(this._recordSet === null) {
            var
               self = this,
               dataSource = $ws.core.merge({
                  handlers: {
                     onAfterLoad: function(eventState, recordSet, isSuccess, error){
                        if (self._dSetReady){
                           if(isSuccess){
                              if (self.isHover() && recordSet.hasNextPage()) {
                                 self.insertOption('hasMore', 'Еще...');
                              }
                              self._dSetReady.callback(recordSet);
                           } else if (!(error instanceof HTTPError) || error.httpError !== 0) {
                              self._dSetReady.errback(error);
                           }
                        }
                     }
                  }
               }, this._options.dataSource);
            dataSource.context = this.getLinkedContext();
            dataSource.filterParams = $ws.core.merge(dataSource.filterParams || {}, this._options.filterParams);
            this._notify('onBeforeLoad');
            $ws.core.attachInstance('Source:RecordSet', dataSource).addCallbacks(function(rs){
               self._recordSet = rs;
               if (self._options.dataSource.firstRequest === false){
                  self._dSetReady.callback(rs);
               }
               return rs;
            }, function(e){
               self._dSetReady.errback(e);
               return e;
            });
         }
      },
      /**
       * Возвращает html-код опции для селекта
       * @param {*} key Ключ
       * @param {*} value Значение
       * @private
       */
      _optionTemplate: function(key, value){
         var optionValue = (String.trim('' + value) === '' || value === null) ? EMPTY_TEXT : value;
         optionValue = $ws.helpers.escapeHtml(optionValue);
         return '<option value="' + key + '" >' + optionValue + '</option>';
      },
      /**
       * Если есть "рендер", то применяет его с указанными аргументами и возвращает результат, иначе возвращает пустую строку
       * @param {Array} args Аргументы вызова
       * @return {jQuery|String}
       * @private
       */
      _renderOrNot: function(args){
         var valueRender = this.getValueRender();
         //мобильные устройства показывают свой выпадающий список, поэтому там нельзя отдать jQuery, а только текст
         return ((!$ws._const.browser.isMobileSafari && !$ws._const.browser.isMobileAndroid) || this.isHover()) && typeof valueRender === 'function' ? valueRender.apply(this, args) : '';
      },
      _prepareDeferredChain: function() {
         var
            self = this,
            isAllowEmpty = self.isAllowEmpty();

         return new $ws.proto.Deferred().addBoth(function(r){
            self._inputControl.find('.ws-loading-line').remove();
            return r;
         }).addCallback(function(data){ // Если пришел RecordSet - превратим его в Object
            var keysAndValues = { k: [], v: [], r: [] };

            if (data instanceof $ws.proto.RecordSet) {

               var
                  record,
                  key,
                  displayColumn = self.getDisplayColumn(),
                  itemValueColumn = self.getItemValueColumn(),
                  displayValue;

               self._dataType = 'RecordSet';

               // Заполним пустое значение.
               if (isAllowEmpty) {
                  keysAndValues.k.push(null);
                  keysAndValues.v.push(self.getEmptyValue());
                  keysAndValues.r.push(self._renderOrNot([null]));
               }

               data.rewind();
               while ((record = data.next()) !== false){
                  if (record.hasColumn(displayColumn)) {
                     displayValue = record.get(displayColumn);
                  }
                  if (itemValueColumn && record.hasColumn(itemValueColumn)) {
                     key = record.get(itemValueColumn);
                     switch (record.getColumnType(itemValueColumn)) {
                        case 'Число целое':
                        case 'Числовое значение':
                           key = Number(key);
                           break;
                        case 'Строка':
                           key += '';
                           break;
                     }
                  } else {
                     key = record.getKey();
                  }
                  displayValue = displayValue === null ? "null" : displayValue;
                  keysAndValues.k.push(key);
                  keysAndValues.v.push(displayValue);
                  keysAndValues.r.push(self._renderOrNot([record]));
               }

            } else {
               keysAndValues.k = data.keys;
               keysAndValues.v = data.values;
               keysAndValues.r = [];
               if (typeof self.getValueRender() === 'function') {
                  for (var i = 0, l = data.values.length; i < l; i++) {
                     keysAndValues.r[i] = self._renderOrNot([data.keys[i], data.values[i]]);
                  }
               }

               /**
                * WARNING! HARDCORE FIX!
                * Исправляем баг разного порядка перебора Object через for-in в Chrome (по сравнению со всем остальными)
                * затачиваемся на то, что null всегда должен быть первым
                * Мы лечим это так на скорую руку,
                * так как по делу придется менять формат передачи на стороне БЛ
                */
               var nIdx;
               if((nIdx = Array.indexOf(keysAndValues.k, 'null')) > 0) {
                  keysAndValues.k.splice(nIdx, 1);
                  var nVal = keysAndValues.v.splice(nIdx, 1);
                  var rVal = keysAndValues.r.splice(nIdx, 1);
                  keysAndValues.k.unshift('null');
                  keysAndValues.v.unshift(nVal[0]);
                  keysAndValues.r.unshift(rVal[0]);
               }
            }

            self._fKeyType = typeof (keysAndValues.k[isAllowEmpty ? 1 : 0]);

            return keysAndValues;
         }).addCallback(function(data) { // Отобразим данные в селекторе
            self._options.data = data;
            if (self._options.value !== ''){
               self._desiredDefaultValue = self._options.value;
            }

            for (var i = 0, l = data.k.length; i < l; i++) {
               var
                  val = data.r[i] || data.v[i],
                  key = data.k[i];

               if (i === 0) {
                  if(self._desiredDefaultValue === '' && self._options.value === ''){
                     self._desiredDefaultValue = key;
                     if(isNaN(self._desiredDefaultValue)){
                        self._desiredDefaultValue = key;
                     }
                  }
               }

               val = val instanceof jQuery ? val.text() : val;
               self._inputControl.append(self._optionTemplate(key, val));
            }
            self._defaultValue = self._desiredDefaultValue;

            return data;
         }).addCallbacks(function(data){
            self._notify('onAfterLoad', true, data);
            return data;
         }, function(e){
            self._notify('onAfterLoad', false, e);
            self._showError(e);
            return e;
         });
      },
      _onValueChangeHandler: function(){
         var val = this._inputControl.val();
         if (this._enum instanceof $ws.proto.Enum) {
            this._enum.set((val == 'null' || val === null) ? 'null' : parseInt(val, 10)); // В перечисялемом ключи только числа, 'null' и ничего иного
         }
         $ws.proto.FieldDropdown.superclass._onValueChangeHandler.apply(this, arguments);
         this._valueSet = true;
      },
      /**
       * <wiTag group="Данные" page=1>
       * Выполняет запрос к БЛ и заполняет Dropdown новыми данными.
       * @param {Object} filter Фильтр выборки.
       * @param {Boolean} [doClear=true] Признак, очищать или нет рекордсет при загрузке.
       * @example
       * <pre>
       *    onReloadButtonPressed: function() {
       *       var currentFilter = {"year" : this.getLinkedContext.getValue('Год')};
       *       this.getChildControlByName('ПричиныУвольнения').reload(currentFilter);
       *    }
       * </pre>       
       */
      setQuery: function(filter, doClear){
         var self = this;
         this._lastQueryFilter = filter; // запоминаем фильт для функции reload
         doClear = doClear === undefined ? true : doClear;
         if(doClear) {
            this._inputControl.children().remove();
            this._createLoadingIndicator();
         }
         if(this._recordSet !== null) {
            this._dSetReady = this._prepareDeferredChain();
            this._dSetReady.addCallback(function(data){
               if (doClear) {
                  var currentValue = self.getValue(); // Сработает, так как берём значение из контекста. И теперь можем устанавливать значение в onAfterLoad.
                  if (Array.indexOf(data.k, self._castValue(currentValue)) !== -1) {
                     self.setValue(currentValue);
                  } else {
                     var val;
                     val = data.k[0];
                     if(val !== undefined || currentValue !== val ){
                        self.setValue(val);
                        self._notify('onChange', val);
                     }
                  }
               }
               return data;
            });
            this._recordSet.setQuery(this._prepareFilter(filter), true);
         } else {
            throw new Error('Setting a query to FieldDropdown which has empty dataSource configuration');
         }
      },
      /**
       * <wiTag group="Управление" page=1>
       * Перезагрузить значения из внешнего источника данных.
       * Повторно вызовет метод setQuery c последним применённым фильтром.
       * @example
       * <pre>
       *    var dropdown = $ws.single.ControlStorage.getByName('СписокРежимов');
       *    if (dropdown) {
       *       dropdown.reload();
       *    }
       * </pre>
       */
      reload: function() {
         this.setQuery(this._lastQueryFilter);
      },
      _prepareFilter: function(filter) {
         for(var fName in filter) {
            if(filter.hasOwnProperty(fName) && filter[fName] === undefined) {
               filter[fName] = this._initialFilter[fName];
            }
         }
         return filter;
      },
      _onContextValueReceived: function(ctxVal) {
         var self = this;
         if (ctxVal instanceof $ws.proto.Enum) {
            if (this._dSetReady.isReady() && !this._emptyInit) { // Second run
               if (this._enum !== '') { // Already built by Enum
                  if (this._enum.getCurrentValue() !== ctxVal.getCurrentValue()) { // Value is changed
                     if (ctxVal.hashCode() !== this._enum.hashCode()) { 
                        // received Enum is not the same
                        throw new Error('Another Enum came from context, not the same as before (different available values)');
                     } else {
                        this._setValueInternal(ctxVal.getCurrentValue());
                        this._notifyOnValueChange(ctxVal);
                     }
                  }
               } else { // Already built and not by a Enum
                  throw new Error('FieldDropdown is already filled with data and Enum is came from context.');
               }
            } else {
               this._setValueInternal(ctxVal);
               this._notifyOnValueChange(ctxVal);
            }
         } else {
            this._dSetReady.addCallback(function(data){
               if (ctxVal !== undefined) {
                  if (!(ctxVal === null && !self.isAllowEmpty()) && (ctxVal !== self._notFormatedVal() ||
                        self._valueSet === false && ctxVal !== self._desiredDefaultValue)) {
                     var isFirstValueFromContext = !self._valueSet;
                     self._setValueInternal(ctxVal); // установит _valueSet = true
                     if(!isFirstValueFromContext){
                        self._notify('onChange', ctxVal);
                        self._notifyOnValueChange(ctxVal);
                     }
                  }
               }
               // FIXME использование 2 и 3 параметра в setValue
               if(self._valueSet === false) {
                  self.setValue(self._desiredDefaultValue, true, true);
               }
               return data;
            });
         }
      },
      _insertEnum : function(val){
         var
               self = this,
               enumVals = val.getValues(),
               enumCurVal = val.getCurrentValue(),
               kvPairs = { keys: [], values: [] };

         for (var k in enumVals) {
            if (enumVals.hasOwnProperty(k)) {
               if (k === null) {
                  this.setAllowEmpty(true);
               }
               kvPairs.keys.push(k === null ? 'null' : k);
               kvPairs.values.push(enumVals[k]);
            }
         }

         this._enum = new $ws.proto.Enum(val.toObject());
         this._desiredDefaultValue = enumCurVal === null ? 'null' : enumCurVal;

         this._dSetReady.callback(kvPairs).addCallback(function(data){
            self._setValueInternal(self._desiredDefaultValue);
            return data;
         });
      },
      _defaultValueHandler: function() {
         var self = this;
         this._dSetReady.addCallback(function(data){
            if(self._valueSet === false && self._desiredDefaultValue === '') {
               $ws.proto.FieldDropdown.superclass._defaultValueHandler.apply(self, []);
            }
            return data;
         });
      },
      _curValue : function(){
         return this._notFormatedVal();
      },
      _castValue: function(value) {
         if (value === null) {
            return value;
         }
         switch (this._fKeyType) {
            case 'string':
               value = '' + value;
               break;
            case 'number':
               value = Number(value);
               break;
         }
         return value;
      },
      getStringValue: function(){
         var value = this._inputControl.val() === '' ? this._curval : this._inputControl.val();
         value = value === 'null' ? null : value;
         if(value !== null) {
            value = this._castValue(value);
         }
         if (this._options.data.v) {
            // Вернем в виде строки либо результат рендера либо значение
            var idx = Array.indexOf(this._options.data.k, value), v;
            v = this._options.data.r[idx] || this._options.data.v[idx];
            return v instanceof jQuery ? v.text() : v;
         }
         else {
            //ToDo: Костылище! Надо разобраться с проблемой и отпилить. В панели фильтров вызывается метод до _prepareDeferredChain()
            return '' + value;
         }
      },
      /**
       * <wiTag group="Данные" page=1>
       * При наличии RecordSet'а возвращает запись, которая сейчас выбрана, иначе undefined
       * @returns {$ws.proto.Record|undefined}
       * @example
       * <pre>
       *    var record = dropdown.getSelectedRecord();
       *    if(record) {
       *       fillFieldsDataFromRec(record);
       *    }
       * </pre>       
       */
      getSelectedRecord: function(){
         var
            rec,
            self = this,
            itemValueColumn,
            rs = this.getRecordSet();
         if (!rs) {
            return undefined;
         }
         if (!this._options.itemValueColumn) {
            return rs.contains(this._curValue()) ? rs.getRecordByPrimaryKey(this._curValue()) : undefined;
         } else {
            itemValueColumn = self.getItemValueColumn();
            rs.each(function(record){
               if (record.get(itemValueColumn) == self._curValue()){
                  rec = record;
                  return false;
               }
            });
            return rec;
         }
      },
      _createLoadingIndicator: function() {
         this._inputControl.append('<option class="ws-loading-line" value="">Загрузка&hellip;</option>');
      },
      _notFormatedVal: function() {
         var value;
         if (this._enum instanceof $ws.proto.Enum) {
            return new $ws.proto.Enum(this._enum.toObject());
         }
         value = this._castValue(this._inputControl.val());
         if (value === 'null' || isNaN(value)) {
            value = this._curval || 'null';
         }
         if (value === 'null') {
            return null;
         } else if (value === undefined || value === '' || this._dataType === 'RecordSet') {
            return value;
         } else {
            var tryNum = Number(value);
            return isNaN(tryNum) || tryNum + '' !== value ? value : tryNum;
         }
      },
      _getElementToFocus: function(){
         return this._inputControl;
      },
      _testOnEmptyInit: function() {
         if (this._emptyInit) {
            this._emptyInit = false;
            this._dSetReady = this._prepareDeferredChain();
         }
      },
      _setValueInternal: function(val) {
         var
            // текущее значение select
            nowVal,
            // сравнение текущего значения и свойства _curval
            sameVal;
         if (val === undefined) {
            return;
         }
         if (val instanceof $ws.proto.Enum){
            this._testOnEmptyInit();
            if (!this._dSetReady.isReady()) {
               this._insertEnum(val);
            }
            val = val.getCurrentValue(); // val can become null here!
         }
         if (this._enum instanceof $ws.proto.Enum) {
            try {
               this._enum.set(val); // ok, enum handles null...
            } catch (e) {
               $ws.single.ioc.resolve('ILogger').log('FieldDropdown', e);
            }
         }
         this._curval = val === null ? 'null' : val; // must change to string, <select> can't handle null
         nowVal = this._inputControl.val();
         sameVal = nowVal == this._curval;     // А вдруг хотим поставить то же, что там уже установлено?
         this._inputControl.val(this._curval);     // Поставим желаемое
         if (nowVal != this._inputControl.val() || sameVal) {  // Проверим, поставилось ли
            this._valueSet = true;                 // Если поставилось - сообщим + запишем что у нас есть значение
            this._inputControl.trigger('change.themed');
            this._updateInPlaceValue(this.getStringValue());
         }
      },
      _showError: function(error) {
         this._inputControl.children().remove().end().append('<option value="">' + error.message + '</option>');
      },
      /**
       * <wiTag group="Управление">
       * При состоянии контрола, в котором запрещена запись - прокидывать служебные клавиши(tab, esc)
       */
      _passthroughControlButtons: function(){
         var self = this;
         this._inputControl.bind('keypress.readonly, change.readonly, keyup.readonly, keydown.readonly', function(event) {
            if ((!self._isChangeable()) && event.which != $ws._const.key.tab && event.which != $ws._const.key.esc) {
               self._inputControl.val(self._curval);
               event.stopImmediatePropagation();
            }
         });
      },
      destroy: function() {
         this._dSetReady = null;
         this._enum = null;
         if(this._optCont) {
            this._hideCustomContainerIfVisible();
            this._optCont.empty().remove();
         }
         $(document).unbind('.' + this.getId());
         $ws.proto.FieldDropdown.superclass.destroy.apply(this, arguments);
      },
      // ToDo: лучше использовать событие onAfterLoad или этот deferred?
      /**
       * <wiTag group="Данные" page=1>
       * Возвращает асинхронное событие готовности значения
       * Функция имеет смысл, если получает данные от бизнес-логики.
       * @example
       * <pre>
       *    dropdown.reload();
       *    dropdown.getValueDeferred().addBoth(function() {
       *       $ws.core.alert('Загрузка завершена!');
       *    });
       * </pre>
       * @return {$ws.proto.Deferred}
       */
      getValueDeferred: function(){
         return this._dSetReady;
      },
      /**
       * Инициализация дефолтного значения для дропдауна проходит в другом месте
       * @private
       */
      _initDefaultValue: function(){
      },
      /**
       * Обновляет классы на чётных строках выпадающего меню
       * @private
       */
      _updateOddClasses: function(){
         if( $ws._const.theme ){
            this._optCont.find('.ws-item-odd').removeClass('ws-item-odd');
            this._optCont.find('.custom-select-option:odd').addClass('ws-item-odd');
         }
      },
      /**
       * <wiTag page=2 group="Управление">
       * Добавляет опцию с указанным ключом и отображаемым значением
       * Если не указан before, то добавит в конец. Если указан - то перед элементом с ключом before.
       * @example
       * <pre>
       *    var
       *       keys = dropdown.getKeys(),
       *       lastKey = keys.length ? keys[ keys.length - 1 ] : undefined;
       *    dropdown.insertOption(998, 'Предпоследнее значение', lastKey);
       * </pre>
       * @param {*} key Ключ
       * @param {*} value Значение
       * @param {*} [before] Перед каким элементом вставлять
       */
      insertOption: function(key, value, before){
         if(this._emptyInit) { // Теоретически здесь могут возникнуть конфликты, когда значение вставят раньше, чем придёт оно из контекста.
            this._emptyInit = false;
         }
         this._dSetReady.addCallback(function() {
            var renderResult = this._renderOrNot([key, value]),
               beforeIndex,
               data = this._options.data;
            if( before !== undefined ){
               if (typeof (before) === 'boolean') {
                  beforeIndex = before ? 0 : data.k.length;
               }  else {
                  for(var i = 0; i < data.k.length; ++i){
                     if( data.k[i] == before ){
                        beforeIndex = i;
                        break;
                     }
                  }
               }
            }
            var
               option = $(this._optionTemplate(key, renderResult || value)),
               customOption = this._createCustomRow(key, renderResult || value);
            if (beforeIndex !== undefined) {
               data.k.splice(beforeIndex, 0, key);
               data.v.splice(beforeIndex, 0, value);
               data.r.splice(beforeIndex, 0, renderResult);
               option.insertBefore(this._inputControl.children().eq(beforeIndex));
               if (customOption) {
                  customOption.insertBefore(this._optContList.children().eq(beforeIndex));
               }
            } else {
               data.k.push(key);
               data.v.push(value);
               data.r.push(renderResult);
               option.appendTo(this._inputControl);
               if( customOption ){
                  customOption.appendTo(this._optContList);
               }
            }
         }.bind(this));
      },
      /**
       * <wiTag page=2>
       * Удаляет опцию с указанным ключом
       * @example
       * <pre>
       *    var uslessKey = dropdown.getKeyByValue('Текст ненужного значения');
       *    if ( uslessKey !== undefined ) {
       *       dropdown.removeOption(uslessKey);
       *    }
       * </pre>
       * @param {*} key Ключ опции
       */
      removeOption: function(key){
         this._dSetReady.addCallback(function(){
            var
               data = this._options.data,
               removingCurVal = this._inputControl.val() == key;
            for(var i = 0; i < data.k.length; ++i){
               if( key == data.k[i] ){
                  data.k.splice(i, 1);
                  data.r.splice(i, 1);
                  data.v.splice(i, 1);
                  this._inputControl.children().eq(i).remove();
                  this._optContList.children().eq(i).remove();
                  if(removingCurVal) {
                     this._inputControl.trigger('change.themed');
                  }
                  return;
               }
            }
         }.bind(this));
      },
      /**
       * <wiTag noShow>
       * Перемещает выпадающее меню внутрь контейнера или обратно, в body. Необходимо для полноэкранного режима - когда выпадающий список в body, его не видно, если какой-то внутренний элемент body в полноэкранном режиме (ZoomPlugin)
       * @param {Boolean} [atContainer] Если передать true, то будет располагатсья внутри контейнера, иначе - внутри body
       */
      toggleOptionsToContainer: function(atContainer){
         this._optCont.appendTo(atContainer ? this._container : $('body'));
      },
      /**
       * Меняет выбранное значение на указанное число позиций вверх или вниз
       * @param {Number} by На сколько менять
       * @private
       */
      _modifyValue: function(by){
         this._dSetReady.addCallback(function(){
            var keys = this._options.data.k,
               currentValue = this.getValue(),
               currentIndex;
            for(var i = 0; i < keys.length; ++i){
               if( keys[i] == currentValue ){
                  currentIndex = i;
                  break;
               }
            }
            if( currentIndex !== undefined ){
               var selectedValue = keys[currentIndex + by];
               if( selectedValue !== undefined ){
                  this.setValue(selectedValue);
               }
            }
         }.bind(this));
      },
      /**
       * <wiTag group="Управление">
       * Устанавливает следующее значение.
       * @example
       * <pre>
       *    onNextZoomKeyPressed = function() {
       *       var dropdown = $ws.single.ControlStorage.getByName('МасштабСкана');
       *       if (dropdown) {
       *          dropdown.setNextValue();
       *       }
       *    }
       * </pre>
       */
      setNextValue: function(){
         this._modifyValue(1);
      },
      /**
       * <wiTag group="Управление">
       * Устанавливает предыдущее значение.
       * @example
       * <pre>
       *    var dropdown = $ws.single.ControlStorage.getByName('ГодОтчетности');
       *    if (dropdown && dropdown.getValue() == (new Date).getFullYear()) {
       *       // Если выбран текущий год
       *       dropdown.setPrevValue();
       *    }
       * </pre>
       */
      setPrevValue: function(){
         this._modifyValue(-1);
      },
      /**
       * Заменяет отображаемое значение для выбранного элемента
       * @param {Number} index Индекс элемента.
       * @param {String} value Новое значение.
       * @example
       * <pre>
       *    dropdown.changeValueByIndex(
       *       Array.indexOf( dropdown.getValues(), 'Старое отображаемое значение' ),
       *       'Новое отображаемое значение'
       *    );
       * </pre>
       */
      changeValueByIndex: function(index, value) {
         var
            keys = this._options.data.k;
         if (index >= keys.length || index < 0) {
            return;
         }
         var
            key = keys[index],
            values = this._options.data.v,
            render = this._options.data.r,
            renderResult = this._renderOrNot([key, value]),
            option = $(this._optionTemplate(key, renderResult || value)),
            customOption = this._createCustomRow(key, renderResult || value),
            curInputVal = this._inputControl.val();
         values[index] = value;
         render[index] = renderResult;
         this._inputControl.children().eq(index).replaceWith(option);
         if (customOption) {
            this._optContList.children().eq(index).replaceWith(customOption);
         }
         if (this._curval == key) { // Если заменяем установленное значение
            // то оно снималось у оригинального select'а
            this._inputControl.val(curInputVal);
            // то нужно обновить отображаемое значение
            this._inputControl.trigger('change.themed');
         }
      },
      /**
       * Получить текущий набор данных
       * @returns {$ws.proto.RecordSet|null}
       */
      getRecordSet: function() {
         return this._recordSet;
      },
      /**
       * <wiTag group="Данные">
       * Возвращает массив со значениями (ключами) опций
       * @returns {Array} Массив ключей с их строковыми значениями
       * @example
       * <pre>
       *    var array = this.getChildControlByName('Пол').getKeys();
       *    $ws.helpers.forEach( array, function(element, index, array) {
       *       alert('Ключ №' + index + '=' + element);
       *    });
       * </pre>
       */
      getKeys: function(){
         return [].concat(this._options.data.k);
      },
      /**
       * <wiTag group="Данные">
       * Возвращает массив с отображаемыми значениями опций
       * @returns {Array} Массив значений
       * @example
       * <pre>
       *    var array = this.getChildControlByName('Пол').getValues(),
       *        i = 1;
       *    array.forEach(function(element, index, array) {
       *       alert('Значение №' + i + '=' + element);
       *       i++;
       *    });
       * </pre>
       */
      getValues: function(){
         return [].concat(this._options.data.v);
      },
      /**
       * <wiTag group="Данные">
       * Возвращает отображаемое значение опции по его фактическому значению (ключу)
       * @param   {String|Number} key Ключ, по которому будет возвращено отображаемое значение.
       * @returns {String|undefined} Отображаемое значение соответствующего ключа, либо undefined если ключ отсутствует.
       */
      getValueByKey: function(key){
         var
            keys = this._options.data.k,
            values = this._options.data.v,
            index = Array.indexOf(keys, key);
         return values[index];
      },
      /**
       * <wiTag group="Данные">
       * Возвращает фактическое значение (ключ) опции по его отображаемому значению
       * @param   {String}                      value Отображаемое значение.
       * @returns {String|Number|undefined}         Ключ соответствующий отображаемому значению, либо undefined если значение отсутствует.
       */
      getKeyByValue: function(value){
         return this._options.data.k[Array.indexOf( this._options.data.v, value )];
      },
      /**
       * <wiTag group="Данные" page=1>
       * Разрешено ли "пустое значение"
       * @returns {boolean|null}
       */
      isAllowEmpty: function() {
         return this._options.allowEmpty;
      },
      /**
       * <wiTag group="Данные" page=1>
       * Устанавливает опцию allowEmpty
       * @param {boolean|null} allowEmpty значение опции
       */
      setAllowEmpty: function(allowEmpty) {
         if (typeof allowEmpty === 'boolenan' || allowEmpty === null) {
            this._options.allowEmpty = allowEmpty;
         }
      },
      /**
       * <wiTag group="Данные">
       * Возвращает режим отображения данных
       * @returns {String}
       */
      getMode: function() {
         return this._options.mode;
      },
      /**
       * <wiTag group="Отображение">
       * Разрешен ли перенос текста
       * @returns {boolean}
       */
      isWordWrap: function() {
         return this._options.wordWrap;
      },
      /**
       * <wiTag group="Отображение">
       * Устанавливает опцию wordWrap
       * @param {boolean} wordWrap значение опции
       */
      setWordWrap: function(wordWrap) {
         this._options.wordWrap = !!wordWrap;
      },
      /**
       * <wiTag group="Данные">
       * Возвращает первый отображаемый год
       * @returns {Number}
       */
      getFirstYear: function() {
         return this._options.firstYear;
      },
      /**
       * <wiTag group="Данные">
       * Возвращает последний отображаемый год
       * @returns {Number}
       */
      getLastYear: function() {
         return this._options.lastYear;
      },
      /**
       * <wiTag group="Отображение">
       * Возвращает отображение контрола
       * @returns {String}
       */
      getRenderStyle: function() {
         return this._options.renderStyle;
      },
      /**
       * <wiTag group="Отображение">
       * Показывается ли текущий элемент в общем списке
       * @returns {boolean}
       */
      isShowSelectedInList: function() {
         return this._options.showSelectedInList;
      },
      /**
       * <wiTag group="Отображение">
       * Устанавливает опцию showSelectedInList
       * @param {boolean} showSelectedInList значение опции
       */
      setShowSelectedInList: function(showSelectedInList) {
         this._options.showSelectedInList = !!showSelectedInList;
      },
      /**
       * <wiTag group="Отображение">
       * Возвращает пользовательскую функцию рендеринга отображаемого значения
       * @returns {function}
       */
      getValueRender: function() {
         return this._options.valueRender;
      },
      /**
       * <wiTag group="Отображение">
       * Возвращает функцию рендеринга значения в контейнере выпадающего списка
       * @returns {function}
       */
      getTitleRender: function() {
         return this._options.titleRender;
      }
   });

   return $ws.proto.FieldDropdown;

});
