define('js!SBIS3.CONTROLS.TimeHeader',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'tmpl!SBIS3.CONTROLS.TimeHeader',
      'js!SBIS3.CONTROLS.TimePickerUtils',
      'js!SBIS3.CONTROLS.IconButton',
      'js!SBIS3.CORE.CloseButton',
      'css!SBIS3.CONTROLS.TimeHeader'
   ],
   function(CompoundControl, dotTplFn, Utils) {

      'use strict';

      /**
       * Шапка для {@link SBIS3.CONTROLS.TimePicker}.
       *
       * @class SBIS3.CONTROLS.TimeHeader
       * @extend SBIS3.CONTROLS.CompoundControl
       *
       * @initial
       * <ws:SBIS3.CONTROLS.TimeHeader>
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
       *    <ws:activeTime>
       *       <ws:String>minutes</ws:String>
       *    </ws:activeTime>
       * </ws:SBIS3.CONTROLS.TimeHeader>
       *
       * @control
       * @public
       * @author Крайнов Дмитрий Олегович
       */
      var TimeHeader = CompoundControl.extend([Utils],/** @lends SBIS3.CONTROLS.TimeHeader.prototype */{
         _dotTplFn: dotTplFn,

         init: function() {
            TimeHeader.superclass.init.call(this);

            //Инициализируем контекст
            this._setContextActive();
            this.getLinkedContext().setValueSelf('hours', this._getStringTime(this.getTime().hours));
            this.getLinkedContext().setValueSelf('minutes', this._getStringTime(this.getTime().minutes));

            //Найдем внутренние контролы
            this._homeButton = this.getChildControlByName('homeButton');

            this._homeButton.subscribe('onActivated', this._onHomeButtonActivatedHandler.bind(this));
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

            if (!Object.isEmpty(setTime)) {
               this._notify('onChangeTime', setTime);
               this._notifyOnPropertyChanged('time');
            }
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
            this._notifyOnPropertyChanged('activeTime');
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

            TimeHeader.superclass._onClickHandler.apply(this, arguments);

            if (~event.target.className.indexOf('js-controls-TimeHeader__hours')) {
               activeTime = 'hours';
            } else if (~event.target.className.indexOf('js-controls-TimeHeader__minutes')) {
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