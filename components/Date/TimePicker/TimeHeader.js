define('SBIS3.CONTROLS/Date/TimePicker/TimeHeader',
   [
      'SBIS3.CONTROLS/CompoundControl',
      'tmpl!SBIS3.CONTROLS/Date/TimePicker/TimeHeader/TimeHeader',
      'SBIS3.CONTROLS/Date/TimePicker/TimePickerUtils',
      'SBIS3.CONTROLS/Button/IconButton',
      'css!SBIS3.CONTROLS/Date/TimePicker/TimeHeader/TimeHeader'
   ],
   function(CompoundControl, dotTplFn, Utils) {

      'use strict';

      /**
       * Шапка для {@link SBIS3.CONTROLS/Date/TimePicker}.
       *
       * @class SBIS3.CONTROLS/Date/TimePicker/TimeHeader
       * @extend SBIS3.CONTROLS/CompoundControl
       *
       * @initial
       * <SBIS3.CONTROLS.Date.TimePicker.TimeHeader>
       *    <ws:time>
       *       <ws:Object>
       *          <ws:hours>
       *             <ws:Number>20</ws:Number>
       *          </ws:hours>
       *          <ws:minutes>
       *             <ws:Number>17</ws:Number>
       *          </ws:minutes>
       *       <ws:Object>
       *    </ws:time>
       *    <ws:mode>
       *       <ws:String>minutes</ws:String>
       *    </ws:mode>
       * </SBIS3.CONTROLS.Date.TimePicker.TimeHeader>
       *
       * @control
       * @private
       * @author Крайнов Д.О.
       */
      var TimeHeader = CompoundControl.extend(/** @lends SBIS3.CONTROLS/Date/TimePicker/TimeHeader.prototype */{
         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
               /**
                * @cfg {Object} Время.
                *
                * @example
                * Установить время 20:17.
                * <pre>
                *    <ws:time>
                *       <ws:Object>
                *          <ws:hours>
                *             <ws:Number>20</ws:Number>
                *          </ws:hours>
                *          <ws:minutes>
                *             <ws:Number>17</ws:Number>
                *          </ws:minutes>
                *       </ws:Object>
                *    </ws:time>
                * </pre>
                *
                * @see getTime
                * @see setTime
                */
               time: {
                  hours: 0,
                  minutes: 0
               },
               /**
                * @cfg {String} Текущий режим.
                * <ol>
                *    <li>Часы: hours.</li>
                *    <li>Минуты: minutes.</li>
                * </ol>
                *
                * @example
                * Установить режим minutes.
                * <pre>
                *    <ws:mode>
                *       <ws:String>minutes</ws:String>
                *    </ws:mode>
                * </pre>
                *
                * @see getMode
                * @see setMode
                */
               mode: 'hours'
            }
         },

         /**
          * @event onChangeTime Происходит после смены времени.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} time Текущее время.
          */

         /**
          * @event onChangeMode Происходит после смены режима.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {String} mode Текущий режим.
          */
         $constructor: function() {
            this._publish('onChangeTime', 'onChangeMode');
         },

         init: function() {
            TimeHeader.superclass.init.call(this);

            //Инициализируем контекст
            this._isHoursMode = this._options.mode === 'hours';
            this._setContextMode();
            this._setContextTime();

            //Найдем внутренние контролы
            this._homeButton = this.getChildControlByName('homeButton');

            this._homeButton.subscribe('onActivated', this._onHomeButtonActivatedHandler.bind(this));
         },

         /**
          * Изменить режим
          * @param mode новый режим
          * @public
          */
         setMode: function(mode) {
            Utils.setMode.call(this, mode);
            this._isHoursMode = !this._isHoursMode;
            this._setContextMode(mode);
         },

         /**
          * Изменить установленное время.
          * @param {Object} time новое время
          * @public
          */
         setTime: function(time) {
            Utils.setTime.call(this, time);
            this._setContextTime();
         },

         /**
          * Изменение поля контекста отвечающего за режим.
          * @private
          */
         _setContextMode: function() {
            this.getLinkedContext().setValueSelf('active', {
               hours: this._isHoursMode,
               minutes: !this._isHoursMode
            });
         },

         /**
          * Изменение поля контекста отвечающего за время.
          * @private
          */
         _setContextTime: function() {
            var time = this._options.time;

            this.getLinkedContext().setValueSelf('time', {
               hours: this._getStringTime(time.hours),
               minutes: this._getStringTime(time.minutes)
            });
         },

         /**
          * Обработчик клика по контролу.
          * @param {$ws.proto.EventObject} event дескриптор события.
          * @private
          */
         _onClickHandler: function(event) {
            var mode;

            TimeHeader.superclass._onClickHandler.apply(this, arguments);

            mode = (/js-controls-TimeHeader__(hours|minutes) controls-TimeHeader__time_passive$/.exec(event.target.className) || [])[1];
            if (mode) {
               this.setMode(mode);
            }
         },

         /**
          * Обработчик клика по кнопке Home.
          * @private
          */
         _onHomeButtonActivatedHandler: function() {
            var date = new Date();

            this.setTime({
               hours: date.getHours(),
               minutes: date.getMinutes()
            });
         },

         /**
          * Вернуть строковое представление времени
          * @param time время
          * @returns {string} время в формате строки
          * @private
          */
         _getStringTime: function(time) {
            return time < 10 ? '0' + time : '' + time;
         },

         destroy: function() {
            this._homeButton.unsubscribe('onActivated', this._onHomeButtonActivatedHandler);

            TimeHeader.superclass.destroy.call(this);
         }
      });

      return TimeHeader;
   }
);