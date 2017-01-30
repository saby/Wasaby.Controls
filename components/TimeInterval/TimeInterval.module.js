/**
 * TODO Компонент пока тестировался только в Chrome
 */
define(
   'js!SBIS3.CONTROLS.TimeInterval',
   [
      'Core/TimeInterval',
      'js!SBIS3.CONTROLS.FormattedTextBoxBase',
      'html!SBIS3.CONTROLS.TimeInterval',
      'css!SBIS3.CONTROLS.TimeInterval'
   ],
   function (cTimeInterval, FormattedTextBoxBase, dotTplFn) {

      'use strict';

      /**
       * Контрол предназначен для ввода информации о количестве времени с точностью от дня до минуты.
       * Можно вводить только значения особого формата даты ISO_8601 с точностью от дней до минут.
       * @class SBIS3.CONTROLS.TimeInterval
       * @extends SBIS3.CONTROLS.FormattedTextBoxBase
       * @demo SBIS3.CONTROLS.Demo.MyTimeInterval
       * @author Крайнов Дмитрий Олегович
       *
       * @control
       * @public
       * @category Date/Time
       */

      var TimeInterval = FormattedTextBoxBase.extend(/** @lends SBIS3.CONTROLS.TimeInterval.prototype */{
         _dotTplFn: dotTplFn,
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
                * @translatable
                * @see interval
                * @see setInterval
                * @see setDays
                * @see setHours
                * @see setMinutes
                */
               mask: 'DD:HH',
               /**
                * @cfg {Number} Максимальное количество символов в левой группе, до которых может увеличиться маска
                * * @remark
                * Допустимые значения:
                * <ol>
                *    <li>2</li>
                *    <li>3</li>
                *    <li>4</li>
                * </ol>
                * @example
                * <pre>
                *     <option name="maxCharsAtLeftGroup">3</option>
                * </pre>
               */
               maxCharsAtLeftGroup: 4,
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

            this._options.text = this._getFormatModel().getStrMask(this._getMaskReplacer());
            this.timeInterval = new cTimeInterval;
            if (this._options.interval){
               this.setInterval(this._options.interval);
            }

            this.setTooltip(this._options.tooltip);
            this.subscribe('onFocusOut', self._updateTextByTimeInterval);
            this.subscribe('onInputFinished',self._updateTextByTimeInterval);
         },

         init: function() {
            TimeInterval.superclass.init.apply(this, arguments);
            this._updateText();
         },

         getText: function() {
            return this._options.text;
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
            this._updateTextByTimeInterval(true);
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
            if (interval == undefined || interval.toString() == this.getInterval()){
               return;
            }
            this.timeInterval.set(interval);
            this._updateTextByTimeInterval(true);
         },
         _getEmptyText: function(){
            return this._getFormatModel().getStrMask(this._getMaskReplacer());
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
            var leftGroupMaskLength = this._getFormatModel().model[0].mask.length;
            //Увеличиваем маску левой группы до размера не большего maxCharsAtLeftGroup
            if ((leftGroupMaskLength + length) > this._options.maxCharsAtLeftGroup){
               length = this._options.maxCharsAtLeftGroup - leftGroupMaskLength;
            }
            if (length < 1){
               return;
            }
            this._options.mask = this._options.mask.substr(0, length) + this._options.mask;
            TimeInterval.superclass.setMask.apply(this, [this._options.mask]);
            this._setText(this._options.text);
            this.setCursor(this._getFormatModel()._options.cursorPosition.group, this._getFormatModel()._options.cursorPosition.position + 1);
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
            var lackMaskLength = text.length - this._options.mask.length;
            //Увеличиваем маску на допустимое кол-во символов, если того требует устанавливаемый текст
            if (lackMaskLength){
               this._incMask(lackMaskLength);
            }
            text = this._getCorrectText(text);
            TimeInterval.superclass.setText.call(this, text);
         },
         _setText: function(text){
            text = this._getCorrectText(text);
            TimeInterval.superclass._setText.call(this, text);
         },
         _getCorrectText: function(text){
            this._getFormatModel().setText(text, this._getMaskReplacer());
            this._updateIntervalByText();
            return this._getTextByTimeInterval();
         },
         /**
          * Получить текст по текущему значению timeInterval.
          * @private
          */
         _getTextByTimeInterval: function () {
            var valuesArray = this._getSectionValues(),
               result = valuesArray;
            //Если значение в левой группе больше, чем предусмотрено в maxCharsAtLeftGroup,
            //то выставляем максимальное значение, соответствующее максимально возможной маске (9999:00:00)
            if (valuesArray[0].toString().length > this._options.maxCharsAtLeftGroup){
               this._incMask(this._options.maxCharsAtLeftGroup);
               result[0] = this._getFormatModel().model[0].mask.replace(/[a-z]/ig, '9');
               this.timeInterval.set([result[0], '00', '00']);
               this._notifyOnPropertyChanged('interval');
            }
            return this._getTextCorrespondingToMask(result.join(':'));
         },
         /**
          * Получить текст, соответствующий маске
          * При установке текста, может получиться такая ситуация, что маска больше текста. В этом случае
          * к тексту слева будет добавлен this._maskReplacer
          * И наоборот, если маска будет меньше текста, то маска будет увеличена, чтобы туда поместился текст
          * @private
          */
         _getTextCorrespondingToMask: function(text){
            while ((text.length < this._options.mask.length || (text[0] != this._getMaskReplacer() && text[0] != "0" && text.length == this._options.mask.length))
               && text.split(':')[0].length < this._options.maxCharsAtLeftGroup){
               text = this._getMaskReplacer() + text;
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
            for (var i = 0; i < this._getFormatModel().model.length; i += 2){
               sectionArray.push(this._getFormatModel().model[i].value.join(''));
            }

            this.timeInterval.set(sectionArray);
            this._notifyOnPropertyChanged('interval');
         },
         /**
          * Обновить текст по текущему значению timeInterval.
          * @private
          */
         _updateTextByTimeInterval: function(needUpdate){
            var currentText = this._getFormatModel().getText(this._getMaskReplacer());
            if ((needUpdate === true) || (currentText !== this._getEmptyText())){
               this._setText(this._getTextByTimeInterval());
            }
         },
         /**
          * Обновляяет значения this._options.text и interval (вызывается в _replaceCharacter из FormattedTextBoxBase). Переопределённый метод.
          * @private
          */
         _updateText: function(){
            var text = this._getFormatModel().getText(this._getMaskReplacer()),
                oldText = this._options.text,
                oldDate = this.timeInterval.toString();

            this._updateIntervalByText(text);
            this._options.text = text;

            if ((text.split(':')[0].length == this._getFormatModel().model[0].mask.length) && text.split(':')[0].indexOf(this._getMaskReplacer()) == -1 && this._getFormatModel().model[0].mask.length < this._options.maxCharsAtLeftGroup) {
               this._options.text = this._getMaskReplacer() + text;
               this._incMask(1);
            }

            if (oldText !== this.getText()){
               this._notifyOnTextChange();
            }

            // Если дата изменилась -- генерировать событие.
            if ( oldDate !== this.timeInterval.toString()) {
               this._notifyOnPropertyChanged('interval');
               this._notify('onChangeInterval', this.timeInterval.toString());
            }
         }
      });
      return TimeInterval;
   });