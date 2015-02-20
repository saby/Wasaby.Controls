/**
 * @file FieldDate module
 * @author ershovka
 * @responsible filippovsu <su.filippov@tensor.ru>
 */
define('js!SBIS3.CORE.FieldDate',
      ['js!SBIS3.CORE.FieldFormatAbstract',
       'is!browser?js!Ext/jquery-ui/jquery-ui-1.8.5.custom.min',
       'is!browser?css!Ext/jquery-ui/jquery-ui-1.8.5.custom',
       'is!browser?js!SBIS3.CORE.FieldDate/resources/ext/jquery.ui.datepicker-ru'],
      function( FieldFormatAbstract ) {
   'use strict';

   // Есть копипаста в FieldMonth
   var
      datePart = '[0-9]{4}-[0-9]{2}-[0-9]{2}',
      timePart = '[0-9]{2}:[0-9]{2}:[0-9]{2}(\\.[0-9]{1,9})?([+-][0-9]{2}([:-][0-9]{2})?)?',
      summary = '^' + datePart + '$|^(' + datePart + ' )?' + timePart + '$',
      sqlDateRegExp = new RegExp(summary),
      types = {
         y : 'FullYear',
         m : 'Month',
         d : 'Date',
         h : 'Hours',
         i : 'Minutes',
         s : 'Seconds',
         u : 'Milliseconds'
      };
         
   /**
    * Поле ввода дата/время.
    * Реализует нестандартное поведение при редактировании.
    * При получении фокуса значение поля не выделяется, чтобы невозможно было стереть значение.
    * Следующее умное поведение регулируется опцией {@link autoComplete}:
    * - если часть даты пользователь не указал, то проставляется текущее значение;
    * - если часть времени не указана, то проставляются нули;
    * - если указали только одну цифру, то считается, что перед этой цифрой ноль.
    * @class $ws.proto.FieldDate
    * @extends $ws.proto.FieldFormatAbstract
    * @control
    * @category Date/Time
    * @designTime actions SBIS3.CORE.FieldString/design/design
    * @designTime plugin SBIS3.CORE.FieldDate/design/DesignPlugin
    * @ignoreOptions trim
    * @ignoreOptions tooltipInside
    * @ignoreOptions maxLength
    */
   $ws.proto.FieldDate = FieldFormatAbstract.extend(/** @lends $ws.proto.FieldDate.prototype */{
      $protected: {
         _options: {
             /**
              * @cfg {String} Маска отображения данных
              * <wiTag group="Управление">
              * Формат отображения данных в поле контрола "Строка ввода".
              *
              * Условные обозначения:
              *     1. D(day) -  календарный день.
              *     2. M(month) - месяц.
              *     3. Y(year) - год.
              *     4. H(hour) - час.
              *     5. I - минута.
              *     6. S(second) - секунда.
              *     7. U - доля секунды.
              * Опция чувствительна к регистру, для задания значения необходимо использовать только заглавные буквы.
              *
              * Количество символом в маске влияет на количество отображаемых символов.
              * Например, YY будет отображать 2 цифры года, а YYYY - 4 цифры.
              *
              * В качестве разделителей можно использовать следующие символы: ".", ":", "-", "/", "\", "|".
              *
              * I. Маски для отображения даты:
              *     1. DD.MM.YYYY
              *     2. DD.MM
              *     3. DD.MM.YY
              *     4. YY-MM-DD
              *     5. YYYY-MM-DD
              *
              * II. Маски для отображения времени:
              *     1. HH:II
              *     2. HH:II:SS
              *     3. HH:II:SS.UUU
              *
              * III. Маски для комбинированного отображения даты и времени:
              *     1. HH:II:SS.UUU
              *     2. DD.MM.YY HH:II:SS.UUU
              *     ...
              *     Совмещяя маски для отображения даты и времени, можно получить множество комбинаций.
              *
              * IV. Отдельно месяц и год можно отобразить следующими масками:
              *     1. MM/YYYY
              *     2. YYYY
              *
              * @example
              * <pre>
              *     mask:'DD.MM.YY HH:II:SS'
              * </pre>
              * При этой маске контрол отобразит подобное значение: "19.09.13 12:37:51".
              * @see getType
              * @see calendar
              * @see strToDate
              */
            mask: 'DD.MM.YY',
             /**
              * @cfg {Boolean} Проверять корректность даты
              * <wiTag group="Данные">
              * По умолчанию для введённого значения даты проверяется её корректность, в т.ч. формат, существование.
              * Это свойство позволяет отключить эту проверку.
              *
              * Отключение свойства может иметь смысл для каких-либо нетривиальных случаев обработки даты, где
              * встроенный валидатор и отображаемая им ошибка могут мешать.
              * @example
              * <pre>
              *    performFormatValidation: false,
              *    validators: [
              *       {
              *          validator: myCustomDateValidator,
              *          errorMessage: 'Проверьте актуальность значения!',
              *          noFailOnError: true
              *       }
              *    ]
              * </pre>
              */
            performFormatValidation: true,
             /**
              * @cfg {Boolean} Отображать ли значок календаря
              * Это свойство определяет отображение значка календаря справа от контрола.
              * <wiTag group="Отображение">
              * Если поставить значение calendar: false, то значок календаря выводиться не будет,
              * и ввести дату можно будет только с клавиатуры.
              * @example
              * <pre>
              *    calendar: true
              * </pre>
              * @see arrows
              * @see mask
              */
            calendar: true,
            /**
             * @cfg {Boolean} Отображать ли стрелки переключения дней
             * При их использовании текущее значение меняется на +/- 1 один.
             * <wiTag group="Отображение">
             * @example
             * <pre>
             *    arrows: true
             * </pre>
             * @see calendar
             * @see isArrows
             * @see setArrows
             */
            arrows: false,
            /**
             * @cfg {Boolean} Умное автодополнение
             * <wiTag group="Управление">
             * Происходит в двух случаях:
             * <ol>
             *    <li>При потере фокуса.</li>
             *    <li>При вводе значения целиком, которое не является верным, напр. 38.05.14.</li>
             * </ol>
             * Описание поведения см. в описании класса.
             * @see setAutoComplete
             * @see isAutoComplete
             */
            autoComplete: true,
            /**
             * @cfg {DateTime} Значение
             * <wiTag group="Данные">
             * @see setStartDate
             * @see clearStartDate
             */
            value: null,
            /**
             * @cfg {Number|Function} Разделитель столетия
             * <wiTag group="Управление">
             * Если используется формат даты с двумя числами в году, то этот параметр позволяет задать границу разделения столетий. 
             * Например, при значении 70 года будут определяться как 1970...2069. 
             * При задании функции она будет вызвана при попытке определенияи года по двузначному значению.
             * @deprecated Будет удалено с 3.8.
             * @noShow
             */
            centuryDivision: 70,
            className: 'ws-field-date',
            cssClass: 'ws-field-date'
         },
         _losingActive: null,
         _containerClickHandher: null,
         _year : 0,
         _parentMenuId: undefined,
         _startDate: undefined
      },
      $constructor: function(){
         var
            self = this,
            // проверка на содержание цифр
            numRegExp,
            value;
         if (this._options.centuryDivision != 70) {
            $ws.single.ioc.resolve('ILogger').log('FieldDate', 'Опция centuryDivision помечена как deprecated и будет удалена с 3.8.');
         }
         this._keysWeHandle[$ws._const.key.y] = '0';
         this._getExtendedTooltipTarget().before('<input class="input-helper" type="hidden"/>');
         this._initCalendar();
         this._initArrows();
         $ws.helpers.keyDown(this._inputControl, function(event){
            if (event.which == $ws._const.key.insert && !event.ctrlKey){
               event.preventDefault();
               event.stopPropagation();
               self._modifyDate();
               return false;
            }
            if (event.which == $ws._const.key.plus || event.which == $ws._const.key.minus){
               self._modifyDate(event.which);
               return false;
            }
            if (event.which == $ws._const.key.f7){
               event.preventDefault();
               self._toggleCalendar();
            }
            if (event.which == $ws._const.key.esc){
               if (/block/.test($('#ui-datepicker-div').css('display'))){
                  self._container.find('.input-helper').datepicker('hide');
                  event.stopPropagation();
               }
            }
         });
         // бинд для удаления выделенного значения по нажатию на delete или backspace
         this._container.bind('keyup', function(event) {
            // <магия>регэксп надо задавать при каждой проверке, иначе он возравщает различный результат</магия>
            numRegExp = new RegExp('[0-9]', 'g');
            if ((event.keyCode === 46 || event.keyCode === 8) && !numRegExp.test(self._getString())) {
               value = self._inputControl.val();
               if (value === '') {
                  value = null;
               }
               self._updateSelfContextValue(value);
               self._notifyOnValueChange(self.getValue());
            }
         });
         this._options.validators.splice(0, 0, {validator : this._textValidate});
      },
      /**
       * Функция-обработчик события _onKeyUp. Переопределена, т.к. работа по нажатию на delete/backspace выполняется в событии onkeyDown
       * @param {object} event
       * @private
       */
      _onKeyUp: function(event) {
      },
      /**
       * Добавляет стрелки около поля ввода, если они нужны. Подсписывается на события
       * @private
       */
      _initArrows: function() {
         if (this.isArrows()) {
            this._container.prepend('<div class="ws-date-button ws-date-button-right ws-date-button-enabled ws-field-date-arrow"></div>');
            this._container.prepend('<div class="ws-date-button ws-date-button-left ws-date-button-enabled ws-field-date-arrow"></div>');
            this._container.children('.ws-field-date-arrow').bind('click', this._arrowClick.bind(this));
            this._updateArrowsState(this.getValue());
         }
      },

      /**
       * Создаем иконку с календарем
       * @private
       */
      _initCalendar: function() {
         if (this.isCalendar() && this._clearMask.search(/[DMY]/) !== -1 && this.getType() !== 'time') {
            var
               self = this,
               inputHelper = self._container.find('.input-helper').datepicker({
                  onSelect: function(dateText){
                     // здесь лежит год в формате yyyy
                     self._year = arguments[1].drawYear;
                     self.setValue(self.strToDate(dateText, self._year));
                     self.setActive(true);
                     self._notify('onChange', self._notFormatedVal());
                  },
                  beforeShow: function(input){
                     $(input).val(self._inputControl.get(0).textContent || self._inputControl.get(0).innerText);
                     if (self._startDate) {
                        inputHelper.datepicker('setDate', self._startDate);
                     }
                     self._container.trigger('wsSubWindowOpen');
                  },
                  onClose: function() {
                     self._container.trigger('wsSubWindowClose');
                     if(self._watchTimer) {
                        clearInterval(self._watchTimer);
                        self._watchTimer = null;
                     }
                  },
                  dateFormat: self._getMask(self._options.mask, 'datepicker'),
                  changeYear: true,
                  yearRange: '1950:2050',
                  duration: 0
               });
            self._getCalendarContainer()
               .mousedown(function(event){
                  /**
                   * jQuery UI tracks a mousedown on a document to hide a calendar on clicking somewhere
                   * Thus we are tracking an icon click by ourselves, prevent this event from bubbling up
                   */
                  event.stopImmediatePropagation();
               })
               .click(function(){
                     //по пожеланию Новикова Д. показываем календарь даже у задизабленного поля ввода даты
//                  if (self.isEnabled()) {
                     self.setActive(true);
                     self._toggleCalendar();
//                  }
               });
            if (self._parent) {
               self._parent.getContainer().bind('container-clicked', function(){
                  self._container.find('.input-helper').datepicker('hide');
               });
            }
            if (!$.datepicker.propagationStopped) {
               $.datepicker.propagationStopped = true;
               $.datepicker.dpDiv.bind('click', function(e){
                  e.stopPropagation();
               });
            }
         } else {
            this._options.calendar = false;
            this._getCalendarContainer().remove();
         }
      },

      /**
       * Обработчик клика по стрелке
       * @param {Object} event jQuery-событие
       * @private
       */
      _arrowClick: function(event) {
         var $arrow = $(event.target),
            date;
         if (this.isEnabled() && this.getValue()) {
            date = new Date(this.getValue());
            date.setDate(date.getDate() + ($arrow.hasClass('ws-date-button-right') ? 1 : -1));
            this.setValue(date);
            this._notify('onChange', new Date(date));
         }
      },
      /**
       * Обновляет состояние "включённости" стрелок
       * @param {Date|null} value Текущее значение контрола
       * @private
       */
      _updateArrowsState: function(value) {
         var enable = this.isEnabled() && !!value;
         if (this.isArrows()) {
            this._container.children('.ws-field-date-arrow')
               .toggleClass('ws-date-button-disabled', !enable)
               .toggleClass('ws-date-button-enabled', enable);
         }
      },
      /**
       * @return {Boolean}
       * @protected
       */
      _canValidate: function() {
         return true;
      },
      _invokeValidation: function(){
         var
            parentResult = $ws.proto.FieldDate.superclass._invokeValidation.apply(this, arguments),
            v = this.getValue();

         if (v && typeof v === 'string') {
            v = this.strToDate(v);
         }
         if (v && v.getFullYear && v.getFullYear() < 1400){
            parentResult.result = false;
            parentResult.errors.push('Год не может быть меньше 1400');
         }
         return parentResult;
      },
      /**
       * Установка режима редактирования по месту в поле ввода.
       * @param {Boolean} [s=true] Флаг редактирования по месту.
       * Значения:
       * true|undefined - режим редактирования по месту.
       * false - обычный режим полей ввода
       */
      setEditAtPlace: function (s) {
         this._container
            .toggleClass('ws-FieldEditAtPlace__underline', !!s)
            .find('.calendar-container')
               .toggleClass('ws-hidden', !!s);
      },
      /**
       * Обновление значения в текстовом поле при его изменении извне
       * @protected
       */
      _updateInPlaceValue: function() {
      },
      /**
       * Изменить первоначальное выделение текста
       * Убирает первоначальное выделение текста у FieldDate.
       * @param range
       * @private
       */
      _modifyRange: function(range) {
         range.collapse(true);
      },
      /**
       * <wiTag group="Отображение">
       * Установить строку подсказки для контрола
       * @param {String} tooltip Текст всплывающей подсказки.
       * @example
       * <pre>
       *     control.setTooltip("Текст всплывающей подсказки");
       * </pre>
       */
      setTooltip: function(tooltip) {
         this._getCalendarContainer().attr('title', tooltip);
      },
      _getExtendedTooltipTarget: function() {
         return this._container.find('.ws-field');
      },
      destroy: function() {
         this._toggleCalendar(false);
         if(this._parent && this._containerClickHandher) {
            this._parent.getContainer().unbind('container-clicked', this._containerClickHandher);
         }
         if (this.isArrows()) {
            this._container.children('.ws-field-date-arrow').unbind('click');
         }
         $.datepicker.dpDiv.unbind('click');
         this._container.unbind('keyup');
         $ws.proto.FieldDate.superclass.destroy.apply(this, arguments);
      },
      _prepareRegExp: function(){
         this._sepExp = /[^YMDHISU]+/g;
         this._notsepExp = /[YMDHISU]+/g;
      },
      _isCalendarOpen: function() {
         var
            dp = $('#ui-datepicker-div');
         return dp.css('display') == 'block' && dp.attr('for') == this.getName();
      },
      /**
       * Отобразить/скрыть дейтпикер
       * @param {Boolean} [state]
       * @private
       */
      _toggleCalendar: function(state) {
         if(!this.isCalendar()){
            return;
         }
         var
            dp = $('#ui-datepicker-div');
         if(state === undefined) {
            state = !this._isCalendarOpen();
         }
         var inputHelper = this._container.find('.input-helper');
         if (state) {
            inputHelper
               .datepicker('enable')
               .datepicker('show');
            var dpYear = dp.find('.ui-datepicker-year');
            if (this._options.enabled) {
               dpYear.removeAttr('disabled');
            } else {
               dpYear.attr('disabled', 'disabled');
               inputHelper.datepicker('disable');
            }
         } else {
            inputHelper.datepicker('hide');
         }
         if (state) {
            if(this._parentMenuId === undefined) {
               this._parentMenuId = this._getParentMenuId();
            }
            dp.toggleClass('ws-has-parent-menu', !!this._parentMenuId);
            dp.attr('for-menu', this._parentMenuId);
            dp.attr('for',this.getName());
            dp.position({my: 'left top', at:'left bottom', of:this._getExtendedTooltipTarget()});
            if(!this._watchTimer) {
               this._watchTimer = setInterval(this._watchTargetPresent.bind(this), 100);
            }
         }
      },
      /**
       * Проверить видимость поля
       * Скрывает дейтпикер если поле невидимо. 
       * Вызывается по таймеру.
       * @private
       */
      _watchTargetPresent: function() {
         if(!$ws.helpers.isElementVisible(this._inputControl)){
            this._toggleCalendar(false);
         }
      },
      /**
       * возвращает jQuery объект с иконкой календаря
       * @returns {jQuery}
       * @private
       */
      _getCalendarContainer: function() {
         return this._container.find('.calendar-container');
      },
      _keyboardHover : function(event){
         if(event.which === $ws._const.key.y && event.ctrlKey) {
            this._setValueInternal(null);
            this._moveCursor(0,0);
            this._onValueChangeHandler();
            return false;
         } else {
            return $ws.proto.FieldDate.superclass._keyboardHover.apply(this, arguments);
         }
      },
      /**
       * Проверяет дату в строковом виде на соответствие какому-нибудь из известных шаблонов.
       * @param   {String}             value
       * @returns {String|undefined}  Возвращает маску или undefined, если сопоставления не произошло.
       * @private
       */
      _testStrValueMasks: function(value) {
         var mask;
         if (/^\d{2}\.\d{2}\.\d{4}$/g.test(value)) {
            mask = 'dd.mm.yyyy';
         } else if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/g.test(value)) {
            mask = 'yyyy-mm-dd hh:ii:ss';
         } else if (/^\d{4}-\d{2}-\d{2}$/g.test(value)) {
            mask = 'yyyy-mm-dd';
         } else if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{3,9}[+-]\d{2}:\d{2}$/g.test(value)) {
            mask = 'yyyy-mm-dd hh:ii:ss.uuu';
         } else if($ws.helpers.isISODate(value)) {
            mask = 'ISO8601';
         } else if(sqlDateRegExp.test(value)) {
            mask = 'SQL';
         }
         return mask;
      },
      /**
       * Логика обработки двузначного года
       * Не изменяет год, если он не лежит в полуинтервале [0..100).
       * @param {Number} year
       * @returns {Number}
       * @private
       */
      _normalizeYear: function(year) {
         if(0 <= year && year < 100) {
            year += year >= this._options.centuryDivision ? 1900 : 2000;
         }
         return year;
      },
      /**
       * Создаёт дату из объекта определёного формата.
       * Учитывает, что в js месяцы начинаются с нуля и предварительно вычитает месяц.
       * @param {Object} obj
       * Объект может содержать поля 'y', 'm', 'd', 'h', 'i', 's', 'u'.
       * @returns {Date}
       * @private
       */
      _createDateFromObj: function(obj) {
         //Ниже расположен костыль для даты 2014.01.01 и времени меньше 01:00:00 (стал нужен ввиду обновления windows)
         var
            y = this._normalizeYear(obj.y),
            m = obj.m - 1,
            h = !$ws._const.compatibility.dateBug ? obj.h : (m === 0 && obj.d === 1 && obj.h === 0 ? 1 : obj.h);
         return new Date(y, m, obj.d, h, obj.i, obj.s, obj.u);
      },
      /**
       * Производит автодополнение даты.
       * @see autoComplete
       * @private
       */
      _autoCompleteValue: function() {
         if(!this.isAutoComplete()) {
            return;
         }
         var
            obj = this._tokenizeValue(),
            now = new Date(),
            nowModified = new Date(),
            dateModified = new Date(),
            lastMonthDay,
            tokens = obj.tokens;
         if(!obj.nonEmpty) {
            return;
         }
         tokens.y = (tokens.y || obj.yearIs00) ? this._normalizeYear(tokens.y) : now.getFullYear();
         if(obj.monthIs00) {
            tokens.m = 1;
         }
         tokens.m = Math.min(12, tokens.m || now.getMonth() + 1);
         dateModified.setYear(tokens.y);
         lastMonthDay = dateModified.setLastMonthDay(tokens.m-1).getDate();
         if(tokens.d) {
            if(tokens.d > lastMonthDay) {
               tokens.d = lastMonthDay;
            }
         } else {
            if(obj.dayIs00) {
               tokens.d = 1;
            } else {
               tokens.d = now.getDate();
               if (now.getDate() == nowModified.setLastMonthDay().getDate()) {
                  tokens.d = lastMonthDay;
               }
            }
         }
         if(!this._validateTokens(tokens).length) {
            this._setValueInternal(this._createDateFromObj(tokens));
         } else {
            this._setValueInternal(null);
            this._insDateFromTokens(tokens);
         }
         this._onValueChangeHandler(true);
      },
      /**
       * Разбивает строковое значение даты на числовые токены в соответствии с переданной маской.
       * @param {String} [str=this._curValue(true)]
       * @param {String} [mask=this._options.mask]
       * @returns {{tokens: {}, nonEmpty: boolean, yearIs00: boolean}}
       * Объект с полями tokens и nonEmpty.
       * Значения токенов будутч переданы в объект tokens и будут храниться в полях 'y', 'm', 'd', 'h', 'i', 's', 'u'.
       * Если хотя бы одно значение будет заполнено, то nonEmpty будет истиной.
       * Если год был указан и был равен нулю, то yearIs00 будет истиной.
       * Важно! При пустом годе в tokens.y всё равно придёт 0, но yearIs00 будет ложью.
       * @private
       */
      _tokenizeValue: function(str, mask) {
         if (str === undefined) {
            str = this._curValue(true).replace(/_/g, ' ');
         }
         if (mask === undefined) {
            mask = this.getMask().toLowerCase();
         }
         var
            args = ['y', 'm', 'd', 'h', 'i', 's', 'u'],
            charVal,
            // значение элемента токена
            val,
            // позиция символа в маске
            posInMask,
            // длина подмаски
            lenSubMask,
            // находится ли в маске данный символ
            isInMask,
            tokens = {},
            yearIs00 = false,
            nonEmpty = false,
            monthIs00 = false,
            dayIs00 = false,
            // объект Date() с данными на текущий момент времени
            now = new Date();
         for (var i = 0, l = args.length; i < l; ++i) {
            charVal = args[i];
            posInMask = mask.indexOf(charVal);
            lenSubMask = mask.lastIndexOf(charVal) - posInMask + 1;
            isInMask = posInMask !== -1;
            val = isInMask ? parseInt(str.substr(posInMask, lenSubMask), 10) : 0;
            if (!isInMask) {
               switch (charVal) {
                  case 'y':
                     val = now.getFullYear();
                     break;
                  case 'm':
                     val = now.getMonth() + 1;
                     break;
                  case 'd':
                     val = now.getDate();
                     break;
               }
            }
            if (val === 0) {
               // todo: наверное переделать на объект
               switch (charVal) {
                  case 'y':
                     yearIs00 = true;
                     break;
                  case 'm':
                     monthIs00 = true;
                     break;
                  case 'd':
                     dayIs00 = true;
                     break;
               }
            }
            nonEmpty |= isInMask && (val !== null && isNaN(val) === false);
            tokens[charVal] = val || 0;
         }
         return {
            tokens: tokens,
            yearIs00: yearIs00,
            monthIs00: monthIs00,
            dayIs00: dayIs00,
            nonEmpty: nonEmpty
         };
      },
      /**
       * Чинит маску в соответствии с правилами ограничений символов
       * @param {String} mask Распознаваемая маска.
       * @returns {String} обновленная маска
       * @protected
       */
      _fixBrokenMask: function(mask) {
         var
            // правила ограничений
            charCount = {
               y: 4,
               m: 2,
               d: 2,
               h: 2,
               i: 2,
               s: 2,
               u: 3
            },
            // текущий символ в маске
            currentChar,
            // следующий символ в маске
            nextChar,
            // новая маска (с учётом фиксов)
            newMask = '',
            // колчиество символов одного типа (например 'yyyy')
            charSet = 0;
         mask = mask.toLowerCase();
         for (var i = 0; i < mask.length; i++) {
            currentChar = mask.charAt(i);
            nextChar = mask.charAt(i+1);
            charSet++;
            // если символа нет в наборе, значит это разделитель
            if (currentChar && !charCount[currentChar]) {
               newMask += currentChar;
               charSet = 0;
            } else if (currentChar !== nextChar) {
               // год может быть двух- и четырехзначным
               if (currentChar === 'y' && charSet === 2) {
                  charCount.y = 2;
               }
               for (var j = 0; j < charCount[currentChar]; j++) {
                  newMask += currentChar;
               }
               charSet = 0;
            }
         }
         return newMask.toUpperCase();
      },
      /**
       * <wiTag group="Управление">
       * Переводит строку в дату по маске.
       * @param {String} str Распознаваемая строка.
       * @param {Number} [year] Год распознаваемой даты.
       * @returns {Date}
       * @example
       * <pre>
       *    strToDate('11.08.2005') == Thu Aug 11 2005 00:00:00 GMT+0400 (Московское время (зима))
       * </pre>
       * @see mask
       * @see performFormatValidation
       */
      strToDate: function(str, year){
         var mask = this._testStrValueMasks(str) || this.getMask().toLowerCase();
         switch (mask) {
            case 'ISO8601':
               return $ws.helpers.dateFromISO(str);
            case 'SQL':
               return Date.fromSQL(str);
         }
         var
            contextVal = this.getValue(),
            obj = this._tokenizeValue(str.replace('/[^0-9\.\:\-\ \\ \/]+/g', ''), mask),
            params = obj.tokens;
         if (year) {
            params.y = year;
         } else {
            if (mask.indexOf('y') === -1) {
               params.y = new Date().getFullYear();
            }
            params.y = this._normalizeYear(params.y);
         }
         if (contextVal instanceof Date && this.getType() === 'time') {
            params.d = contextVal.getDate();
            params.m = contextVal.getMonth()+1;
         } else if (params.d === 0) {
            params.d = obj.nonEmpty ? 1 : NaN;
         }
         return this._createDateFromObj(params);
      },
      _setValueInternal: function(value){
         if(typeof value === 'string'){
            if (!this._testStrValueMasks(value)) {
               value = this._formatTest(value);
            }
            this._inputControl.html(this._htmlMask);
            value = this.strToDate(value);
         }
         if (!value) {
            this.clear();
            value = null;
         } else if (!isNaN(value.getTime())) {
            this._insDate(value);
            this._updatePureValue();
            this._year = value.getFullYear();
         }
         $ws.proto.FieldAbstract.prototype._setValueInternal.apply(this, [value]);
         this._hideMask(this.isActive());
         this._updateArrowsState(value);
      },
      /**
       * Проверяет дату, если нужно - обнуляет время
       * @param {Date} d Проверяемая дата
       * @return {Date|null}
       * @private
       */
      _checkDate: function(d) {
         if(d && d instanceof Date && !isNaN(d.getTime())){
            var symbols = {
               H : 'Hours',
               I : 'Minutes',
               S : 'Seconds',
               U : 'Milliseconds'
            },
               found = {};
            for(var j = 0; j < this._options.mask.length; ++j){
               found[this._options.mask[j]] = true;
            }
            for(var i in symbols){
               if(symbols.hasOwnProperty(i) && !found[i]){
                  d['set' + symbols[i]](0);
               }
            }
            return d;
         }
         else {
            return null;
         }
      },
      /**
       * Возвращает дефолтное значение
       * @returns {Date|null}
       * @private
       */
      _getDefaultValue: function(){
         if(typeof this._options.value === 'function'){
            return this._checkDate(this._options.value());
         }
         else if(typeof this._options.value === 'string'){
            return this._checkDate(this.strToDate(this._options.value));
         }
         else if(this._options.value instanceof Date){
            return this._checkDate(this._options.value);
         }
         return null;
      },
      /**
       * возвращает RegExp для сравнения с символом нажатой клавиши
       *
       * @return {RegExp}
       */
      _keyExp: function(){
         return [/[0-9]/, false];
      },
      /**
       * Устанавливает переданное значение в значение поля
       * @param {Date|Number} [insdate] Может быть объектом Date() или кодом символа(+/-).
       * Если параметр отсутствует, то вставляется текущая дата/время.
       */
      _modifyDate: function(insdate) {
         this._insDate(insdate);
         this._onValueChangeHandler();
      },
      /**
       * Визуально вставляет переданное значение в поле
       * @param {Date|Number} [insdate] Может быть объектом Date() или кодом символа(+/-).
       * Если параметр отсутствует, то вставляется текущая дата/время.
       */
      _insDate: function(insdate){
         var
            orDate, cursor, active,
            date = typeof insdate == 'object' ? insdate : new Date(),
            tokens = {};
         if (insdate == $ws._const.key.plus || insdate == $ws._const.key.minus){
            orDate = this.getValue();
            if (orDate === null || orDate == 'Invalid Date' || orDate == 'NaN' || orDate.getTime() < 0) {
               date = new Date();
            } else {
               date = new Date(orDate.getTime());
            }
            if (insdate == $ws._const.key.plus) {
               date.setDate(date.getDate()+1);
            }
            if (insdate == $ws._const.key.minus) {
               date.setDate(date.getDate()-1);
            }
         }
         for(var i in types) {
            if(types.hasOwnProperty(i)) {
               tokens[i] = date['get' + types[i]]() + (i === 'm' ? 1 : 0);
            }
         }
         active = this.isActive() && !this._losingActive;

         // Если поле активно, то запомним положение курсора, чтобы после замены кишочков вернуть курсор где он и был 
         if (active) {
            cursor = this._getCursor(true);
         }
         
         this._insDateFromTokens(tokens);

         // Возвращаем положение курсора полю, если оно активно
         if (active) {
            this._moveCursor.apply(this, cursor);
         }
      },
      /**
       * Вставляет переданное значение по токенам в поле.
       * Может вставить некорректное значение.
       * @param {Object} tokens
       */
      _insDateFromTokens: function(tokens){
         var
            mas = this._clearMask.split(/[^YMDHISU]/g);
         for (var i = 0; i < mas.length; i++) {
            var
               c = mas[i].charAt(0).toLowerCase();
            this._inputControl.find('em:eq(' + i * 2 + ')').text(this._roundTime(tokens[c], mas[i].length));
         }
      },
      /**
       * округляет полученное значение
       * @param t обрабатываемая строка
       * @param [n] количество разрядов в результате
       * @return {String} окрулённое значение
       */
      _roundTime: function(t, n){
         var
            p = '';
         if ((t.toString().length - n) > 0) {
            return t.toString().substr(t.toString().length - n, n);
         } else {
            var v = n - t.toString().length;
            for (var i = 1; i <= v; i++) {
               p += '0';
            }
            return p + t;
         }
      },
      /**
       * Метод применяет сдвиг по часовому поясу и возвращает строковое значение или объект Date(),
       * в противном случае null
       * @param {boolean} isStringResult флаг для выбора представления значения
       * true - строка; false - Date Object
       * @returns {string|Object|null}
       * @private
       */
      _notFormatedVal: function(isStringResult){
         var
            // значение часового пояса
            timeZone = new Date().getTimezoneOffset() / -60,
            timeZoneAbs = Math.abs(timeZone),
            // применить сдвиг по часовому поясу
            appendTimeZone = function(dt) {
               return timeZone === 0 ? dt : dt + (timeZone < 0 ? '-' : '+') + (timeZoneAbs < 10 ? '0': '') + timeZoneAbs;
            },
            result = null,
            dateObjVal = null,
            dataType = this.getType(),
            stringVal = this._getString(),
            // mode режим сериализации текущего инстанса даты в SQL-формат
            SQLSerializationMode;
         if (dataType === 'time') {
            stringVal = appendTimeZone(stringVal);
         }
         if (isStringResult) {
            result = stringVal;
         } else {
            switch (dataType) {
               case 'datetime':
                  // true - Сериализуется как Дата и время
                  SQLSerializationMode = true;
                  break;
               case 'time':
                  // false - Сериализуется как Время
                  SQLSerializationMode = false;
                  break;
               case 'date':
                  // undefined - Сериализуется как Дата
                  SQLSerializationMode = undefined;
                  break;
            }
            if (typeof stringVal === 'string' && stringVal.indexOf(this._placeHolder()) === -1) {
               dateObjVal = this.strToDate(stringVal).getTime();
               result = new Date(dateObjVal);
               result.setSQLSerializationMode(SQLSerializationMode);
            }
         }
         return result;
      },
      /**
       * <wiTag group="Данные">
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
            obj = {
               date : ['Y', 'M', 'D'],
               time : ['H', 'I', 'S', 'U']
            },
            result = '',
            s = 0;
         for (var i in obj){
            for (var j = 0, l = obj[i].length; j < l; j++){
               if (this._clearMask.indexOf(obj[i][j]) != -1){
                  s++;
                  result = i;
                  break;
               }
            }
         }
         return s == 2 ? 'datetime' : result;
      },
      /**
       * Проверить корректность токенов
       * Валидирует токены, проверяя корректность их как даты.
       * Есть проблема с валидацией года, так как в токене он приходит в виде целого
       * округленного числа, из-за чего невозможно проверить корректоность его значения.
       * @param tokens
       * @returns {Array} Массив ошибок в текстовом виде. Можно передать в валидатор.
       * Пустой массив означает отсутствие ошибок.
       * @private
       */
      _validateTokens: function(tokens) {
         var
         // допустимые единицы времени содержащиеся в маске
            maskTimeUnits = {},
         // массив маски ввода без спец. символов
            maskArray = this._clearMask.split(this._sepExp),
         // сообщения для ошибок
            message = {
               y : ' год',
               m : ' месяц',
               d : ' день',
               h : ' час',
               i : 'ы минуты',
               s : 'ы секунды',
               u : 'ы миллисекунды'
            },
         // упорядоченные временные отрезки
         // TODO: доделать валидацию года
            orderedTimeUnits = ['u', 's', 'i', 'h', 'd', 'm'/*, 'y'*/],
         // имя метода для установки/получения значения единицы времени
            methodName,
         // значение единицы времени из value
            actualNumVal,
         // значение единицы времени в токене
            numVal,
         // интервал для корректного сравнения временных единиц
            offset,
         // массив ошибок
            errors = [],
         // значение в формате DateObject
            value = this._createDateFromObj(tokens);
         $.each(maskArray, function(i, maskPath){
            maskTimeUnits[maskPath.charAt(0).toLowerCase()] = maskPath.length;
         });
         $.each(orderedTimeUnits, function(charOrder, charVal){
            if( maskTimeUnits[charVal] === undefined ) {
               return;
            }
            methodName = types[charVal];
            offset = 0;
            if (methodName === 'Month') {
               offset++;
            }
            numVal = tokens[charVal];
            actualNumVal = value['get' + methodName]();
            if (numVal !== actualNumVal + offset) {
               errors.push('Неверно заполнен' + message[charVal]);
               // дни, месяца и года начинаются с единицы
               if (charOrder > 3) {
                  offset++;
               }
               // Восстанавливаем дату, убирая кривое значение, чтобы оно не переполняло и не портило другие.
               offset += actualNumVal - numVal;
               value['set' + methodName](offset);
            }
         });
         return errors;
      },
      /**
       * Проверка введённого значение даты на корректность
       * Используется как один из встроенных валидаторов.
       * Отключается опцией {@link performFormatValidation}.
       * @returns {Boolean|Array}
       * @private
       */
      _textValidate: function(){
         var
            obj = this._tokenizeValue(),
            result;
         if(!this.isPerformFormatValidation() || !obj.nonEmpty) {
            return true;
         }
         result = this._validateTokens(obj.tokens);
         if(!result.length) {
            result = true;
         }
         return result;
      },
      setActive: function(active){
         //Хак для Хрома (ну и для остального тоже есть смысл) -
         //надо выключать contenteditable по уходу фокуса с контрола, и включать по приходу, поскольку
         //В Хроме при событии keydown на каком-то элементе может быть так, что оно дойдёт до body, и потом фокус непонятно
         //почему уйдёт на элемент с contenteditable=true. как выход можно включать/выключать contenteditable при приходе-уходе фокуса
         //на элемент. это происходит только при уходе фокуса с элемента с contenteditable на другой элемент,
         //и последующим событием keydown, необработанном тем элементом, и всплывшим до body.
         // (!) При этом ещё главная беда в том, что событие keydown обрабатывается элементом с contenteditable
         // (содержимое меняется), но не отлавливается форматирующими обработчиками, из-за чего не происходит форматирования эл-та,
         // и содержимое получается "кривым"
         this._inputControl.attr('contenteditable', active ? 'true' : 'false');

         if (!active) {
            this._losingActive = true;
            this._autoCompleteValue();
            this._losingActive = null;
         }
         $ws.proto.FieldDate.superclass.setActive.apply(this, arguments);
         if (!active && this._containerClickHandher){
            this._containerClickHandher();
         }
      },
      _setEnabled: function(state) {
         if (this.isCalendar()) {
            this._getCalendarContainer().toggleClass('calendar-disabled', !state);
            $('.ui-datepicker[for="' + this.getName() + '"]').toggleClass('ws-calendar-disabled', !state);
         }
         this._updateArrowsState(this.getValue());
         $ws.proto.FieldDate.superclass._setEnabled.apply(this, arguments);
      },

      /**
       * Используется для обработки событий изменения данных внутри контрола.
       * Обычно вызывается по change и keyup.
       * @param {Boolean}  [noAutoComplete=false]  Не звать автодополнение (иначе будет рекурсия)
       * @param onKeyUp попали сюда по вводу с клавиатуры, нужно в fieldLink, там у input переопределяется _noFormatedVal
       * @protected
       */
      _onValueChangeHandler: function(noAutoComplete, onKeyUp) {
         var
            value = this._curValue(true),
            notFormattedVal = this._notFormatedVal();
         if (!noAutoComplete && this.isAutoComplete() && onKeyUp !== true) { //если был вызов на keyup, то не валидируем дату вообще
            // Если дата введена целиком, но она некорректна, то пытаемся дополнить 
            if (value.indexOf(this._placeHolder()) === -1 && this._validateTokens(this._tokenizeValue().tokens).length) {
               this._autoCompleteValue();
               // мы придём в _onValueChangeHandler (сюда) ещё раз из _autoCompleteValue 
               return;
            }
         }
         if (notFormattedVal instanceof Date && !isNaN(notFormattedVal.getTime())) {
            this._year = notFormattedVal.getFullYear();
         }
         this._updateArrowsState(this._curval);
         $ws.proto.FieldDate.superclass._onValueChangeHandler.apply(this, arguments);
      },

      /**
       * Получить id родительского меню
       * @returns {String|null}
       * @protected
       */
      _getParentMenuId: function() {
         var
            menuParent = this._container.closest('.ws-menu-container');
         return menuParent.length ? menuParent.attr('id') : null;
      },
      
      /**
       * <wiTag group="Управление">
       * Установить дату, с которой откроется календарь.
       * @param {Date} date - дата.
       * @example
       * <pre>
       *     control.setStartDate(new Date());
       * </pre>
       * @see clearStartDate
       * @see value
       * @public
       */
      setStartDate: function(date) {
         this._startDate = date;
      },
      /**
       * <wiTag group="Управление">
       * Сбросить дату, установленную в {@link setStartDate}.
       * @example
       * <pre>
       *     control.clearStartDate();
       * </pre>
       * @see setStartDate
       * @see value
       * @public
       */
      clearStartDate: function() {
         this._startDate = undefined;
      },
      /**
       * <wiTag group="Отображение">
       * Отображён ли значок календаря
       * @returns {boolean}
       * @see calendar
       * @public
       */
      isCalendar: function() {
         return this._options.calendar;
      },
      /**
       * <wiTag group="Данные">
       * Проверяется ли корректность даты
       * @returns {boolean}
       * @see performFormatValidation
       * @public
       */
      isPerformFormatValidation: function() {
         return this._options.performFormatValidation;
      },
      /**
       * <wiTag group="Данные">
       * Установить (опцию) проверку на корректность даты
       * @param {boolean} performFormatValidation
       * @see performFormatValidation
       * @see isPerformFormatValidation
       * @public
       */
      setPerformFormatValidation: function(performFormatValidation) {
         this._options.performFormatValidation = !!performFormatValidation;
         this._textValidate();
      },
      /**
       * <wiTag group="Отображение">
       * Отображаются ли стрелки переключения дней
       * @returns {boolean}
       * @see arrows
       * @see setArrows
       * @public
       */
      isArrows: function() {
         return this._options.arrows;
      },
      /**
       * <wiTag group="Данные">
       * Включено ли умное автодополнение
       * @returns {boolean}
       * @see autoComplete
       * @see setArrows
       * @public
       */
      isAutoComplete: function() {
         return this._options.autoComplete;
      },
      /**
       * <wiTag group="Данные">
       * Включить умное автодополнение
       * @param {boolean} autoComplete
       * @see autoComplete
       * @see isAutoComplete
       * @public
       */
      setAutoComplete: function(autoComplete) {
         autoComplete = !!autoComplete;
         this._options.autoComplete = autoComplete;
         if (autoComplete) {
            this._autoCompleteValue();
         }
      }
   });
   return $ws.proto.FieldDate;
});
