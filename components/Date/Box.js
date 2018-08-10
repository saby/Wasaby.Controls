/**
 * TODO Компонент пока тестировался только в Chrome
 */
define(
   'SBIS3.CONTROLS/Date/Box',
   [
      'Core/IoC',
      'Core/constants',
      'SBIS3.CONTROLS/FormattedTextBox/FormattedTextBoxBase',
      'SBIS3.CONTROLS/Utils/DateUtil',
      'tmpl!SBIS3.CONTROLS/FormattedTextBox/FormattedTextBox',
      'SBIS3.CONTROLS/Utils/ControlsValidators',
      // Разобраться с общими стилями https://inside.tensor.ru/opendoc.html?guid=37032b47-6830-4b96-a4f3-727ea938bf58&des
      'css!Controls/Input/resources/InputRender/InputRender',
      'css!SBIS3.CONTROLS/TextBox/TextBox',
      'css!SBIS3.CONTROLS/FormattedTextBox/FormattedTextBox',
      'css!SBIS3.CONTROLS/Date/Box/DateBox'
      // 'i18n!SBIS3.CONTROLS/Date/Box'
   ],
   function (IoC, constants, FormattedTextBoxBase, DateUtil, FormattedTextBoxTpl, ControlsValidators) {

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
    * @class SBIS3.CONTROLS/Date/Box
    * @extends SBIS3.CONTROLS/FormattedTextBox/FormattedTextBoxBase
    *
    *
    * @control
    * @author Крайнов Д.О.
    * @public
    */

   var DateBox = FormattedTextBoxBase.extend(/** @lends SBIS3.CONTROLS/Date/Box.prototype */{
      _dotTplFn: FormattedTextBoxTpl,
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
             * @cfg {String} Режим автокомплита
             * @variant 'default' автокомплит который используется для одиночных дат
             * @variant 'start' используется для начала периода
             * @variant 'end' используется для конци периода
             * @noshow
             */
            autocompleteMode: 'default'
         }
      },

      _modifyOptions: function(options) {
         var options = DateBox.superclass._modifyOptions.apply(this, arguments);

         if (!options.className) {
            options.className = '';
         }
         options.className += ' controls-DateBox';
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
         options._modelForMaskTpl = this._getItemsForTemplate(options._formatModel, options._maskReplacerForTemplate);
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
             key = event.which || event.keyCode,
             date;

         if (key == constants.key.insert) {
            date = new Date();
            if (this.getType() === 'date') {
               date.setHours(0, 0, 0, 0);
            }
            this.setDate(date);
         } else if (key == constants.key.plus || key == constants.key.minus) {
            if (curDate) {
               curDate = new Date(curDate.getTime());
               if (this.getType() === 'time') {
                  return;
               } else {
                  curDate.setDate(curDate.getDate() + (key == constants.key.plus ? 1 : -1));
               }
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
               time: rk('Время заполнено некорректно.'),
               date: rk('Дата заполнена некорректно.'),
               datetime: rk('Дата или время заполнены некорректно.')
            };
         //Добавляем к прикладным валидаторам стандартный, который проверяет что дата заполнена корректно.
         this.addValidators([{
            validator: function() {
               return self._getFormatModel().isEmpty(this._getMaskReplacer()) ? true : self._options.date instanceof Date;
            },
            errorMessage: _validationErrors[this.getType()]
         }, {
            validator: function() {
               return self._options.date instanceof Date ? self._options.date.getFullYear() > 1400 : true;
            },
            errorMessage: rk('Год должен быть больше 1400.')
         }]);
      },

     /**
      * В добавление к проверкам и обновлению опции text, необходимо обновить поле _date
      * @param text
      * @private
      */
      setText: function (text) {
         var oldText = this._options.text;
         DateBox.superclass.setText.call(this, text);
         this._options.date = text == '' ? null : this._getDateByText(text, this._lastDate);
         this._setLastDate(this._options.date);
         // Во время пользовательского ввода в режиме complete события генерируются при потере фокуса.
         // Но если значение устанавливается программно, то мы генерируем события сразу же.
         if (this._options.notificationMode === 'complete' && oldText !== this._options.text) {
            this._notifyOnTextChange();
            this._notifyOnDateChanged();
         }
      },

      /**
       * Производит установки даты.
       * @param {Date} date Новая дата.
       * @remark
       * При использовании с контролом {@link SBIS3.CONTROLS/Date/Picker} существует следующее поведение: если в методе устанавливают несуществующую календарную дату, то в качестве значения контрола будет установлен null.
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
      setDate: function (date, silent) {
         this._setDate(date, silent);
         if (!silent) {
            this._onTextChanged();
            this._notifyOnDateChanged();
         }
      },

      /**
       * Установить дату. Приватный метод
       * @param date новое значение даты, объект типа Date
       */
      _setDate: function (date, silent) {
         var oldText   = this._options.text;
         this._updateOptionsByDate(date);
         if (!silent && oldText !== this._options.text) {
            this._notifyOnTextChange();
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
            options.text = '';
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
         if (this._options.date && this._options.date.getSQLSerializationMode() !== mode) {
            // Дата могла прийти в компонент извне, не изменяем ее.
            this._options.date = new Date(this._options.date.getTime());
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
         this._setHtml( this._getHtmlMask() );
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
            oldText = this.getText();
            oldDate = this.getDate();
            date = this._getDateByText(this._options.text, this._lastDate, true);
            if (date && !date.equals(oldDate)) {
               this._setDate(date);
            }
            if ((this._options.notificationMode === 'textChange' && oldText !== this.getText()) ||
                (this._options.notificationMode === 'dateChange' && oldDate !== this.getDate())) {
               this._notifyOnTextChange();
               this._notifyOnDateChanged();
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
            mask = this._options.mask,
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
            // Для контрола с маской MM/YYYY не имеет смысла сохранять дату между вводом дат т.к. это приводит
            // к неожиданным результатам. Например, была программно установлена дата 31.12.2018.
            // меняем месяц на 11. 31.11 несуществует. Можно скорректировать на 30.11.2018. Теперь пользователь
            // вводит 12 в качесте месяца и мы получаем 30.12.2018...
            dd   = date && mask !== 'MM/YYYY' ? date.getDate() : 1,
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
         if (this._getFormatModel().isFilled()) {
            if (yyyy === '0000') {
               // Нулевого года не существует
               return null;
            } else {
               return this._createDate(yyyy, mm, dd, hh, ii, ss, uuu, autoComplete);
            }
         } else if (autoComplete) {
            if (Array.indexOf(filled, "HH") !== -1 && Array.indexOf(notFilled, "II") !== -1) {
               ii = this._getFormatModel().getGroupValueByMask("II", '0');
               filled.push("II");
            }
            return this._createAutocomplitedDate(
               (filled.indexOf("YY") !== -1 || filled.indexOf("YYYY") !== -1 || mask.indexOf('Y') === -1) ? yyyy : null,
               (filled.indexOf("MM") !== -1 || mask.indexOf('M') === -1) ? mm : null,
               (filled.indexOf("DD") !== -1 || mask.indexOf('D') === -1) ? dd : null,
               (filled.indexOf("HH") !== -1 || mask.indexOf('H') === -1) ? hh : null,
               (filled.indexOf("II") !== -1 || mask.indexOf('I') === -1) ? ii : null,
               (filled.indexOf("SS") !== -1 || mask.indexOf('S') === -1) ? ss : null,
               (filled.indexOf("UU") !== -1 || mask.indexOf('U') === -1) ? uuu : null,
               this._getFormatModel().isEmpty(this._getMaskReplacer())
            );
         }
         return null;
      },
      _createAutocomplitedDate: function (year, month, date, hour, minute, second, millisecond, isEmpty) {
         var now = new Date(),
            controlType = this.getType();

         var getDate = function (autocompliteDefaultDate) {
            autocompliteDefaultDate = autocompliteDefaultDate || now.getDate();
            if (this._options.autocompleteMode === 'start') {
               return 1;
            } else if (this._options.autocompleteMode === 'end') {
               return DateUtil.getEndOfMonth(new Date(year, month)).getDate();
            } else {
               return autocompliteDefaultDate;
            }
         }.bind(this);

         // Автокомплитим только если пользователь частично заполнил поле, либо не заполнил, но поле обязательно для заполнения
         // Не автокомплитим поля в периодах
         if (isEmpty && (!this._isRequired() || this._options.autocompleteMode === 'start' || this._options.autocompleteMode === 'end')) {
            return null;
         }

         if (controlType === 'date' || controlType === 'datetime'){
            if (this._isRequired() && year === null && month === null && date === null) {
               year = now.getFullYear();
               month = now.getMonth();
               date = now.getDate();
            } else if (year !== null) {
               if (year === now.getFullYear()) {
                  if (month !== null) {
                     if (month === now.getMonth()) {
                        // Заполнен текущий год и месяц
                        if (date === null) {
                           date = getDate();
                        }
                     } else {
                        if (date === null) {
                           date = getDate(1);
                        }
                     }
                  } else {
                     // Заполнен текущий год
                     month = month !== null ? month : now.getMonth();
                     if (date === null) {
                        date = getDate();
                     }
                  }
               } else {
                  // Заполнен год, отличный от текущего
                  if (month === null) {
                     if (this._options.autocompleteMode === 'end') {
                        month = 11;
                     } else {
                        month = 0;
                     }
                  }
                  if (date === null) {
                     if (this._options.autocompleteMode === 'end') {
                        date = 31;
                     } else {
                        date = 1;
                     }
                  }
               }
            } else if (date !== null){
               month = month !== null ? month : now.getMonth();
               year = year!== null ? year : now.getFullYear();
            }
            if (year !== null && month !== null && date !== null) {
               return this._createDate(year, month, date, hour, minute, second, millisecond, true);
            }
         } else if (controlType === 'time'){
            if (hour !== null) {
               if (minute === null) {
                  minute = 0;
               }
               return this._createDate(year, month, date, hour, minute, second, millisecond, true);
            }
         }
         return null;
      },

      _isRequired: function () {
         for(var i = 0; i < this._options.validators.length; i++) {
            var validator = this._options.validators[i];
            if (validator.validator === ControlsValidators.required && !validator.noFailOnError) {
               return true;
            }
         }
         return false;
      },
      /**
       * Создает дату. В отличии от конструктора Date если задан год < 100, то не преобразует его в 19хх.
       * @param yyyy
       * @param mm
       * @param dd
       * @param hh
       * @param ii
       * @param ss
       * @param uuu
       * @param autoCorrect если true, то корректирует дату если переданы неправильные значения ее элементов, иначе возвращает null.
       * Если передана дата большая чем максимальная дата в текущем месяце, то будет установлена максимальная дата.
       * @returns {Date}
       * @private
       */
      _createDate: function (yyyy, mm, dd, hh, ii, ss, uuu, autoCorrect) {
         var date, endDateOfMonth;

         if (autoCorrect) {
            endDateOfMonth = DateUtil.getEndOfMonth(new Date(yyyy, mm, 1)).getDate();
            if (dd > endDateOfMonth) {
               dd = endDateOfMonth;
            }
         }

         if (!this._dateIsValid(yyyy, mm, dd, hh, ii, ss)) {
            return null;
         }

         date = new Date(yyyy, mm, dd, hh, ii, ss, uuu);
         //TODO возможно надо переделать но ошибку по смокам лечит
         //когда контрол с вводом времени, то в yyyy приходит 0 и ставится 0 год, потом валится БЛ
         if (yyyy < 100 && yyyy > 0) {
            date.setFullYear(yyyy);
         }
         return date;
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