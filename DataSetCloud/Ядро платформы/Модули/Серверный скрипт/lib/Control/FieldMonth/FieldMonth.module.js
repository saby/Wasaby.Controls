/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 20:00
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.FieldMonth", ["js!SBIS3.CORE.FieldAbstract", "html!SBIS3.CORE.FieldMonth", "css!SBIS3.CORE.FieldMonth"], function(FieldAbstract, dotTplFn) {

   "use strict";

   var YEARS_RANGE = 3;
   //Количество месяцев в году
   var MONTHS_COUNT = 12;

   // Есть копипаста в FieldDate
   var
      datePart = '[0-9]{4}-[0-9]{2}-[0-9]{2}',
      timePart = '[0-9]{2}:[0-9]{2}:[0-9]{2}(\\.[0-9]{1,9})?([+-][0-9]{2}([:-][0-9]{2})?)?',
      summary = '^' + datePart + '$|^(' + datePart + ' )?' + timePart + '$',
      sqlDateRegExp = new RegExp(summary);

   $ws._const.FieldMonth = {
      flowOffset: {'top': 8, 'left': -95},
      menuWidth: 130
   };

   /**
    * Контрол для для осуществления ввода информации о месяце и годе. Существуют два режима работы вывода информации:
    * 1. о месяце и годе,
    * 2. только о годе.
    * Режим работы устанавливается во {@link viewType}.
    * Отличается от стандартного контрола выбора даты тем, что не даёт пользователю ввода данных с клавиатуры.
    *
    * @class $ws.proto.FieldMonth
    * @extends $ws.proto.FieldAbstract
    *
    * @control
    * @category Date/Time
    * @initial
    * <component data-component='SBIS3.CORE.FieldMonth' style='width: 150px'>
    * </component>
    * @ignoreOptions maxLength
    * @ignoreOptions width
    */
   $ws.proto.FieldMonth = FieldAbstract.extend(/** @lends $ws.proto.FieldMonth.prototype */{
      $protected : {
         _options : {
            /**
             * @cfg {Boolean} Разрешить пустое значение
             * <wiTag group="Управление">
             * Разрешить отображение пустого значения.
             * Возможные значения:
             * 1. true - разрешить пустое значение;
             * 2. false - не разрешать пустое значение.
             * При выборе варианта 'true' текст пустого значения по умолчанию: "не указан". В выпадающем списке среди
             * возможных значений будет последним.
             * @see emptyValue
             * @see setEmptyValue
             */
            allowEmpty: false,
            /**
             * @cfg {String} Текст пустого значения
             * <wiTag group="Отображение">
             * Текст, соответствующий пустому значению поля выбора месяца/года.
             * Свойство актуально, если {@link allowEmpty} установлено в true.
             * Этот текст отобразится, если не выбрать или <a href='http://wi.sbis.ru/docs/index.html#$ws.proto.FieldMonth:clear'>очистить</a> значение поля выбора месяца/года.
             * @see allowEmpty
             * @see setEmptyValue
             * @translatable
             */
            emptyValue: 'не указан',
            /**
             * @cfg {String|Date} Значение
             * <wiTag group="Данные">
             * Можно задать:
             * <ol>
             *    <li>строку формата "ГГГГ, ММ, ДД", т.е. значения отделяются запятой, строго в таком порядке и только
             * полный год в 4 цифры;</li>
             *    <li>значение типа Date.</li>
             * </ol>
             * В зависимости от режима работы, установленного во {@link viewType}, возьмутся месяц и год, либо только год.
             * @see allowEmpty
             * @see emptyValue
             * @see viewType
             * @see setValue
             */
				value: '',
             /**
              * @cfg {String} Тип отображения
              * Задаём один из двух режимов работы.
              * Либо выбираем месяц и год, либо только год.
              * <wiTag group="Управление">
              * @see value
              * @see setValue 
              * @see getStringValue
              * @variant month отображается в формате "месяц, год"
              * @variant year отображается только в формате "год"
              */
            viewType: 'month',
             /**
              * @cfg {Function} Обработчик создания элемента главного заголовка
              * < Вот Здесь Может Быть Другой Текст Или Иконка > с помощью обработчика.
              * В качестве параметра функции обработчика передается отображаемая дата в формате объекта типа Date.
              * Обработчик срабатывает при каждом изменении значения для перерисовки календаря.
              * Из titleRender можно возвращать как строку, так и jQuery объекты.
              * <wiTag group="Отображение">
              * @example
              * Рядом с годом показать картинку грузовика из стандартных иконок.
              * <pre>
              *    titleRender: function(date) {
              *       var className = 'icon-16 icon-primary icon-Truck',
              *           object;
              *       if (date.getFullYear() >= 2013) {
              *          className += 'Empty';
              *       }
              *       object = $('<span></span>');
              *       $('<span></span>', {
              *          'class': className + ' action-hover my-module-truck'
              *       }).appendTo(object).click(function() {
              *          $ws.helpers.alert('Truck clicked!');
              *       });
              *       object.append('<span class="ws-date-month-title">' + this.getStringValue() + '</span>');
              *       return object;
              *    }
              * </pre>
              * @see value
              * @see monthRender
              * @see getStringValue
              */
            titleRender: undefined,
             /**
              * @cfg {Function} monthRender Обработчик создания элемента месяца в выпадающем меню
              * Этот обработчик вызывается для отображения строк в выпадающем меню.
              * На каждую строку он вызывается один раз.
              * <wiTag group="Отображение">
              * @example
              * Для летних месяцев установит картинку пальмы из стандартных иконок.
              * <pre>
              *    monthRender: function(date) {
              *       var className = 'my-module-month';
              *       if (date.getMonth() > 4 && date.getMonth() < 8) {
              *          className += ' icon-16 icon-Vacation icon-primary';
              *       }
              *       return '<span class="' + className + '"></span>' + date.strftime('%B');
              *    }
              * </pre>
              * @see titleRender
              */
            monthRender: undefined,
            cssClassName: 'ws-date-month',
            cssClass: 'ws-date-month'
         },
         _$buttonsBlock: undefined,        //Блок с кнопками влево/вправо
         _menuCreate: false,              //Создано ли уже меню
         _menuShowed: false,              //Показано ли сейчас меню
         _$flowBlock: undefined,           //Блок с меню
         _$menuTitle: undefined,           //Блок с заголовком меню
         _$itemsBlock: undefined,          //Блок с выбором месяцев
         _viewedYear: 0,                  //Выбранный в меню год
         _hoverItem: undefined,           //Выбранный с помощью клавиатуры элемент в меню
         _$hoverItem: undefined,          //Блок с выбранным элементом меню
         _prevVal: undefined,             //предыдущее значение поля
         _keysWeHandle: [
            $ws._const.key.plus,
            $ws._const.key.minus,
            $ws._const.key.right,
            $ws._const.key.left,
            $ws._const.key.up,
            $ws._const.key.down,
            $ws._const.key.del,
            $ws._const.key.insert,
            $ws._const.key.esc,
            $ws._const.key.f7,
            $ws._const.key.enter
         ]
      },
      $constructor: function() {
         this._init();
         this._declareCommands();
      },
      /**
       * Объявляем команды
       */
      _declareCommands: function() {
         $ws.single.CommandDispatcher.declareCommand(this, 'nextDate', this.nextDate);
         $ws.single.CommandDispatcher.declareCommand(this, 'prevDate', this.prevDate);
         $ws.single.CommandDispatcher.declareCommand(this, 'clear', this.clear);
         $ws.single.CommandDispatcher.declareCommand(this, 'selectToday', this.selectToday);
      },
      /**
       * Проводит инициализацию контрола
       */
      _init: function() {
         this._curval = this._getDefaultValue();
         this.setReadOnly(this._options.readOnly);
         this._updateTitle();
      },
      setReadOnly: function(readOnly) {
         this._options.readOnly = readOnly;
         if (this._options.readOnly) {
            this.setEnabled(false);
         } else {
            this.setEnabled(true);
         }
         $ws.proto.FieldMonth.superclass.setReadOnly.apply(this, arguments);
      },
       /**
        * <wiTag group="Отображение">
        * Установить значение свойства {@link emptyValue} — задать текст пустого значения выпадающего списка.
        * @param {String} newEmptyValue Новый текст пустого значения вместо "не указан", стоящего по умолчанию.
        * @example
        * 1. При готовности контрола задать текст пустого значения поля выбора месяца/года.
        * <pre>
        *    //allowEmpty - информирует о наличие пустого значения
        *    control.subscribe('onReady', function() {
        *       if (allowEmpty) {
        *          fieldMonth.setEmptyValue('Выберите месяц/год');
        *       }
        *    });
        * </pre>
        *
        * 2. В случае выбора года 2015 и выше в качестве значения установится текст "Указанный год выходит за диапазон".
        * <pre>
        *     if (parseInt(myControlMonth.getValue().getFullYear(), 10) > 2014){
        *        myControlMonth.setEmptyValue('Указанный год выходит за диапазон');
        *        myControlMonth.clear();
        *     }
        * </pre>
        * @see emptyValue
        * @see allowEmpty
        * @see getStringValue
        * @see getValue
        * @see clear
        */
       setEmptyValue: function(newEmptyValue){
           if(this._options.allowEmpty) {
               this._options.emptyValue = newEmptyValue;
           }
       },
      /**
       * Урезает даты до первого дня месяца
       * @param {Date} date Дата
       * @return {Date}
       * @private
       */
      _trimDate: function(date) {
         date.setDate(1);
         date.setHours(12, 12, 12, 0);
         if (this._options.viewType !== 'month') {
            date.setMonth(0);
         }
         return date;
      },
      /**
       * Возвращает дефолтное значение
       * @returns {Date|undefined}
       * @private
       */
      _getDefaultValue: function() {
         if (this._options.value) {
            var self = this,
               parseDate = function(string) {
                  if ($ws.helpers.isISODate(string)) {
                     return $ws.helpers.dateFromISO(string);
                  }
                  if (sqlDateRegExp.test(string)) {
                     return Date.fromSQL(string);
                  }
                  var values = string.split('/');
                  if (values.length === 3 && !isNaN(parseInt(values[0], 10)) && !isNaN(parseInt(values[1], 10)) && !isNaN(parseInt(values[2], 10))) {
                     return new Date(values[2], values[1] - 1, values[0], 12, 12, 12);
                  }
                  return new Date();
               },
               parse = function(value) {
                  if (value instanceof Date) {
                     return self._trimDate(value);
                  }
                  else if (typeof(value) === 'string') {
                     return self._trimDate(parseDate(value));
                  }
                  return null;
               };
            if (typeof(this._options.value) === 'function') {
               return parse(this._options.value());
            }
            return parse(this._options.value);
         }
         return this._trimDate(new Date());
      },
      _dotTplFn: dotTplFn,
      /**
       * Находит нужные элементы
       * @private
       */
      _bindInternals: function() {
         this._inputControl = this._container.find(".ws-date-month-title-block");
         this._$buttonsBlock = this._container.find('.ws-date-button');
      },
      /**
       * Инициализирует события
       */
      _initEvents: function() {
         var self = this;
         this._container.find('.ws-date-button').click(function(event) {
            self._onClickHandler(event);
            if (self.isEnabled()) {
               self[$(this).hasClass('ws-date-button-right') ? 'nextDate' : 'prevDate']();
            }
         });
         $('.ws-date-month-title', this._inputControl.get(0))
            .live('click', this._titleClick.bind(this));
      },
      /**
       * Функция обработки клика по заголовку
       */
      _titleClick: function() {
         if (!this._options.enabled) {
            return;
         }
         this._toggleMenu();
      },
      /**
       * Обработчик нажатия на кнопки влево/вправо
       * @param {Number} by На сколько менять дату
       */
      _modifyDate: function(by) {
         if(this._curval === null)
            return;
         if (this.isMonthSelection()) {
            this._curval.setMonth(this._curval.getMonth() + by);
         }
         else {
            this._curval.setFullYear(this._curval.getFullYear() + by);
         }
         this._updateTitle();
         this._onValueChangeHandler();
      },
      /**
       * Внутренний установщик данных
       * @param {Date|String} value
       */
      _setValueInternal: function(value) {
         if ($ws.helpers.type(value) ==='date') {
            this._curval = new Date(value);
         }
         else if (value === null) {
            this._curval = null;
         }
         else if (typeof(value) === 'string') {
            this._curval = Date.fromSQL(value);
         }
         if (this._curval !== null) {
            this._trimDate(this._curval);
         }
         this._$buttonsBlock.toggleClass('ws-date-button-disabled', !(this._curval && this.isEnabled()));
         this._updateTitle();
      },
      /**
       * <wiTag group="Управление">
       * Изменить текущее значение
       * @param {*} value Вставляемое значение. Можно передать:
       * 1. строку формата "ГГГГ, ММ, ДД", т.е. значения отделяются запятой, строго в таком порядке и только полный год
       * в 4 цифры;
       * 2. значение типа Date.
       * В зависимости от режима работы, установленного во {@link viewType}, возьмутся месяц и год, либо только год.
       * @param {Boolean} [ignoreReadonly] Игнорировать признак "только для чтения".
       * @param {Boolean} [noRevalidate] Не проводить валидацию контрола.
       * @example
       * Данный пример демонстрирует установку значения контрола "Декабрь 2013 года"
       * <pre>
       *    var exampleDate = new Date(2013, 11); //декабрь 2013 года
       *    dialog.getChildControlByName('exampleFieldMonth').setValue(exampleDate);
       * </pre>
       * @see viewType
       * @see getStringValue
       * @see clear
       * FIXME убрать параметр ignoreReadonly и noRevalidate
       */
      setValue : function(value, ignoreReadonly, noRevalidate){
         if (!this._options.readonly || ignoreReadonly) {
            if (this._curval) {
               this._prevVal = this._curval;
            }
            $ws.proto.FieldMonth.superclass.setValue.apply(this, arguments);
         }
      },
      /**
       */
      _updateTitle: function() {
         var title,
             value;
         if (this._options.titleRender) {
            value = (this._curval) ? new Date(this._curval) : null ;
            title = this._options.titleRender.call(this, value);
         }
         else {
            var className = 'ws-date-month-title';
            value = (this._curval) ? this.getStringValue(true) : this._options.emptyValue;
            title = '<span class="' + className + '">' + value + '</span>';

         }
         this._inputControl.empty().append(title);
         this._inputControl.find('.ws-date-month-title').toggleClass('unselected-value', !this._curval);
      },
      /**
       * Обновляет дополнительный заголовок
       */
      _updateMenuTitle: function() {
         this._$menuTitle.text(this._viewedYear);
      },
      /**
       * Добавляет пустое значение
       * @param {Boolean} selected Отмечать добавленное значение как текущее
       * @private
       */
      _addEmptyValue: function(selected) {
          $('<div class="ws-field-month-element' + (selected ? ' selected' : '') + ( this._hoverItem === 'empty' ? ' hover' : '') + '" data-id=empty>' + this._options.emptyValue + '</div>')
              .appendTo(this._$itemsBlock);
      },
      /**
       * Обновляет список месяцев в меню
       * @private
       */
      _updateMonths: function() {
         var
            monthHtml,
            value;
         for (var i = 0; i < MONTHS_COUNT; ++i) {
            if (this._options.monthRender) {
               monthHtml = this._options.monthRender.call(this, new Date(this._viewedYear, i, 1));
            } else {
               monthHtml = $ws._const.Date.longMonths[i];
            }
            //Долой надежды! this._curval больше нам не помешает
            value = this._curval ? this._curval : new Date();
            $('<div class="ws-field-month-element' + (i === this._hoverItem ? ' hover' : '') +
                  (this._curval && value.getMonth() === i && value.getFullYear() === this._viewedYear ? ' selected' : '') +
                  '" data-id="' + i + '">' + monthHtml + '</div>')
               .appendTo(this._$itemsBlock);
         }
         if (this._options.allowEmpty) {
             this._addEmptyValue(!this._curval);
         }

         this._updateIconHome();
      },
      /**
       * Обновляет список годов в меню
       * @private
       */
      _updateYears: function() {
         var
            itemHtml,
            value;
         for (var i = this._viewedYear - YEARS_RANGE; i <= this._viewedYear + YEARS_RANGE; ++i) {
            itemHtml = i;
            value = this._curval ? this._curval : new Date();
            $('<div class="ws-field-month-element' + (i === this._hoverItem ? ' hover' : '') +
                  (this._curval && value.getFullYear() == i ? ' selected' : '') +
                  '" data-id="' + i + '">' + itemHtml + '</div>')
               .appendTo(this._$itemsBlock);
         }
         if (this._options.allowEmpty) {
            this._addEmptyValue(!this._curval);
         }
         this._updateIconHome();
      },
      _updateIconHome: function(){
          var text = this.isMonthSelection() ? 'месяц' : 'год';
         $('<div class="ws-field-month-not-element"></div>').appendTo(this._$itemsBlock);
         $('<div class="ws-FieldMonth-home ws-field-month-element">' +
               '<div class="icon-16 icon-Home icon-primary action-hover" title="Выбрать текущий '+
               text + '"></div></div>').appendTo(this._$itemsBlock);
      },
      /**
       * Находится ли контрол в режиме выбора месяца или года
       * @returns {boolean} true - режим выбора месяца, false - выбор года
       */
      isMonthSelection: function(){
         return this._options.viewType === 'month';
      },
      /**
       * Обновляет список месяцев
       * @private
       */
      _updateItems: function() {
         this._$itemsBlock.empty();
         if (this.isMonthSelection()) {
            this._updateMonths();
         } else {
            this._updateYears();
         }
      },
      /**
       * Возвращает шаблон меню
       * @private
       */
      _getMenuTemplate: function() {
         return '<div class="ws-date-month-flow' +' ws-FieldMonth-flow-' + this._options.viewType + '" tabindex="0">' +
               '<div class="ws-date-month-flow-title-block">' +
                  '<div class="ws-date-button ws-date-button-left ws-date-month-year icon-16 icon-DayBackward icon-primary action-hover ws-date-button-enabled" title="Показать предыдущий год"></div>' +
                  '<div class="ws-date-month-flow-title"></div>' +
                  '<div class="ws-date-button ws-date-button-right ws-date-month-year icon-16 icon-DayForward icon-primary action-hover ws-date-button-enabled" title="Показать следующий год"></div>' +
               '</div>' +
               '<div class="ws-date-month-flow-items"></div>' +
            '</div>';
      },
      /**
       * Создаёт элементы меню
       */
      _buildMenu: function() {
         if (this._menuCreated) {
            return;
         }
         this._menuCreated = true;
         this._$flowBlock = $(this._getMenuTemplate())
            .appendTo('body');
         this._bindMenuEvents();
         this._bindMenuElements();
      },
      /**
       * Снимает отметку (ховер) с выбранного месяца
       * @private
       */
      _unMarkHoverItem: function() {
         this._$hoverItem.removeClass('hover');
      },
      /**
       * "Забывает" выбранный с помощью клавиатуры месяц
       * @private
       */
      _disableHoverItem: function() {
         if (this._hoverItem !== undefined) {
            this._unMarkHoverItem();
            this._hoverItem = undefined;
            this._$hoverItem = undefined;
         }
      },
      /**
       * Подписывается на события меню
       * @private
       */
      _bindMenuEvents: function() {
         this._$flowBlock.bind('keydown', this._keyboardHover.bind(this));
         $(document).bind('mousedown.' + this.getId() + ' wsmousedown.' + this.getId(), function(event) {
            var target = $(event.target),
               blocks = this._container.find('.ws-date-month-title');
            blocks.push(this._$flowBlock.get(0));
            if (this._menuShowed && target.closest(blocks).size() === 0) {
               if (/block/.test(this._$flowBlock.css('display'))) {
                  this._hideMenu();
               }
            }
         }.bind(this));
      },
      /**
       * Возвращает идентификатор элемента меню по событию
       * @param {Object} event jQuery-событие
       * @returns {Number}
       * @private
       */
      _getMenuElementId: function(event) {
         var target = $(event.target).closest('.ws-field-month-element'),
            id = (target.data('id') === 'empty') ? 'empty' : parseInt(target.data('id'), 10);
         return id;
      },
      _resetEmptyValue: function() {
          this._curval = this._prevVal;
          this._$buttonsBlock.toggleClass('ws-date-button-disabled', false);
      },

      /**
       * Обработчик клика по элементу в меню
       * @param {Object} event jQuery-событие
       * @private
       */
      _menuItemClick: function(event) {
         var id = this._getMenuElementId(event),
             $target = $(event.target),
             date;
         if (id === 'empty') {
            this._selectEmptyValue();
         } else {
            if (this._curval === null) {
               this._resetEmptyValue();
            }
            if ($target.hasClass('ws-FieldMonth-home') || $target.parent().hasClass('ws-FieldMonth-home')) {
               date = new Date();
               this._viewedYear = date.getFullYear();
               id = this.isMonthSelection() ? date.getMonth() : this._viewedYear;
            }
            if (this.isMonthSelection()) {
               this._selectMonth(id);
            } else {
               this._selectYear(id);
            }
         }
      },
      /**
       * Подсвечивает элемент меню при наведении. Не сделано css-ом из-за поддержки клавиатуры
       * @param event
       * @private
       */
      _menuItemHover: function(event) {
         var id = this._getMenuElementId(event);
         this._selectHoverItem(id);
      },
      /**
       * Находит нужные элементы в меню, подписывается на события
       * @private
       */
      _bindMenuElements: function() {
         this._$menuTitle = this._$flowBlock.find('.ws-date-month-flow-title');
         this._$itemsBlock = this._$flowBlock.find('.ws-date-month-flow-items');
         this._$itemsBlock.bind('mouseleave', this._disableHoverItem.bind(this));
         $('.ws-field-month-element', this._$flowBlock.get(0))
            .live('click', this._menuItemClick.bind(this))
            .live('mouseenter', this._menuItemHover.bind(this));
         this._$flowBlock.find('.ws-date-button-left').click(this._modifyViewedYear.bind(this, -1));
         this._$flowBlock.find('.ws-date-button-right').click(this._modifyViewedYear.bind(this, 1));
      },
       /**
        * Выбирает пустое значение меню
        * @private
        */
      _selectEmptyValue: function() {
         this._prevVal = this._curval;
         this._curval = null;
         this._$buttonsBlock.toggleClass('ws-date-button-disabled', true);
         this._updateTitle();
         this._onValueChangeHandler();
         this._hideMenu();
      },
      /**
       * Выбирает показанный в меню год
       * @private
       */
      _selectViewedYear: function() {
         this._curval.setFullYear(this._viewedYear);
         this._updateTitle();
         this._onValueChangeHandler();
         this._hideMenu();
      },
      /**
       * Выбирает указанный год из меню
       * @param {Number} year Год
       * @private
       */
      _selectYear: function(year) {
         this._viewedYear = year;
         this._selectViewedYear();
      },
      /**
       * Выбирает указанный месяц из меню
       * @param {Number} month Месяц
       * @private
       */
      _selectMonth: function(month) {
         if (!(this._curval instanceof Date)) {
            this._curval = new Date();
            if (!(this._prevVal instanceof Date)) {
               this._prevVal = new Date().setMonth(month);
            }
         }
         this._curval.setMonth(month);
         this._selectViewedYear();
      },
      /**
       * Меняет текущий год в меню
       * @param {Number} by На сколько менять текущий год
       * @private
       */
      _modifyViewedYear: function(by) {
         this._viewedYear += by;
         this._updateMenuTitle();
         //Либо заккоментить условие, либо выискивать с каждым изменением года элемент .selected
//         if (this._options.monthRender) {
            this._updateItems();
//         }
      },
      /**
       * Выбрать текущий месяц/год.
       * Выбрать текущий месяц и год либо только год в зависимости от режима, установленного во {@link viewType}.
       * @command
       * @example
       * При готовности контрола выбрать текущий месяц в поле выбора месяца/года (fieldMonth).
       * <pre>
       *    control.subscribe('onReady', function() {
       *       this.getChildControlByName(fieldMonth).sendCommand('selectToday');
       *    });
       * </pre>
       * @see nextDate
       * @see prevDate
       * @see clear
       * @see viewType
       */
      selectToday: function() {
         this._curval = this._trimDate(new Date());
         this._updateTitle();
         this._onValueChangeHandler();
      },
      /**
       * Очистить текущую дату.
       * После применения этой команды значение отображается как "..." по умолчанию, или берётся установленное
       * методом {@link setEmptyValue}. Если {@link allowEmpty} выставлено false, то команда ничего не делает.
       * @command
       * @example
       * При клике на кнопку (btn) убрать текущую дату в поле выбора месяца/года (fieldMonth).
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       fieldMonth.sendCommand('clear');
       *    });
       * </pre>
       * @see allowEmpty
       * @see emptyValue
       * @see setEmptyValue
       * @see selectToday
       * @see nextDate
       * @see prevDate
       */
      clear: function() {
         if (this._options.allowEmpty && this._curval) {
            var title = '<span class="ws-date-month-title">' + this._options.emptyValue + '</span>';
            this._inputControl.empty().append(title);
            this._prevVal = this._curval;
            this._curval = null;
            this._$buttonsBlock.toggleClass('ws-date-button-disabled', true);
         }
      },
      /**
       * Выбрать следующий месяц/год, в зависимости от режима, установленного во {@link viewType}.
       * Аналогично нажатию стрелки "вправо"
       * @command
       * @example
       * При клике на кнопку (btn) выбрать следующий месяц/год в поле выбора месяца/года (fieldMonth).
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       fieldMonth.sendCommand('nextDate');
       *    });
       * </pre>
       * @see prevDate
       * @see selectToday
       * @see clear
       * @see viewType
       */
      nextDate: function() {
         this._modifyDate(+1);
      },
      /**
       * Выбрать предыдущий месяц/год, в зависимости от режима, установленного во {@link viewType}.
       * Аналогично нажатию стрелки "влево"
       * @command
       * @example
       * При клике на кнопку (btn) выбрать предыдущий месяц/год в поле выбора месяца/года (fieldMonth).
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       fieldMonth.sendCommand('prevDate');
       *    });
       * </pre>
       * @see nextDate
       * @see selectToday
       * @see clear
       * @see viewType
       */
      prevDate: function() {
         this._modifyDate(-1);
      },
      /**
       * Показывает меню
       */
      _showMenu: function() {
         this._buildMenu();
         if (!this._menuShowed) {
            this._viewedYear = this._curval ? this._curval.getFullYear() : this._prevVal ? this._prevVal.getFullYear() : new Date().getFullYear();
            this._hoverItem = undefined;
            this._updateMenuTitle();
            this._updateItems();
            this._$buttonsBlock.addClass('ws-invisible');
            this._$flowBlock.show();
            this._$flowBlock.css($ws.helpers.positionInWindow(this._container.offset(), $ws._const.FieldMonth.menuWidth, this._$flowBlock.outerHeight()));
            this._$flowBlock.focus();
            this._menuShowed = true;
            this._container.trigger('wsSubWindowOpen');
         }
      },
      /**
       * Скрывает меню
       */
      _hideMenu: function() {
         if (this._menuShowed) {
            this._menuShowed = false;
            this._$buttonsBlock.removeClass('ws-invisible');
            if (this._$flowBlock) {
               this._$flowBlock.hide();
            }
            if (this.isActive()) {
               this._container.focus();
            }
            this._container.trigger('wsSubWindowClose');
         }
      },
      /**
       * Переключает отображение меню
       */
      _toggleMenu: function() {
         if (this._menuShowed) {
            this._hideMenu();
         }
         else {
            this._showMenu();
         }
      },
      setActive: function(active) {
         $ws.proto.FieldMonth.superclass.setActive.apply(this, arguments);
         if (!active) {
            this._hideMenu();
         }
      },
      /**
       * Проставляет классы
       * @param {Boolean} enable Включён ли контрол
       * @private
       */
      _setDisableAttr: function(enable) {
         if (!enable) {
            this._hideMenu();
         }
         this._inputControl.toggleClass('ws-date-month-disabled', !enable);
         this._$buttonsBlock.toggleClass('ws-date-button-disabled', !(enable && this._curval));
         this._$buttonsBlock.toggleClass('ws-date-button-enabled', enable);
      },
      _setEnabled: function(enable) {
         $ws.proto.FieldMonth.superclass._setEnabled.apply(this, arguments);
         if (!enable) {
            this._hideMenu();
         }
      },
      /**
       * Внутренний метод возврата значения
       * @returns {Date}
       */
      _notFormatedVal: function() {
         return this._curval ? new Date(this._curval) : null; //Возвращается копия даты, этакое read-only значение, чтобы оно поместилось в контекст и при смене значения не поменялось в контексте
      },
      /**
       * Обработчик смены значения
       */
      _onValueChangeHandler: function() {
         $ws.proto.FieldMonth.superclass._onValueChangeHandler.apply(this, arguments);
         this.validate();
      },
      destroy: function() {
         if (this._$flowBlock) {
            this._$flowBlock.empty().remove();
         }
         $(document).unbind('.' + this.getId());
         if (this._menuShowed) {
            this._container.trigger('wsSubWindowClose');
         }
         $ws.proto.FieldMonth.superclass.destroy.apply(this, arguments);
      },
      /**
       * Делает вид, что указанный элемент подсвечен, и убирает подсветку у предыдущего
       * @param {Number} id Идентфикатор (месяц/год) элемента, который нужно выбрать
       * @private
       */
      _selectHoverItem: function(id) {
         var $item = this._$itemsBlock.children('[data-id="' + id + '"]');
         this._disableHoverItem();
         this._hoverItem = id;
         this._$hoverItem = $item;
         $item.addClass('hover');
      },
      /**
       * Меняет выбранный элемент в меню с помощью клавиатуры
       * @param {Number} by На сколько менять
       * @private
       */
      _moveMenuItem: function(by) {
         var id;
         if (this._hoverItem === undefined) {
            if (this.isMonthSelection()) {
               if (by > 0) {
                  id = by - 1;
               } else {
                  id = by;
               }
            } else {
               id = this._viewedYear - YEARS_RANGE;
            }
         } else {
            this._unMarkHoverItem();
            id = this._hoverItem + by;
         }
         if (this.isMonthSelection()) {
            id = (id + MONTHS_COUNT) % MONTHS_COUNT;
         } else if (id > this._viewedYear + YEARS_RANGE) {
            id = this._viewedYear - YEARS_RANGE;
         } else if (id < this._viewedYear - YEARS_RANGE) {
            id = this._viewedYear + YEARS_RANGE;
         }
         this._selectHoverItem(id);
      },
      /**
       * Обработка нажатий клавиш
       * @param {Object} event Объект события
       */
      _keyboardHover: function(event) {
         if (event.shiftKey || event.altKey || event.ctrlKey) {
            return true;
         }
         if (event.which === $ws._const.key.plus ||
            event.which === $ws._const.key.right) {
            if (this._menuShowed) {
               if (this.isMonthSelection()) {
                  this._modifyViewedYear(+1);
               }
            }
            else {
               this.nextDate();
            }
         }
         else if (event.which === $ws._const.key.up) {
            if (this._menuShowed) {
               this._moveMenuItem(-1);
            }
            else {
               this.nextDate();
            }
         }
         else if (event.which === $ws._const.key.minus ||
            event.which === $ws._const.key.left) {
            if (this._menuShowed) {
               if (this.isMonthSelection()) {
                  this._modifyViewedYear(-1);
               }
            }
            else {
               this.prevDate();
            }
         }
         else if (event.which === $ws._const.key.down) {
            if (this._menuShowed) {
               this._moveMenuItem(+1);
            }
            else {
               this.prevDate();
            }
         }
         else if (event.which === $ws._const.key.del) {
            this.clear();
         }
         else if (event.which === $ws._const.key.insert) {
            this.selectToday();
         }
         else if (event.which === $ws._const.key.esc) {
            if (this._menuShowed) {
               this._hideMenu();
            }
            else {
               return true;
            }
         }
         else if (event.which === $ws._const.key.f7) {
            this._toggleMenu();
         }
         else if (event.which === $ws._const.key.enter) {
            if (this._menuShowed) {
               if (this._hoverItem !== undefined) {
                  if (this.isMonthSelection()) {
                     this._selectMonth(this._hoverItem);
                  } else {
                     this._selectYear(this._hoverItem);
                  }
               }
               else {
                  this._selectViewedYear();
               }
            }
            else {
               this._showMenu();
            }
         }
         return false;
      },
       /**
        * <wiTag group="Данные">
        * Получить строковое представление значения
        * Возвращает текстовую строку вида "Месяц, год", либо "Год" в зависимости от режима работы, установленного
        * во {@link viewType}.
        * @returns {String} Cтроковое представление значения.
        * @example
        * В поле ввода (fieldString) отобразить название года согласно китайскому календарю.
        * <pre>
        *     var years = ['обезьяны', 'петуха', 'собаки', 'свиньи', 'крысы', 'быка', 'тигра', 'кролика', 'дракона', 'змеи', 'лошади', 'овцы'];
        *     fieldMonth.subscribe('onChange', function() {
        *        if (viewType == 'year') {
        *           //возвращает строкой текущий год + считает остаток от деления на 12 + берёт нужное название года
        *           fieldString.setValue(this.getStringValue() + ', год ' + years[date.getFullYear() % 12]);
        *        }
        *     });
        * </pre>
        * @see viewType
        * @see value
        */
      getStringValue: function(shortYears) {
         if (this._curval === null) {
             return this._options.emptyValue;
         } else if (this.isMonthSelection()) {
            return this._curval.strftime('%B' + (shortYears ? " '%y" : ', %Y'));
         } else
            return this._curval.strftime('%Y');
      }
   });

   return $ws.proto.FieldMonth;

});
