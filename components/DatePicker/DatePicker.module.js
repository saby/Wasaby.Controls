/**
 * TODO Компонент пока тестировался только в Chrome
 */
define(
   'js!SBIS3.CONTROLS.DatePicker',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.PickerMixin',
      'js!SBIS3.CONTROLS.Utils.DateUtil',
      'js!SBIS3.CONTROLS.DateRangeBigChoose',
      'html!SBIS3.CONTROLS.DatePicker',
      'i18n!SBIS3.CONTROLS.DatePicker',
      'js!SBIS3.CONTROLS.DateBox'
   ],
   function (CompoundControl, PickerMixin, DateUtil, DateRangeBigChoose, dotTplFn) {

   'use strict';

   /**
    * Поле ввода даты/времени.
    * Данный контрол предназначен для осуществления ввода информации о дате и времени.
    * В зависимости от {@link mask маски} возвожен ввод:
    * <ol>
    *    <li>только даты,</li>
    *    <li>только времени,</li>
    *    <li>даты и времени.</li>
    * </ol>
    * Осуществить ввод информации можно как с клавиатуры, так и выбором на календаре, который открывается кликом по соответствующей иконке.
    * Можно вводить только значения особого формата даты.
    * @class SBIS3.CONTROLS.DatePicker
    * @extends SBIS3.CONTROLS.FormattedTextBoxBase
    * @control
    * @author Крайнов Дмитрий Олегович
    * @public
    * @demo SBIS3.CONTROLS.Demo.MyDatePicker
    */

   var DatePicker = CompoundControl.extend([PickerMixin], /** @lends SBIS3.CONTROLS.DatePicker.prototype */{
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
         _dotTplFn: dotTplFn,
         /**
          * Контролл Calendar в пикере
          */
         _calendarControl: undefined,
         /**
          * Опции создаваемого контролла
          */
         _options: {
            /**
             * @cfg {String} Формат отображения данных
             * @remark
             * На базе формата, заданного в этой опции, будет создана html-разметка, в соответствии с которой
             * определяется весь функционал.
             * Необходимо выбрать одну из масок в массиве допустимых значений.
             * Допустимые символы в маске:
             * <ol>
             *    <li>D(day) - календарный день.</li>
             *    <li>M(month) - месяц.</li>
             *    <li>Y(year) - год.</li>
             *    <li>H(hour) - час.</li>
             *    <li>I - минута</li>
             *    <li>S(second) - секунда.</li>
             *    <li>U - доля секунды.</li>
             *    <li>".", "-", ":", "/" - разделители.</li>
             * </ol>
             * @example
             * <pre>
             *     <option name="mask">HH:II:SS.UUU</option>
             * </pre>
             * @variant 'DD.MM.YYYY'
             * @variant 'DD.MM.YY'
             * @variant 'DD.MM'
             * @variant 'YYYY-MM-DD'
             * @variant 'YY-MM-DD'
             * @variant 'HH:II:SS.UUU'
             * @variant 'HH:II:SS'
             * @variant 'HH:II'
             * @variant 'DD.MM.YYYY HH:II:SS.UUU'
             * @variant 'DD.MM.YYYY HH:II:SS'
             * @variant 'DD.MM.YYYY HH:II'
             * @variant 'DD.MM.YY HH:II:SS.UUU'
             * @variant 'DD.MM.YY HH:II:SS'
             * @variant 'DD.MM.YY HH:II'
             * @variant 'DD.MM HH:II:SS.UUU'
             * @variant 'DD.MM HH:II:SS'
             * @variant 'DD.MM HH:II'
             * @variant 'YYYY-MM-DD HH:II:SS.UUU'
             * @variant 'YYYY-MM-DD HH:II:SS'
             * @variant 'YYYY-MM-DD HH:II'
             * @variant 'YY-MM-DD HH:II:SS.UUU'
             * @variant 'YY-MM-DD HH:II:SS'
             * @variant 'YY-MM-DD HH:II'
             * @variant 'YYYY'
             * @variant 'MM/YYYY'
             * @see date
             * @see isCalendarIconShow
             */
            mask: 'DD.MM.YY',
            text: null,
            /**
             * @cfg {Date|String} Начальное значение даты, с которой откроется контрол.
             * @remark
             * Строка должна быть формата ISO 8601.
             * @example
             * <pre>
             *     <option name="date">2015-03-07T21:00:00.000Z</option>
             * </pre>
             * @see isCalendarIconShow
             * @see onDateChange
             * @see setDate
             * @see getDate
             */
            date: null,
            /**
             * @cfg {Boolean} Показана ли иконка календарика.
             * @remark
             * Если {@link mask маска} представляет собой только время, то автоматически иконка календарика прячется, т.е. значение
             * опции самостоятельно сменится на false.
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
            /**
             * @cfg {String} Режим уведомления о смене даты.
             * @variant 'complete' событие onDateChange стреляет только при окончании работы с полем даты(уход фокуса, выбор даты из календаря или нажатие клавиши insert).
             * @variant 'change' событие onDateChange стреляет при каждом изменении значения даты.
             * @noShow
             * @deprecated
             */
            notificationMode: 'change',

            validators: [],

            pickerConfig: {
               corner: 'tl',
               horizontalAlign: {
                  side: 'left',
                  offset: -182
               },
               verticalAlign: {
                  side: 'top',
                  offset: -11
               }
            }
         },
         _onFocusInHandler: undefined,
         _dateBox: undefined
      },

      $constructor: function () {
         this._publish('onDateChange', 'onDateSelect');
      },

      init: function () {
         DatePicker.superclass.init.call(this);

         this._dateBox = this.getChildControlByName('dateBox');

         // Проверить тип маски -- дата, время или и дата, и время. В случае времени -- сделать isCalendarIconShown = false
         this._checkTypeOfMask(this._options);

         // Первоначальная установка даты, если передана опция
         if ( this._options.date ) {
            this._dateBox._setDate( this._options.date );
         }

         if (this._options.text  &&  !this._options.date) {
            this.setText(this._options.text);
         }

         this._calendarInit();
         // this._addDefaultValidator();

         this._dateBox.subscribe('onDateChange', this._onDateBoxDateChanged.bind(this));
         this._dateBox.subscribe('onTextChange', this._onDateBoxTextChanged.bind(this));

         this._dateBox.subscribe('onDateSelect', function (e, date) {
            this._notify('onDateSelect', date);
         }.bind(this));

         this._container.removeClass('ws-area');
         this._initValidators();
      },

      _modifyOptions : function(options) {
         this._checkTypeOfMask(options);
         return DatePicker.superclass._modifyOptions.apply(this, arguments);
      },

      _initValidators: function() {
         var self = this;
         $ws.helpers.forEach(this._options.validators, function (validator) {
            // Хак, исправить позже
            self._dateBox._options.validators.push(validator);
         });
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

                  // Если календарь открыт данным кликом - обновляем календарь в соответствии с хранимым значением даты
                  if (self._picker.isVisible() && self._dateBox.getDate()) {
                     self._chooserControl.setStartValue(self._dateBox.getDate());
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
            rangeselect: false
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

     /**
      * В добавление к проверкам и обновлению опции text, необходимо обновить поле _date
      * @param text
      * @private
      */
      setText: function (text) {
         this._dateBox.setText(text);
      },
      getText: function() {
        return this._dateBox.getText();
      },

      setValue: function (value) {
         this._dateBox.setValue(value);
      },

      /**
       * Метод установки/замены даты.
       * @param {Date} date Новая дата.
       * @example
       * <pre>
       *    //Зададим март 2016
       *    var startDate = new Date(2016,02);
       *    datePicker.setDate(startDate);
       * </pre>
       * @see date
       * @see getDate
       * @see onDateChange
       * @see mask
       */
      setDate: function (date) {
         this._dateBox.setDate(date);
      },

      /**
       * Метод получения текущего значения даты.
       * @returns {Date|String} Начальное значение даты, с которой откроется контрол.
       * @example
       * <pre>
       *     var date = datePicker.getDate();
       *     textBox.setText(date);
       * </pre>
       * @see date
       * @see setDate
       * @see onDateChange
       */
      getDate: function() {
        return this._dateBox.getDate();
      },

      _onDateBoxDateChanged: function () {
         var date = this._dateBox.getDate();
         this._options.date = date;
         this._notifyOnPropertyChanged('date', date);
         this._notify('onDateChange', date);
      },
      _onDateBoxTextChanged: function () {
         var text = this._dateBox.getText();
         this._options.date = text;
         this._notifyOnPropertyChanged('text', text);
         this._notify('onTextChange', text);
      },
      markControl: function (s, showInfoBox) {
         this._dateBox.markControl(s, showInfoBox);
      },

      clearMark: function () {
         this._dateBox.clearMark();
      },
      isMarked: function () {
         return this._dateBox.isMarked();
      },
      setValidators: function (validators) {
         this._dateBox.setValidators(validators);
      },
      validate: function () {
         return this._dateBox.validate();
      }
   });

   return DatePicker;
});