/**
 * TODO Компонент пока тестировался только в Chrome
 */
define(
   'js!SBIS3.CONTROLS.TimeInterval',
   [
      'js!SBIS3.CONTROLS.FormattedTextBoxBase',
      'js!SBIS3.CONTROLS.PickerMixin',
      'html!SBIS3.CONTROLS.TimeInterval'
   ],
   function (FormattedTextBoxBase, PickerMixin, dotTplFn) {

      'use strict';

      /**
       * Контрол предназначен для ввода информации о количестве времени с точностью от дня до минуты.
       * Можно вводить только значения особого формата даты ISO_8601 с точностью от дней до минут.
       * @class SBIS3.CONTROLS.TimeInterval
       * @extends SBIS3.CONTROLS.FormattedTextBoxBase
       * @control
       * @demo SBIS3.CONTROLS.Demo.MyTimeInterval
       * @public
       * @author Крайнов Дмитрий Олегович
       */

      var TimeInterval = FormattedTextBoxBase.extend( [PickerMixin], /** @lends SBIS3.CONTROLS.TimeInterval.prototype */{
          /**
           * @event onChangeInterval Срабатывает при изменении временного интервала.
           * @param {$ws.proto.EventObject} eventObject Дескриптор события.
           * @param {String} interval Количество времени.
           * @example
           * <pre>
           *     var prevInterval = timeInterval.getInterval();
           *     var onChangeIntervalFn = function(event, interval) {
           *        if (prevInterval != interval) {
           *           buttonUpdate.setEnabled(true);
           *        }
           *     };
           *     timeInterval.subscribe('onChangeInterval', onChangeIntervalFn);
           * </pre>
           * @see interval
           * @see mask
           * @see setInterval
           * @see setDays
           * @see setHours
           * @see setMinutes
           */
         $protected: {
            _dotTplFn: dotTplFn,
            /**
             * Допустимые управляющие символы в маске.
             * Условные обозначения:
             *     1. D(day) -  Календарный день
             *     2. H(hour) - Час
             *     3. I - Минута
             */
            _controlCharactersSet: {
               'D' : 'd',
               'H' : 'd',
               'I' : 'd'
            },
            _sections: {
               'days' : 'D',
               'hours' : "H",
               'minutes' : "I"
            },
            /**
             * Допустимые при создании контролла маски.
             */
            _possibleMasks: [
               'DDDD:HH:II',
               'DDD:HH:II',
               'DD:HH:II',
               "DDDD:HH",
               "DDD:HH",
               "DD:HH",
               "HHHH:II",
               "HHH:II",
               "HH:II"
            ],
            /**
             * объект $ws.proto.TimeInterval
             */
            timeInterval: null,
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
                *    <li>H(hour) - час.</li>
                *    <li>I - минута.</li>
                *    <li>":" - используется в качестве разделителя.</li>
                * </ol>
                * @example
                * <pre>
                *     <option name="mask">DD:HH:II</option>
                * </pre>
                * @variant 'DD:HH:II'
                * @variant 'DD:HH'
                * @variant 'HH:II'
                * @variant 'DDDD:HH:II'
                * @variant 'DDD:HH:II'
                * @variant 'HHHH:II'
                * @variant 'HHH:II'
                * @variant 'DDDD:HH'
                * @variant 'DDD:HH'
                * @see interval
                * @see setInterval
                * @see setDays
                * @see setHours
                * @see setMinutes
                */
               mask: 'DD:HH',
               /**
                * @cfg {String} Временной интервал
                * @remark
                * В качестве значения опция принимает строку вида: P*DT*H*M, где:
                * <ul>
                *    <li>P - обозначение начала задания даты. Значение опции всегда должно начинаться с этого символа,
                *    даже при необходимости задать только время;</li>
                *    <li>D - указывает на то, что стоящее перед этим символом число является количеством дней;</li>
                *    <li>T - обозначение начала задания времени;</li>
                *    <li>H - ставится после количества часов;</li>
                *    <li>M - ставится после количества минут.</li>
                * </ul>
                * @example
                * <pre>
                *    <option name="interval">PT20H0M</option>
                * </pre>
                * @see mask
                * @see onChangeInterval
                * @see setInterval
                * @see getInterval
                * @see setDays
                * @see setHours
                * @see setMinutes
                */
               interval: undefined
            }
         },

         $constructor: function () {
            var self = this;
            this._publish('onChangeInterval');

            this._options.text = this.formatModel.getStrMask(this._maskReplacer);
            this.timeInterval = new $ws.proto.TimeInterval;
            if (this._options.interval){
               this.setInterval(this._options.interval);
            }

            this.subscribe('onFocusOut', self._updateTextByTimeInterval);
            this.subscribe('onInputFinished',self._updateTextByTimeInterval);
         },
         /**
          * Устанавливаем количество дней.
          * @param days Дни в интервале.
          * @example
          * <pre>
          *     timeInterval.setDays(2);
          * </pre>
          * @see interval
          * @see mask
          * @see setInterval
          * @see setHours
          * @see setMinutes
          * @see getInterval
          * @see onChangeInterval
          */
         setDays: function (days) {
            this._setSection(days, "days");
         },
         /**
          * Устанавливаем количество часов.
          * @param hours Часы в интервале.
          * @example
          * <pre>
          *     timeInterval.setHours(30);
          * </pre>
          * @see interval
          * @see mask
          * @see setInterval
          * @see setDays
          * @see setMinutes
          * @see getInterval
          * @see onChangeInterval
          */
         setHours: function (hours) {
            this._setSection(hours, "hours");
         },
         /**
          * Устанавливаем количество минут.
          * @param minutes Минуты в интервале.
          * @example
          * <pre>
          *     timeInterval.setMinutes(50);
          * </pre>
          * @see interval
          * @see mask
          * @see setInterval
          * @see setDays
          * @see setHours
          * @see getInterval
          * @see onChangeInterval
          */
         setMinutes: function (minutes) {
            this._setSection(minutes, "minutes");
         },

         /**
          * @param value Значение
          * @param section Что обновляем ( дни, часы, минуты)
          * @private
          */
         _setSection: function(value, section){
            var values = this.timeInterval.toObject();
            values[section] = value;
            this.timeInterval.set(values);
            this._updateTextByTimeInterval();
         },

         /**
          * Установить интервал.
          * @param {String} interval Количество времени. В качестве значения принимает строку вида 'P*DT*H*M', где:
          * <ul>
          *    <li>P - обозначение начала задания даты. Строка всегда должна начинаться с этого символа,
          *    даже при необходимости задать только время;</li>
          *    <li>D - указывает на то, что стоящее перед этим символом число является количеством дней;</li>
          *    <li>T - обозначение начала задания времени;</li>
          *    <li>H - ставится после количества часов;</li>
          *    <li>M - ставится после количества минут.</li>
          * </ul>
          * Можно передать, например, строку 'PT1530M', при маске 'HH:II' будет установлено значение 25:30,
          * а при маске 'DD:HH:II' - 01:01:30.
          * @example
          * Зададим значение 2 дня 30 часов и 50 минут, вывод зависит от маски.
          * Массивом - важен порядок:
          * <pre>
          *     timeInterval.setInterval([2,30,50]);
          * </pre>
          * Строкой:
          * <pre>
          *     timeInterval.setInterval('P2DT30H50M');
          * </pre>
          * Объектом:
          * <pre>
          *     timeInterval.setInterval({days:2, hours:30, minutes: 50});
          * </pre>
          * @see interval
          * @see getInterval
          * @see setDays
          * @see setHours
          * @see setMinutes
          * @see mask
          * @see onChangeInterval
          */
         setInterval: function ( interval ) {
            this.timeInterval.set(interval);
            this._updateTextByTimeInterval();
            this._notify('onChangeInterval', this.timeInterval.toString());
         },
         /**
          * Метод получения интервала, заданного либо опцией {@link interval}, либо методом {@link setInterval} возвращает
          * значение строкой вида 'P*DT*H*M', где:
          * <ul>
          *    <li>P - обозначение начала задания даты;</li>
          *    <li>D - указывает на то, что стоящее перед этим символом число является количеством дней;</li>
          *    <li>T - обозначение начала задания времени;</li>
          *    <li>H - число перед этим символом является количеством часов;</li>
          *    <li>M - счисло перед этим символом является количеством минут.</li>
          * </ul>
          * @example
          * <pre>
          *     var interval = timeInterval.getInterval();
          *     textInterval.setText(interval);
          * </pre>
          * @see interval
          * @see setInterval
          */
         getInterval: function(){
            return this.timeInterval.toString();
         },
         /**
          * Увеличить маску.
          * @param length на сколько символов увеличить маску
          * @private
          */
         _incMask: function (length) {
            this._options.mask = this._options.mask.substr(0, length) + this._options.mask;
            TimeInterval.superclass.setMask.apply(this, [this._options.mask]);
            this.setText(this._options.text);
            this.setCursor(this.formatModel._options.cursorPosition.group, this.formatModel._options.cursorPosition.position + 1);
         },
         /**
          * Содержит ли интервал дни\минуты
          * @param section (Значения D - дни, I - минуты)
          * @private
          */
         _hasMaskSection: function(section){
            return this._options.mask.indexOf(section) > -1;
         },

         setText: function(text){
            text = this._getTextCorrespondingToMask(text);
            TimeInterval.superclass.setText.apply(this, [text]);
            this._updateIntervalByText(text);
            this._options.text = this._getTextByTimeInterval();
            this._notify('onChangeInterval', this._options.interval);
         },
         /**
          * Получить текст по текущему значению timeInterval.
          * @private
          */
         _getTextByTimeInterval: function () {
            var valuesArray = this._getSectionValues();
            if (valuesArray[0] > 9999){
               valuesArray[0] = 9999;
            }
            return this._getTextCorrespondingToMask(valuesArray.join(':'));
         },
         /**
          * Получить текст, соответствующий маске
          * При установке текста, может получиться такая ситуация, что маска больше текста. В этом случае
          * к тексту слева будет добавлен this._maskReplacer
          * И наоборот, если маска будет меньше текста, то маска будет увеличена, чтобы туда поместился текст
          * @private
          */
         _getTextCorrespondingToMask: function(text){
            while ((text.length < this._options.mask.length || (text[0] != this._maskReplacer && text[0] != "0" && text.length == this._options.mask.length)) && text.split(':')[0].length < 4){
               text = this._maskReplacer + text;
            }
            if (text.length > this._options.mask.length){
               this._options.text = text;
               this._incMask(text.length - this._options.mask.length);
            }
            return text;
         },

         /**
          * Получить массив текущих значений
          * @private
          */
         _getSectionValues: function () {
            var intervalValues = this.timeInterval.toObject(),
               sectionArray = [];

            if (this._hasMaskSection(this._sections.days)) {
               sectionArray.push(intervalValues.days);
               sectionArray.push(intervalValues.hours);
            }
            else{
               sectionArray.push(this.timeInterval.getTotalHours());
            }
            if (this._hasMaskSection(this._sections.minutes)) {
               sectionArray.push(intervalValues.minutes);
            }

            $.each(sectionArray, function(i, value){
               if (value < 10){
                  sectionArray[i] = "0" + value;
               }
            });
            return sectionArray;
         },
         /**
          * Обновить значение timeInterval по модели.
          * @private
          */
         _updateIntervalByText: function(){
            var sectionArray = [];

            if (!this._hasMaskSection(this._sections.days)){
               sectionArray.push(0);
            }
            for (var i = 0; i < this.formatModel.model.length; i += 2){
               sectionArray.push(this.formatModel.model[i].value.join(''));
            }

            this.timeInterval.set(sectionArray);
         },
         /**
          * Обновить текст по текущему значению timeInterval.
          * @private
          */
         _updateTextByTimeInterval: function(){
            this.setText(this._getTextByTimeInterval());
         },
         /**
          * Обновляяет значения this._options.text и interval (вызывается в _replaceCharacter из FormattedTextBoxBase). Переопределённый метод.
          * @private
          */
         _updateText: function(){
            var text = this.formatModel.getText(this._maskReplacer),
                oldDate = this.timeInterval.toString();

            this._updateIntervalByText(text);

            if ((text.split(':')[0].length == this.formatModel.model[0].mask.length) && text.split(':')[0].indexOf(this._maskReplacer) == -1 && this.formatModel.model[0].mask.length < 4) {
               this._options.text = this._maskReplacer + text;
               this._incMask(1);
            }

            // Если дата изменилась -- генерировать событие.
            if ( oldDate !== this.timeInterval.toString()) {
               this._notify('onChangeInterval', this.timeInterval.toString());
               this._notifyOnPropertyChanged('interval');
            }
         }
      });
      return TimeInterval;
   });