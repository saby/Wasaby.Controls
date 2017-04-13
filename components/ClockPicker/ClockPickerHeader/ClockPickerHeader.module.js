define('js!SBIS3.CONTROLS.ClockPickerHeader',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'tmpl!SBIS3.CONTROLS.ClockPickerHeader',
      'js!SBIS3.CONTROLS.IconButton',
      'js!SBIS3.CORE.CloseButton'
   ],
   function(CompoundControl, dotTplFn) {

      'use strict';

      /**
       * Шапка ClockPicker.
       *
       * @class SBIS3.CONTROLS.ClockPickerHeader
       * @extend SBIS3.CONTROLS.CompoundControl
       *
       * @initial
       * <ol>
       *    <li>
       *       На dot.js:
       *       <component data-component="SBIS3.CONTROLS.ClockPickerHeader">
       *          <options name="time">
       *             <option name="hours" type="number">20</option>
       *             <option name="minutes" type="number">17</option>
       *          </options>
       *          <option name="activeTime">minutes</option>
       *       </component>
       *    </li>
       *    <li>
       *       На logicless:
       *       <ws:SBIS3.CONTROLS.ClockPickerHeader>
       *          <ws:time>
       *             <ws:Object>
       *                <ws:hours>
       *                   <ws:Number>20</ws:Number>
       *                </ws:hours>
       *                <ws:minutes>
       *                   <ws:Number>17</ws:Number>
       *                </ws:minutes>
       *             <ws:Object>
       *          </ws:time>
       *          <ws:activeTime>
       *             <ws:String>minutes</ws:String>
       *          </ws:activeTime>
       *       </ws:SBIS3.CONTROLS.ClockPickerHeader>
       *    </li>
       * </ol>
       *
       * @control
       * @public
       * @author Крайнов Дмитрий Олегович
       */
      var ClockPickerHeader = CompoundControl.extend(/** @lends SBIS3.CONTROLS.ClockPickerBody.prototype */{
         _dotTplFn: dotTplFn,

         /**
          * @event onChangeTime Происходит после смены времени.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} time Текущее время.
          */

         /**
          * @event onChangeActiveTime Происходит после смены активного времени.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} activeTime Текущее активное время.
          */

         /**
          * @event onClose Происходит при нажатии на кнопку закрыть.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          */

         $protected: {
            _options: {
               /**
                * @cfg {Object} Время.
                *
                * @example
                * Установить время 20:17.
                * <ol>
                *    <li>
                *       На dot.js:
                *       <pre>
                *          <options name="time">
                *             <option name="hours" type="number">20</option>
                *             <option name="minutes" type="number">17</option>
                *          </options>
                *       </pre>
                *    </li>
                *    <li>
                *       На logicless:
                *       <pre>
                *          <ws:time>
                *             <ws:Object>
                *                <ws:hours>
                *                   <ws:Number>20</ws:Number>
                *                </ws:hours>
                *                <ws:minutes>
                *                   <ws:Number>17</ws:Number>
                *                </ws:minutes>
                *             </ws:Object>
                *          </ws:time>
                *       </pre>
                *    </li>
                * </ol>
                *
                * @see getTime
                * @see setTime
                */
               time: {
                  hours: 0,
                  minutes: 0
               },

               /**
                * @cfg {String} Активное время.
                * <ol>
                *    <li>Часы: hours.</li>
                *    <li>Минуты: minutes.</li>
                * </ol>
                *
                * @example
                * Установить активное время minutes.
                * <ol>
                *    <li>
                *       На dot.js:
                *       <pre>
                *          <option name="activeTime">minutes</option>
                *       </pre>
                *    </li>
                *    <li>
                *       На logicless:
                *       <pre>
                *          <ws:activeTime>
                *             <ws:String>minutes</ws:String>
                *          </ws:activeTime>
                *       </pre>
                *    </li>
                * </ol>
                *
                * @see getActiveTime
                * @see setActiveTime
                */
               activeTime: 'hours'
            }
         },

         $constructor: function() {
            this._publish('onChangeTime', 'onChangeActiveTime', 'onHome', 'onClose');
         },

         init: function() {
            ClockPickerHeader.superclass.init.call(this);

            //Инициализируем контекст
            this._setContextActive();
            this.getLinkedContext().setValueSelf('hours', this._getStringTime(this.getTime().hours));
            this.getLinkedContext().setValueSelf('minutes', this._getStringTime(this.getTime().minutes));

            //Найдем внутренние контролы
            this._homeButton = this.getChildControlByName('homeButton');
            this._closeButton = this.getChildControlByName('closeButton');

            //Подпишимся на события внутренних контролов
            this._homeButton.subscribe('onActivated', this._onHomeButtonActivatedHandler.bind(this));
            this._closeButton.subscribe('onClick', this._onCloseButtonClickHandler.bind(this));
         },

         /**
          * Получить установленное время.
          * @returns {Object} установленное время.
          * @public
          */
         getTime: function() {
            return this._options.time;
         },

         /**
          * Изменить установленное время.
          * @param {Object} time новое время
          * @public
          */
         setTime: function(time) {
            var setTime = {};
            for (var system in this.getTime()) {
               if (!(system in time) || this.getTime()[system] === time[system]) {
                  continue;
               }
               this.getTime()[system] = time[system];
               setTime[system] = time[system];
               this.getLinkedContext().setValueSelf(system, this._getStringTime(this.getTime()[system]));
            }

            !Object.isEmpty(setTime) && this._notify('onChangeTime', setTime);
         },

         /**
          * Получить активное время.
          * @returns {String} активное время.
          * @public
          */
         getActiveTime: function() {
            return this._options.activeTime;
         },

         /**
          * Изменить активное время.
          * @param {String} activeTime новое активное время.
          */
         setActiveTime: function(activeTime) {
            if (this.getActiveTime() === activeTime) {
               return;
            }

            this._options.activeTime = activeTime;
            this._setContextActive();
            this._notify('onChangeActiveTime', this.getActiveTime());
         },

         /**
          * Изменение поля контекста отвечающего за активное время.
          * @private
          */
         _setContextActive: function() {
            var active = {
               hours: this.getActiveTime() === 'hours',
               minutes: this.getActiveTime() === 'minutes'
            };
            this.getLinkedContext().setValueSelf('active', active);
         },

         /**
          * Обработчик клика по контролу.
          * @param {$ws.proto.EventObject} event дескриптор события.
          * @private
          */
         _onClickHandler: function(event) {
            var activeTime;

            ClockPickerHeader.superclass._onClickHandler.apply(this, arguments);

            if (~event.target.className.indexOf('js-controls-ClockPickerHeader__hours')) {
               activeTime = 'hours';
            } else if (~event.target.className.indexOf('js-controls-ClockPickerHeader__minutes')) {
               activeTime = 'minutes';
            }
            activeTime && this.setActiveTime(activeTime);
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

            this._notify('onHome');
         },

         /**
          * Обработчик клика по кнопке закрыть.
          * @private
          */
         _onCloseButtonClickHandler: function() {
            this._notify('onClose');
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
            this._closeButton.unsubscribe('onClick', this._onCloseButtonClickHandler);

            ClockPickerHeader.superclass.destroy.call(this);
         }
      });

      return ClockPickerHeader;
   }
);