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
      'html!SBIS3.CONTROLS.DatePicker',
      'Core/helpers/dom&controls-helpers',
      'i18n!SBIS3.CONTROLS.DatePicker',
      'js!SBIS3.CONTROLS.IconButton'
   ],
   function (EventBus, DateBox, PickerMixin, DateUtil, DateRangeBigChoose, dotTplFn, dcHelpers) {

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
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
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
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Date} date Дата, которую установили.
       */
      $protected: {
         /**
          * Контролл Calendar в пикере
          */
         _calendarControl: undefined,
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
             *     <option name="isCalendarIconShown">false</option>
             * </pre>
             * @see date
             * @see mask
             * @see setDate
             * @deprecated
             */
            isCalendarIconShown: true,

            pickerConfig: {
               corner: 'tl',
               horizontalAlign: {
                  side: 'right',
                  offset: 143
               },
               verticalAlign: {
                  side: 'top',
                  offset: -9
               }
            }
         },
         _onFocusInHandler: undefined
      },

      $constructor: function () {
         this._publish('onDateChange', 'onDateSelect', 'onFocusOut');
      },

      init: function () {
         DatePicker.superclass.init.call(this);

         // Проверить тип маски -- дата, время или и дата, и время. В случае времени -- сделать isCalendarIconShown = false
         this._checkTypeOfMask(this._options);

         this._calendarInit();

         this._container.removeClass('ws-area');
      },

      _modifyOptions : function(options) {
         this._checkTypeOfMask(options);
         return DatePicker.superclass._modifyOptions.apply(this, arguments);
      },

      /**
       * Инициализация календарика
       */
      _calendarInit: function() {
         var self = this,
            button = this.getChildControlByName('CalendarButton');
         if (self._options.isCalendarIconShown) {
            // Клик по иконке календарика
            button.subscribe('onActivated', function () {
               if (self.isEnabled()) {
                  self.togglePicker();

                  self._initFocusInHandler();
                  // Если календарь открыт данным кликом - обновляем календарь в соответствии с хранимым значением даты
                  if (self._picker.isVisible() && self.getDate()) {
                     self._chooserControl.setStartValue(self.getDate());
                  }
               }
            });
         } else {
            button.getContainer().parent().addClass('ws-hidden');
         }
      },

      _setEnabled : function(enabled) {
         DatePicker.superclass._setEnabled.call(this, enabled);
         if (this._picker && this._picker.isVisible()){
            this.hidePicker();
         }
      },

      /**
       * Определение контента пикера. Переопределённый метод
       * @private
       */
      _setPickerContent: function() {
         var self = this,
            // Создаем пустой контейнер
            element = $('<div name= "Calendar" class="controls-DatePicker__calendar"></div>');

         this._picker.getContainer().empty();
         // Преобразуем контейнер в контролл Calendar и запоминаем
         self._chooserControl = new DateRangeBigChoose({
            parent: this._picker,
            element: element,
            rangeselect: false,
            startValue: this.getDate(),
            endValue: this.getDate()
         });

         // Добавляем в пикер
         this._picker.getContainer().append(element);

         // Нажатие на календарный день в пикере устанавливает дату
         this._chooserControl.subscribe('onChoose', this._onChooserChange.bind(this));
         this._chooserControl.subscribe('onCancel', this._onChooserClose.bind(this));
         // this._chooserControl.subscribe('onDateChange', function(eventObject, date) {
         //    self.setDate(date);
         //    self.hidePicker();
         // });
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
         if (options.mask  &&  !/[DMY]/.test(options.mask) ) {
            options.isCalendarIconShown = false;
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