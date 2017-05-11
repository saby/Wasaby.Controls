define('js!SBIS3.CONTROLS.TimePicker',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'tmpl!SBIS3.CONTROLS.TimePicker',
      'js!SBIS3.CONTROLS.TimePickerUtils',
      'js!SBIS3.CONTROLS.TimeHeader',
      'js!SBIS3.CONTROLS.TimePicker',
      'css!SBIS3.CONTROLS.TimePicker'
   ],
   function(CompoundControl, dotTplFn, Utils) {

      'use strict';

      /**
       * Контрол представляющий из себя шапку часов, и часы с быстрым выбором значения часов или минут.
       *
       * @class SBIS3.CONTROLS.TimePicker
       * @extend SBIS3.CONTROLS.CompoundControl
       *
       * @initial
       * Пример инициализации контрола.
       * Результат: TimePicker с выбором минут, стрелкой показывающей на 17, шапкой со временем 20:17
       * и подсвеченным временем 17. При смене представления на hours(см. {@link setActiveTime})
       * будет TimePicker с выбором часов, стрелкой показывающей на 20, и шапкой с подсвеченным временем 20.
       *
       * <ws:SBIS3.CONTROLS.TimePicker
       *    time="2017-10-20 20:17"
       *    activeTime="minutes"
       * />
       *
       * @control
       * @public
       * @author Крайнов Дмитрий Олегович
       */
      var TimePicker = CompoundControl.extend([Utils],/** @lends SBIS3.CONTROLS.TimePicker.prototype */{
         _dotTplFn: dotTplFn,

         /**
          * @event onChangeTime Происходит после смены положения стрелки и времени в шапке.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} time Текущее время.
          */

         /**
          * @event onChangeActiveTime Происходит после смены активного время.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} activeTime Текущее активное время.
          */

         $protected: {
            _options: {
               /**
                * @cfg {String|Date} Время.
                *
                * @example
                * Установить время 20:17.
                * <ol>
                *    <li>
                *       <ws:time>
                *          <ws:String>2017-10-20 20:17</ws:String>
                *       </ws:time>
                *    </li>
                *    <li>
                *       tmpl:
                *          <ws:time>{{myTime}}</ws:time>
                *       js:
                *          myTime = new Date("2017-10-20 20:17");
                *    </li>
                * </ol>
                *
                * @see getTime
                * @see setTime
                */
               time: new Date()
            }
         },

         init: function() {
            TimePicker.superclass.init.call(this);

            //Найдем внутренние контролы
            this._header = this.getChildControlByName('header');
            this._body = this.getChildControlByName('body');

            this._header.subscribe('onChangeTime', this._onChangeTimeHandler.bind(this));
            this._header.subscribe('onChangeActiveTime', this._onChangeActiveTimeHandler.bind(this));
            this._body.subscribe('onChangeTime', this._onChangeTimeHandler.bind(this));
            this._body.subscribe('onChangeActiveTime', this._onChangeActiveTimeHandler.bind(this));
         },

         /**
          * Изменить установленное время.
          * @param {Date} time новое время
          * @public
          */
         setTime: function(time) {
            this.getLinkedContext().setValueSelf('time', {
               hours: time.getHours(),
               minutes: time.getMinutes()
            });
            this._setUtilOption('time', time);
         },

         _modifyOptions: function(options) {
            TimePicker.superclass._modifyOptions.call(this, options);
            this.setTime(this.getTime());
            return options;
         },

         _onChangeTimeHandler: function(event, time) {
            this._options.time.setHours(time.hours);
            this._options.time.setMinutes(time.minutes);
            this._setUtilOption('time', this._options.time);
         },

         _onChangeActiveTimeHandler: function(event, activeTime) {
            this.setActiveTime(activeTime);
         }
      });

      return TimePicker;
   }
);