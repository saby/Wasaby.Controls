/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 21:50
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.FieldDatePicker', ['js!SBIS3.CORE.Control', 'html!SBIS3.CORE.FieldDatePicker', 'html!SBIS3.CORE.FieldDatePicker/FieldDatePicker-legend'], function( Control, dotTplFn, legendTplFn ) {

   "use strict";

   var newSelectDay = function(id, month, year, td) {
      var target = $(id);
      if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
         return;
      }
      var inst = this._getInst(target[0]);
      if(!inst.self || inst.self._options.enabled){
         inst.selectedDay = inst.currentDay = $('a', td).html();
         inst.selectedMonth = inst.currentMonth = month;
         inst.selectedYear = inst.currentYear = year;
      }
      this._selectDate(id, this._formatDate(inst,
         $('a', td).html(), month, year));
   };

   /**
    * @class $ws.proto.FieldDatePicker
    * @extends $ws.proto.DataBoundControl
    * @control
    * @category Date/Time
    * @ignoreOptions value
    */
   $ws.proto.FieldDatePicker = Control.DataBoundControl.extend(/** @lends $ws.proto.FieldDatePicker.prototype */{
      /**
       * @event onDateChange При выборе дня в календаре
       * <wiTag group="Данные">
       * Происходит при выборе пользователем для в календаре
       * — Обработка результата:
       * Результат не обрабатывается
       * @param {Object} eventObject Дескриптор события описание в классе $ws.proto.Abstract
       * @param {Date} selectedDate выбранная дата
       * @example
       * <pre>
       *   calendar.subscribe('onDateChange', function(event, selectedDate){
       *      // если выбрали 23е февраля, то сообщим об этом
       *      if(selectedDate.getDay() === 23 && selectedDate.getMonth() === 1)
       *         $ws.core.alert("Вы выбрали праздничный день!");
       *   });
       * </pre>
       */
      /**
       * @event onMonthChange При изменении месяца в календаре
       * <wiTag group="Данные">
       * Происходит при изменении пользователем текущего месяца в календаре
       * — Обработка результата:
       * Результат не обрабатывается
       * @param {Object} eventObject Дескриптор события описание в классе $ws.proto.Abstract
       * @param {Date} selectedDate выбранная дата, первый день месяца
       * @example
       * <pre>
       *   calendar.subscribe('onMonthChange', function(event, selectedDate){
       *      //если переключились на март, то подсветим 8е марта
       *      if(selectedDate.getMonth() === 2)
       *         this.setHighLight([ [new Date(2013, 2, 8), 'colored-red'] ])
       *   });
       * </pre>
       */
      /**
       * @event onHighlight На подсветку дат
       * <wiTag group="Отображение">
       * Событие, вызываемое для получения информации о днях, которые требуется подсветить.
       * — Обработка результата:
       * Массив вида [ [ Date, css-class], [ Date, css-class ], ... ] - описание дат, которые необходимо подстветить.
       * @param {Object} eventObject Десриптор события описание в классе $ws.proto.Abstract
       * @example
       * <pre>
       *   calendar.subscribe('onHighlight', function(event){
       *      event.setResult([ [new Date(2013, 1, 23), 'ws-bold'], [new Date(2013, 2, 8), 'colored-red'] ]);
       *   });
       * </pre>
       */
      /**
       * @event onLegend На отображение легенды
       * <wiTag group="Отображение">
       * События для получения легенды календаря.
       * — Обработка результата:
       * объект вида ключ : значение, где Ключ - CSS-класс, значение - текст легенды - описание легенды календаря
       *
       * @param {Object} eventObject Дескриптор события описание в классе $ws.proto.Abstract
       *
       * @example
       * <pre>
       *   calendar.subscribe('onLegent', function(event){
       *      event.setResult({'someCssClassName': 'Выберите дату приема на работу'});
       *   });
       * </pre>
       */
      $protected:{
         idDiv:'',
         _options:{
            /**
             * @cfg {Function} Функция отображения дня
             * <wiTag group="Отображение">
             * Вызывается для каждой даты
             * Должна вернуть [true, ''] для обычной отрисовки или [true, 'css-class-name'] для стилизации отображаемого дня заданным CSS-классом. В аргумент приходит дата.
             * Этот формат ожидает jQuery-Ui Datepicker
             * <pre>
             *    dateRenderFunction: function(date){
             *       if(date.getDay() >= 6)
             *          return [true, 'calendar-holiday'];
             *    }
             * </pre>
             */
            dateRenderFunction:null,
            /**
             * @deprecated Будет преобразовано в {@link enabled} в 3.7.0
             * @cfg {Boolean} Только для чтения
             * <wiTag group="Управление">
             * Возможен ли выбор даты в календаре
             */
            forbidChangeDate: false,
            /**
             * @cfg {Boolean} Только для чтения
             * <wiTag group="Управление">
             * Возможен ли выбор и смена даты в календаре
             */
            enabled: true,
            /**
             * @cfg {Boolean} Множественный выбор
             * <wiTag group="Управление" noShow>
             * Возможность выбора диапазона дат в календаре
             */
            dateRangeSelect: false
         },
         _objData : null,
         _defferedShowDatePicker: new $ws.proto.Deferred(),
         _rangeSelectStep: 0,
         _rangeStart: undefined,
         _rangeEnd: undefined,
         _oldSelectDay: newSelectDay
      },
      _dotTplFn: dotTplFn,
      _legendTplFn: legendTplFn,
      $constructor:function () {
         var firstDay,
             self = this;
         //Для совместимости с forbidChangeDate
         this._options.enabled = this._options.forbidChangeDate ? false : this._options.enabled;
         this.subscribe('onInit',this.onInit);
         this._options.value = this._options.value || new Date();
         if( typeof(this._options.value) == 'function') {
            firstDay = this._options.value.apply(this);
         } else {
            firstDay = this._options.value;
         }
         this._publish('onDateChange', 'onMonthChange', 'onHighlight', 'onLegend');
         this.idDiv = '#' + this.getId();
         if (this._isCorrectContainer()) {
            var date = self._parseToDate(firstDay);
            this._defferedShowDatePicker = $ws.helpers.showDatePicker(this.getId(), this._options.dateRenderFunction, self._parseToDate(firstDay));
            this.getContainer().data({'month': (date.getMonth()), 'year': date.getFullYear()});
         }
      },
      /**
       * Функция на инициализацию
       * <wiTag group="Управление" noShow>
       */
      onInit : function(){
         var self = this;
         this._defferedShowDatePicker.addCallback(function () {
            var instance = $.datepicker._getInst(self._container[0]);
            self._notify('onReady');
            self._oldSelectDay = $.datepicker._selectDay;
            if(!self.isEnabled() && instance !== undefined) {
               instance.self = self;
               $.datepicker._selectDay = newSelectDay;
            }
            $(self.idDiv).datepicker('option', 'onSelect', function (dateText, inst) {
                  self._notify('onDateChange', self._parseToDate(dateText));
            });

            $(self.idDiv).datepicker('option', 'onChangeMonthYear', function (year, month, inst) {
               var m = month + '';
               if (m.length < 2) {
                  m = '0' + m;
               }
               //Надо или нет? переставлять тоже на первое число месяца
               // $(this).datepicker( "setDate", '01' + '.' + m + '.' + year );
               self.getContainer().data({'month': month-1, 'year': year});
               self._notify('onMonthChange', self._parseToDate('01' + '.' + m + '.' + year, '.'));
            });

            //Задали функцию для отрисовки дней
            $(self.idDiv).datepicker('option', 'beforeShowDay', function (date) {
               if (self._objData !== null) {
                  var dateStr = date.toDateString();
                  if (self._objData[dateStr] !== undefined) {
                     return [true, self._objData[dateStr], ''];
                  } else {
                     return [true, ''];
                  }
               }
               return [true, ''];
            });
            var highLight = self._notify('onHighlight'),
                  legend;
            if (highLight instanceof $ws.proto.Deferred) {
               highLight.addCallback(function (arr) {
                  self.setHighLight(arr);
               });
            }
            else if (highLight !== undefined) {
               self.setHighLight(highLight);
            }

            legend = self._notify('onLegend');
            if (legend instanceof $ws.proto.Deferred) {
               legend.addCallback(function (result) {
                  self.setLegend(result);
               });
            }
            else if (legend !== undefined) {
               self.setLegend(legend);
            }
         });
      },
      /**
       * <wiTag group="Данные" noShow>
       * Получить выбранный в календаре период
       * @returns {Array|null} массив из 2 объектов Data - начало и конец выбранного периода
       */
      getRange: function(){
         if(this._options.dateRangeSelect){
            if(this._rangeStart && this._rangeEnd){
               return [this._rangeStart, this._rangeEnd];
            }
            return null;
         }else{
            return null;
         }
      },
      /**
       * Парс строки (dd.mm.yyyy) и (dd/mm/yyyy) в дату
       * @param {Date, String} str
       *  @param {String} s
       * @return {Date}
       */
      _parseToDate:function (str) {
         var dt,
             dateArr;
         if(str instanceof Date) {
            return str;
         }
         if (typeof str == 'string'){
            str = str.replace(/\./g, '/');
            dateArr = /(\d+)\/(\d+)\/(\d+)$|$/g.exec(str);
            //год, месяц - 1, день. остророжно - строки!
            dt = new Date(dateArr[3], dateArr[2] - 1, dateArr[1], 12);
            if(isNaN(+dt)) { // Не смогли разобрать что пришло
               dt = null;
            }
            return dt;
         } else {
            return null;
         }
      },
      /**
       * <wiTag group="Отображение">
       * Установить подсветку нужных дат.
       * Установить подсветку нужных дат - изменить внешний вид дат в календаре.
       * @param {Array} arr вида [ [ Date, css-class], [ Date, css-class ], ... ]
       * @example
       * <pre>
       *    calendar.setHighLight([ [new Date(2013, 1, 23), 'ws-bold'], [new Date(2013, 2, 8), 'colored-red'] ])
       * </pre>
       */
      setHighLight: function (arr) {
         this._arrayToObj(arr);
         $(this.idDiv).datepicker('setDate', $(this.idDiv).datepicker('getDate')); //перерисовка datepicker'a
      },
      /**
       * Отрисовка "Легенды"
       * <wiTag group="Отображение">
       * Установить легенду календаря. Может использоваться в качестве выведения дополнительной информации о каких-либо датах.
       * @example
       * <pre>
       *    calendar.setLegend({'someCssClassName': 'Выберите дату приема на работу'});
       * </pre>
       * @param {Object} legend - объект, хранит строку отображения и класс для отображения вида {'cssClass': 'str', ...}
       */
      setLegend: function(legend){
         $(this.idDiv).append(this._legendTplFn({
            'legend': legend
         }));
      },

      /**
       * @deprecated Будет удален в 3.7.0. Используйте {@link $ws.proto.FieldDatePicker#setEnabled}
       * Переключение флага, запрещающего смену даты
       * <wiTag group="Отображение">
       * @param {Boolean} forbidChangeDate - новое значение флага
       */
      setForbidChangeDate: function(forbidChangeDate) {
         this.setEnabled(!forbidChangeDate);
      },
      /**
       * Переключение флага, запрещающего смену даты
       * <wiTag group="Отображение">
       * @param {Boolean} enable - true, можно переключать дату, false - нельзя
       */
      setEnabled: function(enable){
         this._options.enabled = enable = !!enable;

         var self = this;
         this._defferedShowDatePicker.addCallback(function () {
            if (!enable) {
               $.datepicker._getInst(self._container[0]).self = self;
            }
            $.datepicker._selectDay = enable ? self._oldSelectDay : newSelectDay;
            self._container.toggleClass('ws-dp-readonly', !enable);
         });
      },
      /**
       *
       * @param {Array} arr вида [ [ Date, css-class], [ Date, css-class ], ... ]
       * создает Object вида obj[Date] = css-class;  Date вида Mon Jun 28 2012
       * @private
       */
      _arrayToObj : function (arr) {
         var o = {};
         for(var i = 0, j = arr.length ;i < j; i++) {
            o[arr[i][0].toDateString()] = arr[i][1];
         }
         this._objData = o;
      },
      /**
       * Установить дату
       * @param {Date} date
       * @example
       * Этот пример устанавливает текущую дату календаря на 12 декабря 1990 года
       * <pre>
       *    var calend = $ws.single.ControlStorage.getByName('calend');
       *    calend.setDate(new Date('12/12/1990'));
       * </pre>
       */
      setDate: function(date) {
         $(this.idDiv).datepicker('setDate', date);
      },
      /**
       * Получить текущую выбранную дату
       * @returns {Date} дата или null
       */
      getDate: function() {
         return $(this.idDiv).datepicker('getDate');
      }
   });

   return $ws.proto.FieldDatePicker;

});