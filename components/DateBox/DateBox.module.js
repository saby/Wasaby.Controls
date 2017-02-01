/**
 * TODO Компонент пока тестировался только в Chrome
 */
define(
   'js!SBIS3.CONTROLS.DateBox',
   [
      'Core/IoC',
      'Core/ConsoleLogger',
      'Core/constants',
      'js!SBIS3.CONTROLS.FormattedTextBoxBase',
      'js!SBIS3.CONTROLS.Utils.DateUtil',
      'html!SBIS3.CONTROLS.DateBox',
      'js!SBIS3.CONTROLS.FormWidgetMixin'
      // 'i18n!SBIS3.CONTROLS.DateBox'
   ],
   function (IoC, ConsoleLogger, constants, FormattedTextBoxBase, DateUtil, dotTplFn, FormWidgetMixin) {

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
    * Осуществить ввод информации можно только с клавиатуры.
    * Можно вводить только значения особого формата даты.
    * @class SBIS3.CONTROLS.DateBox
    * @extends SBIS3.CONTROLS.FormattedTextBoxBase
    * @control
    * @author Крайнов Дмитрий Олегович
    * @public
    * @demo SBIS3.CONTROLS.Demo.MyDateBox
    */

   var DateBox = FormattedTextBoxBase.extend([FormWidgetMixin], /** @lends SBIS3.CONTROLS.DateBox.prototype */{
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
        *    dateBox.subscribe('onDateChange', dateChangeFn);
        * </pre>
        */
      $protected: {
         /**
          * Допустимые при создании контролла маски.
          */
         _possibleMasks: [
            // I. Маски для отображения даты:
            'DD.MM.YYYY',
            'DD.MM.YY',
            'DD.MM',
            'YYYY-MM-DD',
            'YY-MM-DD',
            // II. Маски для отображения времени:
            'HH:II:SS.UUU',
            'HH:II:SS',
            'HH:II',
            // III. Маски для комбинированного отображения даты и времени:
            'DD.MM.YYYY HH:II:SS.UUU',
            'DD.MM.YYYY HH:II:SS',
            'DD.MM.YYYY HH:II',
            'DD.MM.YY HH:II:SS.UUU',
            'DD.MM.YY HH:II:SS',
            'DD.MM.YY HH:II',
            'DD.MM HH:II:SS.UUU',
            'DD.MM HH:II:SS',
            'DD.MM HH:II',
            'YYYY-MM-DD HH:II:SS.UUU',
            'YYYY-MM-DD HH:II:SS',
            'YYYY-MM-DD HH:II',
            'YY-MM-DD HH:II:SS.UUU',
            'YY-MM-DD HH:II:SS',
            'YY-MM-DD HH:II',
            // IV. Маски для месяца и года:
            'YYYY',
            'MM/YYYY'
         ],
         /**
          * Храним предыдущую дату, даже если пользователь ввел некоректную дату
          */
         _lastDate: null,
          /**
           * Последняя дата о которой отправляли генерировали событие
           */
         _lastNotifiedDate: null,
         /**
          * Опции создаваемого контролла
          */
         _options: {
            /**
             * Допустимые управляющие символы в маске.
             * Условные обозначения:
             *     1. D(day) -  Календарный день
             *     2. M(month) - Месяц
             *     3. Y(year) - Год
             *     4. H(hour) - Час
             *     5. I - Минута
             *     6. S(second) - Секунда
             *     7. U - Доля секунды
             * @noShow
             */
            _controlCharactersSet: {
               'D' : 'd',
               'M' : 'd',
               'Y' : 'd',
               'H' : 'd',
               'I' : 'd',
               'S' : 'd',
               'U' : 'd'
            },
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
             * @cfg {String} Режим серализации даты при отправке в бизнес логику. В 140 версии значение по умолчанию datetime. В последующих опция будет убрана, а поведение будет соответствовать auto.
             * @variant 'auto' дата будет сериализоваться в зависимости от маски контрола, т.е. если установлена маска в которой присутствует только время, то дата будет сериализоваться как Время, если происутствует дата и время, то как ДатаВремя, если присутствует только дата, то как Дата.
             * @variant 'time'
             * @variant 'date'
             * @variant 'datetime'
             * @noShow
             * @deprecated
             */
            serializationMode: 'auto',

            /**
             * @cfg {String} Режим уведомления о смене даты. Значение по умолчанию textChange.
             * @variant 'complete' события onDateChange и onTextChange стреляют только при окончании работы с полем даты(уход фокуса, выбор даты из календаря или нажатие клавиши insert).
             * @variant 'dateChange' события onDateChange и onTextChange стреляют при каждом изменении значения даты.
             * @variant 'textChange' события onDateChange и onTextChange стреляют при каждом изменении значения текста.
             * @variant 'change' тоже самое что и 'textChange' в будущем будет удалено
             */
            notificationMode: 'textChange',

            /**
             * @cfg {String} Режим работы события onTextChange. Значение по умолчанию onTextEnter.
             * Начиная с версии 3.7.5 опция будет убрана.
             * Если установлена в onActiveChange, то опция notificationMode будет установлена в complete.
             * Если опция notificationMode установлена в complete или dateChange, то события будут генерироваться в соответствии с опцией notificationMode.
             * Используйте опцию notificationMode.
             * @variant 'onActiveChange' событие стреляет на потере фокуса.
             * @variant 'onTextEnter' событие стреляет по мере ввода текста.
             * @deprecated
             */
            onTextChangeMode: 'onTextEnter'
         }
      },

      _modifyOptions: function(options) {
         var options = DateBox.superclass._modifyOptions.apply(this, arguments);

         if (options.onTextChangeMode === 'onActiveChange') {
            options.notificationMode = 'complete';
         }
         if (options.notificationMode === 'change') {
            options.notificationMode = 'textChange';
         }

         // Нормализуем опцию date и обновляем опцию text
         if (options.date) {
            this._updateOptionsByDate(options.date, options);
         }
         // Обновляем опции нужные для отрисовки данных шаблонами
         if (options.text) {
            options._formatModel.setText(options.text, options._maskReplacer);
         }
         options._modelForMaskTpl = this._getItemsForTemplate(options._formatModel, options._maskReplacer);
         return options;
      },

      $constructor: function () {
         this._publish('onDateChange');

         // Если установлен текст, но не установлена дата, то обновим дату
         if (this._options.text  &&  !this._options.date) {
            this.setText(this._options.text);
         }

         this._lastNotifiedDate = this._options.date;
         this._addDefaultValidator();
      },

      _keyDownBind: function(event) {
         var
             curDate = this.getDate(),
             key = event.which || event.keyCode;

         if (key == constants.key.insert) {
            this.setDate(new Date());
         } else if (key == constants.key.plus || key == constants.key.minus) {
            if (curDate) {
               curDate = new Date(curDate);
               curDate.setDate(curDate.getDate() + (key == constants.key.plus ? 1 : -1));
               // При обновлении даты создаем новый экземпляр, чтобы корректно работало определение того,
               // что свойство изменилось во внешнем коде. oldValue === newValue.
               // Плюс мы не хотим менять когда то возвращенное значение.
               this.setDate(curDate);
            }
         } else {
            return DateBox.superclass._keyDownBind.apply(this, arguments);
         }
         event.preventDefault();
      },

      _addDefaultValidator: function() {
         var self = this,
            _validationErrors = {
               time: rk('Время заполнено некорректно'),
               date: rk('Дата заполнена некорректно'),
               datetime: rk('Дата или время заполнены некорректно')
            };
         //Добавляем к прикладным валидаторам стандартный, который проверяет что дата заполнена корректно.
         this._options.validators.push({
            validator: function() {
               return self._getFormatModel().isEmpty(this._getMaskReplacer()) ? true : self._options.date instanceof Date;
            },
            errorMessage: _validationErrors[this.getType()]
         });
      },

     /**
      * В добавление к проверкам и обновлению опции text, необходимо обновить поле _date
      * @param text
      * @private
      */
      setText: function (text) {
         DateBox.superclass.setText.call(this, text);
         this._options.date = text == '' ? null : this._getDateByText(text, this._lastDate);
         this._setLastDate(this._options.date);
      },

      /**
       * Производит установки даты.
       * @param {Date} date Новая дата.
       * @remark
       * При использовании с контролом {@link SBIS3.CONTROLS.DatePicker} существует следующее поведение: если в методе устанавливают несуществующую календарную дату, то в качестве значения контрола будет установлен null.
       * @example
       * <pre>
       *    //Зададим март 2016
       *    var startDate = new Date(2016,02);
       *    dateBox.setDate(startDate);
       * </pre>
       * @see date
       * @see getDate
       * @see onDateChange
       * @see mask
       */
      setDate: function (date) {
         this._setDate(date);
         this._notifyOnDateChanged();
         this._onTextChanged();
      },

      /**
       * Установить дату. Приватный метод
       * @param date новое значение даты, объект типа Date
       */
      _setDate: function (date) {
         var oldText   = this._options.text;
         this._updateOptionsByDate(date);
         if (oldText !== this._options.text) {
            this._notify('onTextChange', this._options.text);
         }
         this._drawDate();
      },

      /**
       * Обновить опции по переданной дате
       * @param date {String|Date}
       * @param options объект опций, необязательный параметр, передается явно там где this._options недоступен, например из _modifyOptions)
       * @private
       */
      _updateOptionsByDate: function (date, options) {
         options = options || this._options;

         var isCorrect = false,
             oldText   = options.text;

         if (date === null || typeof date === 'undefined') {
            options.date = date;
            options.text = this._getFormatModel(options).getStrMask(this._getMaskReplacer(options));
            isCorrect = true;
         }
         if (date instanceof Date) {
            options.date = date;
            options.text = this._getTextByDate(date, options);
            isCorrect = true;
         } else if (typeof date == 'string') {
            //convert ISO-date to Date
            options.date = DateUtil.dateFromIsoString(date);
            if (DateUtil.isValidDate(options.date)) {
               options.text = this._getTextByDate(options.date, options);
               isCorrect = true;
            }
         }
         if ( ! isCorrect) {
            options.date = null;
            options.text = '';
            throw new Error('DateBox. Неверный формат даты');
         }
         this._setLastDate(options.date);
      },

      setValue: function (value) {
         value = value ? value : '';

         if (value instanceof Date) {
            this.setDate(value);
         }
         else if (typeof value == 'string') {
            this.setText(value);
         }
         else {
            throw new Error('Аргументом должна являться строка или дата');
         }
         IoC.resolve('ILogger').log('DateBox', 'метод "setValue" будет удален в 3.7.3.20. Используйте "setDate" или "setText".');
      },

      /**
       * Получить тип отображаемых данных.
       * Возвращает режим работы: дата/ время/ дата и время.
       * @returns (String) Тип данных ('date' || 'time' || 'datetime').
       * @example
       * <pre>
       *    var type = control.getType();
       *    switch(type){
       *       case "date": $ws.core.alert("Дата"); break;
       *       case "time": $ws.core.alert("Время"); break;
       *       case "datetime": $ws.core.alert("ДатаВремя"); break;
       *    }
       * </pre>
       * @see mask
       */
      getType: function(){
         var
            dateTypes = {
               date : ['Y', 'M', 'D'],
               time : ['H', 'I', 'S', 'U']
            },
            mask = this._getMask().split(''),
            result = '',
            s = 0;
         for (var dateType in dateTypes){
            if (dateTypes.hasOwnProperty(dateType)) {
               for (var j = 0, l = dateTypes[dateType].length; j < l; j++) {
                  if (mask.indexOf(dateTypes[dateType][j]) != -1) {
                     s++;
                     result = dateType;
                     break;
                  }
               }
            }
         }
         return s == 2 ? 'datetime' : result;
      },

      /**
       * Метод получения текущего значения даты.
       * @returns {Date|String} Начальное значение даты, с которой откроется контрол.
       * @example
       * <pre>
       *     var date = dateBox.getDate();
       *     textBox.setText(date);
       * </pre>
       * @see date
       * @see setDate
       * @see onDateChange
       */
      getDate: function() {
         var modeMap = {
               'datetime': Date.SQL_SERIALIZE_MODE_DATETIME,
               'date': Date.SQL_SERIALIZE_MODE_DATE,
               'time': Date.SQL_SERIALIZE_MODE_TIME
            },
            mode;
         if (this._options.serializationMode === 'auto') {
            mode = modeMap[this.getType()];
         } else {
            mode = modeMap[this._options.serializationMode];
         }
         if (this._options.date) {
            this._options.date.setSQLSerializationMode(mode);
         }
         return this._options.date;
      },

      /**
       * Получить маску. Переопределённый метод
       */
      _getMask: function () {
         return this._options.mask;
      },

      /**
      * Обновить поле даты по текущему значению даты в this._options.date
      * @private
      */
      _drawDate: function(){
         var newText = this._options.date == null ? '' : this._getTextByDate( this._options.date );
         //записываем текст в модель
         this._getFormatModel().setText(newText, this._getMaskReplacer());
         this._inputField.html( this._getHtmlMask() );
      },

      /**
       * Обновляяет значения this._options.text и this._options.date (вызывается в _replaceCharacter из FormattedTextBoxBase). Переопределённый метод.
       * Если есть хотя бы одно незаполненное место ( плэйсхолдер ), то text = '' (пустая строка) и _date = null
       * @private
       */
      _updateText: function() {
         // Запоминаем старый текст для последующего сравнения и генерации события
         var
             oldText = this._options.text,
             oldDate = this._options.date;

         this._updateTextFromModel();

         // Если текст изменился -- возможно изменилась и дата.
         if (oldText !== this._options.text) {
            this._options.date = this._getDateByText(this._options.text, this._lastDate);
            if (!DateUtil.isValidDate(this._options.date)) {
               this._options.date = null;
            }
            this._setLastDate(this._options.date);
            this._onTextChanged();
            if (this._options.notificationMode === 'textChange' || (this._options.notificationMode === 'dateChange' && oldDate !== this._options.date)) {
               this._notifyOnTextChange();
               this._notifyOnDateChanged();
            }
         }
      },
      //TODO: логика валидации находится на уровне TextBoxBase, но сейчас форматные поля не вызывают функции базового контрола поэтому
      //приходится дублировать логику, в 3.7.4.100 нужно сделать чтобы форматные поля и поля даты вызывали функции родительского контрола
      _onTextChanged: function() {
         this._textChanged = true;
         this.clearMark();
      },

      _notifyOnDateChanged: function() {
         var date = this._options.date;
         if (this._lastNotifiedDate !== date || (this._lastNotifiedDate && date && this._lastNotifiedDate.getTime() !== date.getTime())) {
            this._notifyOnPropertyChanged('date', date);
            this._notify('onDateChange', date);
            this._lastNotifiedDate = date;
         }
      },
      setActive: function(active, shiftKey, noFocus, focusedControl) {
         var date,
            oldText,
            oldDate;

         if (!active) {
            if (!this._getFormatModel().isFilled()) {
               oldText = this.getText();
               oldDate = this.getDate();
               date = this._getDateByText(this._options.text, this._lastDate, true);
               if (date) {
                  this._setDate(date);
               }
               if ((this._options.notificationMode === 'textChange' && oldText !== this.getText()) ||
                   (this._options.notificationMode === 'dateChange' && oldDate !== this.getDate())) {
                  this._notifyOnTextChange();
                  this._notifyOnDateChanged();
               }
            }
            if (this._options.notificationMode === 'complete') {
               this._notifyOnTextChange();
               this._notifyOnDateChanged();
            }
         }
         DateBox.superclass.setActive.apply(this, arguments);
      },

      /**
       * Получить дату в формате Date по строке
       * @param text - дата в соответствии с маской
       * @param oldDate - старая дата
       * @returns {Date} Дата в формата Date
       * @private
       */
      _getDateByText: function(text, oldDate, autoComplete) {
         var
            //используем старую дату как основу, чтобы сохранять части даты, отсутствующие в маске
            //new Date от старой даты делаем, чтобы контекст увидел новый объект
            date = (DateUtil.isValidDate(oldDate)) ? new Date(oldDate.getTime()) : null,
            item,
            value,
            filled = [],
            notFilled = [],
            now = new Date(),
            curYear = now.getFullYear(),
            shortCurYear = curYear % 100,
            curCentury = (curYear - shortCurYear),
            yyyy = date ? date.getFullYear() : 0,
            mm   = date ? date.getMonth() : 0,
            dd   = date ? date.getDate() : 1,
            hh   = date ? date.getHours() : 0,
            ii   = date ? date.getMinutes() : 0,
            ss   = date ? date.getSeconds() : 0,
            uuu  = date ? date.getMilliseconds() : 0;
         for (var i = 0; i < this._getFormatModel().model.length; i++) {
            item = this._getFormatModel().model[i];
            if ( !item.isGroup) {
               continue;
            }
            value = '';
            for (var j = 0; j < item.mask.length; j++) {
               value += (typeof item.value[j] === "undefined") ? this._getMaskReplacer() : item.value[j];
            }
            if (value.indexOf(this._getMaskReplacer()) === -1) {
               switch (item.mask) {
                  case 'YY' :
                     value = Number(value);
                     //Если год задаётся двумя числами, то считаем что это текущий век
                     // если год меньше или равен текущему году + 10, иначе это прошлый век.
                     yyyy = value <= shortCurYear + 10 ? curCentury + value : (curCentury - 100) + value;
                     break;
                  case 'YYYY' :
                     yyyy = value;
                     break;
                  case 'MM' :
                     mm = value - 1;
                     break;
                  case 'DD' :
                     dd = value;
                     break;
                  case 'HH' :
                     hh = value;
                     break;
                  case 'II' :
                     ii = value;
                     break;
                  case 'SS' :
                     ss = value;
                     break;
                  case 'UUU' :
                     uuu = value;
                     break;
               }
               filled.push(item.mask);
            } else {
               notFilled.push(item.mask);
            }
         }
         if (this._dateIsValid(yyyy, mm, dd, hh, ii, ss)) {
            if (this._getFormatModel().isFilled()) {
               return new Date(yyyy, mm, dd, hh, ii, ss, uuu);
            } else if (autoComplete) {
               //TODO: На данный момент по требованиям данной задачи: (https://inside.tensor.ru/opendoc.html?guid=a46626d6-abed-453f-92fe-c66f345863ef&description=)
               //автодополнение работает только если 1) заполнен день и не заполнены месц и год; 2) заполнены день и месяц и не заполнен год;
               //Нужно более общий сценарий работы автодополнения! Выписана задача: (https://inside.tensor.ru/opendoc.html?guid=0be02625-2d2f-4f74-940e-4d0e24b369e4&description=)
               if (Array.indexOf(filled, "DD") !== -1) {
                  if (Array.indexOf(notFilled, "MM") !== -1 && (Array.indexOf(notFilled, "YY") !== -1 || Array.indexOf(notFilled, "YYYY") !== -1)) {
                     return new Date(now.getFullYear(), now.getMonth(), dd, hh, ii, ss, uuu);
                  }
                  if (Array.indexOf(filled, "MM") !== -1 && (Array.indexOf(notFilled, "YY") !== -1 || Array.indexOf(notFilled, "YYYY") !== -1)) {
                     return new Date(now.getFullYear(), mm, dd, hh, ii, ss, uuu);
                  }
               } else if (Array.indexOf(filled, "HH") !== -1 && Array.indexOf(notFilled, "II") !== -1) {
                  ii = this._getFormatModel().getGroupValueByMask("II", '0');
                  return new Date(yyyy, mm, dd, hh, ii, ss, uuu);
               }
            }
         }
         return null;
      },
      _dateIsValid: function(yyyy, mm, dd, hh, ii, ss) {
         var lastMonthDay = (new Date(yyyy, mm)).setLastMonthDay().getDate();
         return ss < 60 && ii < 60 && hh < 24 && mm < 12 && mm >= 0 && dd <= lastMonthDay && dd > 0;
      },
      /**
       * Получить дату в формате строки по объекту Date. Строка соответсвует изначальной маске.
       * Пример: если дата Wed Oct 25 2102 00:00:00 GMT+0400 и изначальная маска DD.MM.YYYY, то строка будет 25.10.2102
       * @param date Дата
       * @returns {string} Строка
       * @private
       */
      _getTextByDate: function(date, options) {
         var
            text = '',
            item,
            model = this._getFormatModel(options).model;

         for (var i = 0; i < model.length; i++) {
            item = model[i];
            if (item.isGroup) {
               switch ( item.mask ){
                  case 'YY'   : text += ( '000' + date.getFullYear() ).slice(-2);     break;
                  case 'YYYY' : text += ( '000' + date.getFullYear() ).slice(-4);     break;
                  case 'MM'   : text += ( '0'   + (date.getMonth() + 1) ).slice(-2);  break;
                  case 'DD'   : text += ( '0'   + date.getDate()).slice(-2);          break;
                  case 'HH'   : text += ( '0'   + date.getHours()).slice(-2);         break;
                  case 'II'   : text += ( '0'   + date.getMinutes()).slice(-2);       break;
                  case 'SS'   : text += ( '0'   + date.getSeconds()).slice(-2);       break;
                  case 'UUU'  : text += ( '00'  + date.getMilliseconds()).slice(-3);  break;
               }
            } else {
               text += item.innerMask;
            }
         }

         return text;
      },

      _setLastDate: function (date) {
         if (date) {
            this._lastDate = date;
         }
      }
   });

   return DateBox;
});