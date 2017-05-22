/**
 * TODO Компонент пока тестировался только в Chrome
 */
define(
   'js!SBIS3.CONTROLS.DatePicker',
   [
      'Core/EventBus',
      'js!SBIS3.CONTROLS.DateBox',
      'js!SBIS3.CONTROLS.PickerMixin',
      'js!SBIS3.CONTROLS.Utils.DateUtil',
      'js!SBIS3.CONTROLS.DateRangeBigChoose',
      'js!SBIS3.CONTROLS.TimePicker',
      'tmpl!SBIS3.CONTROLS.DatePicker',
      'tmpl!SBIS3.CONTROLS.DatePicker/resources/ElementPickerContent',
      'Core/helpers/dom&controls-helpers',
      'i18n!SBIS3.CONTROLS.DatePicker',
      'js!SBIS3.CONTROLS.IconButton',
      'css!SBIS3.CONTROLS.DatePicker',
      'css!SBIS3.CONTROLS.FormattedTextBox',
      'css!SBIS3.CONTROLS.DateBox'
   ],
   function (EventBus, DateBox, PickerMixin, DateUtil, DateRangeBigChoose, TimePicker, dotTplFn, ElementPickerContent, dcHelpers) {

   'use strict';

   /**
    * Контрол, предназначенный для ввода информации о дате/времени.
    * <br/>
    * В зависимости от {@link mask маски} возможен ввод:
    * <ol>
    *    <li>только даты,</li>
    *    <li>только времени,</li>
    *    <li>даты и времени.</li>
    * </ol>
    * Осуществить ввод информации можно как с клавиатуры, так и выбором на календаре, который открывается кликом по соответствующей иконке рядом с полем ввода.
    * <br/>
    * Если контролу в опцию {@link date} установлена несуществующая календарная дата, то в качестве значения будет установлен null.
    * Аналогичное поведение свойственно и при работе с контекстом: если опция date привязана к полю контекста, в котором хранится несуществующая календарная дата, то в значение контрола будет установлен null.
    *
    * @class SBIS3.CONTROLS.DatePicker
    * @extends SBIS3.CONTROLS.DateBox
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @author Крайнов Дмитрий Олегович
    *
    * @demo SBIS3.CONTROLS.Demo.MyDatePicker
    *
    * @control
    * @public
    * @category Date/Time
    */

   var DatePicker = DateBox.extend([PickerMixin], /** @lends SBIS3.CONTROLS.DatePicker.prototype */{
      _dotTplFn: dotTplFn,
      /**
        * @event onDateChange Происходит при изменении даты.
        * @remark
        * Изменение даты производится одним из трёх способов:
        * 1. через выбор в календаре;
        * 2. через установку нового значения в поле ввода с клавиатуры;
        * 3. методами {@link setText} или {@link setDate}.
        * @param {Core/EventObject} eventObject Дескриптор события.
        * @param {Date} date Дата, которую установили.
        * @example
        * <pre>
        *    var dateChangeFn = function(event) {
        *       if (this.getDate().getTime() < minDate.getTime()) {
        *          buttonSend.setEnabled(false);
        *          title.setText('Указана прошедшая дата: проверьте нет ли ошибки');
        *       }
        *    };
        *    datePicker.subscribe('onDateChange', dateChangeFn);
        * </pre>
        */
      /**
       * @event onDateSelect Происходит при окончании выбора даты.
       * @remark
       * Окончанием выбора даты является уход фокуса из поля ввода, на не дочерние контролы.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {Date} date Дата, которую установили.
       */
      $protected: {
         _pickerContent: null,
         /**
          * Опции создаваемого контролла
          */
         _options: {
            /**
             * @cfg {Boolean} Устанавливает отображение иконки календаря рядом с полем ввода.
             * @remark
             * Если {@link mask} установлена в значение "Только время", то автоматически иконка календаря скрывается (значение опции самостоятельно сменится на false).
             * @example
             * <pre>
             *     <option name="pickerIconShow">false</option>
             * </pre>
             * @see date
             * @see mask
             * @see setDate
             * @deprecated
             */
            pickerIconShow: true,

            pickerConfig: {
               corner: 'tl',
               horizontalAlign: {
                  side: 'right',
                  offset: 143
               },
               verticalAlign: {
                  side: 'top',
                  offset: -9
               },
               bodyBounds: true,
               locationStrategy: 'bodyBounds'
            }
         },
         _onFocusInHandler: undefined
      },

      $constructor: function () {
         this._publish('onDateChange', 'onDateSelect', 'onFocusOut');
      },

      init: function () {
         DatePicker.superclass.init.call(this);
         this._pickerInit();
      },

      isPickerIconShow: function() {
         return this._options.pickerIconShow;
      },

      _modifyOptions : function(options) {
         DatePicker.superclass._modifyOptions.call(this, options);

         /*
          * TODO: Удалить, когда все перейдут на опцию pickerIconShow вместо isCalendarIconShown.
          * Возможно нужно убрать эту опции, потому что есть компонент DateBox. DatePicker отличается
          * от DateBox только иконкой и встает вопрос зачем использовать DatePicker без иконки.
          */
         if (options.isCalendarIconShown && !options.pickerIconShow) {
            options.pickerIconShow = options.isCalendarIconShown;
            IoC.resolve('ILogger').log('DatePicker', 'В качестве опции isCalendarIconShown используйте pickerIconShow');
         }
         this._checkTypeOfMask(options);

         return options;
      },

      _getPickerName: function() {
         return this._options._pickerName;
      },

      _getPickerMethod: function(method) {
         var name = '_' + this._getPickerName() + method;
         return this[name].bind(this);
      },

      /**
       * Инициализация пикера.
       * @private
       */
      _pickerInit: function(name) {
         if (this.isPickerIconShow()) {
            this.getChildControlByName('PickerButton').subscribe('onActivated', this._getPickerMethod('Init'));
         }
      },

      /**
       * Инициализация пикера выбора даты
       * @private
       */
      _calendarInit: function() {
         if (this.isEnabled()) {
            this.togglePicker();

            this._initFocusInHandler();
            // Если календарь открыт данным кликом - обновляем календарь в соответствии с хранимым значением даты
            if (this._picker.isVisible() && this.getDate()) {
               this._pickerContent.setStartValue(this.getDate());
            }
         }
      },

      /**
       * Инициализация пикера выбора даты
       * @private
       */
      _timeInit: function() {
         if (this.isEnabled()) {
            this._options.pickerConfig.closeButton = true;
            this.togglePicker();

            this._initFocusInHandler();
            // Если часы открыты данным кликом - обновляем часы в соответствии с хранимым значением даты.
            if (this._picker.isVisible() && this.getDate()) {
               this._pickerContent.setTime(this.getDate());
            }
         }
      },

      _setEnabled : function(enabled) {
         DatePicker.superclass._setEnabled.call(this, enabled);
         if (this._picker && this._picker.isVisible()){
            this.hidePicker();
         }
      },

      showPicker: function () {
         DatePicker.superclass.showPicker.call(this);
         this._getPickerMethod('Show')();
      },

      _calendarShow: function() {
         this._pickerContent.setRange(this.getDate(), this.getDate());
      },

      _timeShow: function() {
         this._pickerContent.setTime(this.getDate());
      },

      /**
       * Определение контента пикера. Переопределённый метод
       * @private
       */
      _setPickerContent: function() {
         // Создаем пустой контейнер
         var element = $(ElementPickerContent({
               pickerName: this._getPickerName()
            }));

         // Добавляем в пикер
         this._picker.getContainer().append(this._getPickerMethod('Create')(element));
      },

      _calendarCreate: function(element) {
         this._pickerContent = new DateRangeBigChoose({
            parent: this._picker,
            element: element,
            rangeselect: false,
            startValue: this.getDate(),
            endValue: this.getDate()
         });
         // Добавляем в пикер
         this._picker.getContainer().append(element);

         // Нажатие на календарный день в пикере устанавливает дату
         this._pickerContent.subscribe('onChoose', this._onChooserChange.bind(this));
         this._pickerContent.subscribe('onCancel', this._onChooserClose.bind(this));
         // this._chooserControl.subscribe('onDateChange', function(eventObject, date) {
         //    self.setDate(date);
         //    self.hidePicker();
         // });
         return element;
      },

      _timeCreate: function(element) {
         this._pickerContent = new TimePicker({
            parent: this._picker,
            element: element,
            time: this.getDate()
         });
         this._pickerContent.subscribe('onChangeTime', this._onChangeTimeHandler.bind(this));
         return element;
      },

      _onChangeTimeHandler: function(event, time) {
         this.setDate(time);
      },

      _onChooserChange: function(event, date) {
         // DateRangeBigChoose не поддерживает ввод времени, по этому сохраняем время из даты текущего контрола
         if (date && this._lastDate) {
            date = new Date(date);
            date.setHours(this._lastDate.getHours());
            date.setMinutes(this._lastDate.getMinutes());
            date.setSeconds(this._lastDate.getSeconds());
            date.setMilliseconds(this._lastDate.getMilliseconds());
         }
         this.setDate(date);
         this.hidePicker();
      },
      _onChooserClose: function(event) {
         this.hidePicker();
      },

      /**
       * Проверить тип даты. Скрыть иконку календаря, если отсутствуют день, месяц и год (т.е. присутствует только время)
       * @private
       */
      _checkTypeOfMask: function (options) {
         var
            mask = options.mask,
            pickerName;
         if (/[DMY]/.test(mask)) {
            pickerName = 'calendar';
         }else if (mask === 'HH:II') {
            pickerName = 'time';
         }
         if (pickerName) {
            options._pickerName = pickerName;
         } else {
            options.pickerIconShow = false;
         }
      },

      setActive: function(active) {
         if (active) {
            this._initFocusInHandler();
         }
         DatePicker.superclass.setActive.apply(this, arguments);
      },

      _initFocusInHandler: function() {
         if (!this._onFocusInHandler) {
            this._onFocusInHandler = this._onFocusIn.bind(this);
            this.subscribeTo(EventBus.globalChannel(), 'onFocusIn', this._onFocusInHandler);
         }
      },

      _onFocusIn: function(event) {
         if (!dcHelpers.isChildControl(this, event.getTarget())) {
            this._notify('onDateSelect');
            this.unsubscribeFrom(EventBus.globalChannel(), 'onFocusIn', this._onFocusInHandler);
            this._onFocusInHandler = null;
         }
      }
   });

   return DatePicker;
});