define('js!SBIS3.CONTROLS.TimePickerUtils',
   [
      'Core/core-functions',
      'Core/helpers/String/ucFirst'
   ],
   function(coreFunctions, ucFirst) {

      'use strict';

      var TimePickerUtils = {
         /**
          * @event onChangeTime Происходит после смены времени.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Date} time Текущее время.
          */

         /**
          * @event onChangeActiveTime Происходит после смены активного времени.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} activeTime Текущее активное время.
          */
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
                * @cfg {String} Активное время.
                * <ol>
                *    <li>Часы: hours.</li>
                *    <li>Минуты: minutes.</li>
                * </ol>
                *
                * @example
                * Установить активное время minutes.
                * <pre>
                *    <ws:activeTime>
                *       <ws:String>minutes</ws:String>
                *    </ws:activeTime>
                * </pre>
                *
                * @see getActiveTime
                * @see setActiveTime
                */
               activeTime: 'hours'
            }
         },

         $constructor: function() {
            this._publish('onChangeTime', 'onChangeActiveTime');
         },

         /**
          * Получить положение стрелки.
          * @returns {Object} положение стрелки в разных представлениях.
          * @public
          */
         getTime: function() {
            return this._getOption('time');
         },

         /**
          * Изменить время.
          * @param {Object} time новое время.
          * @returns {Array<Boolean>} изменилось ли активное время.
          * @public
          */
         setTime: function(time) {
            var
               setTime = coreFunctions.clone(this.getTime()),
               //isSet - изменилось ли время, isSetView - изменилось ли время на активном представлении.
               isSet, isSetActiveTime, system;

            for (system in setTime) {
               if (!(system in time) || this.getTime()[system] === time[system]) {
                  continue;
               }
               setTime[system] = time[system];
               isSet = true;
               if (!isSetActiveTime) {
                  isSetActiveTime = this.getActiveTime() === system;
               }
            }

            //Проверим изменилось ли время.
            if (isSet) {
               this._setUtilOption('time', setTime);
            }
            return {
               isSet: isSet,
               isSetActiveTime: isSetActiveTime
            };
         },

         /**
          * Получить активное время.
          * @returns {String} активное время.
          * @public
          */
         getActiveTime: function() {
            return this._getOption('activeTime');
         },

         /**
          * Изменить активное время.
          * @param {String} activeTime новое активное время.
          * @returns {Boolean} изменилось ли активное время.
          * @public
          */
         setActiveTime: function(activeTime) {
            //Проверим можем ли мы установить новое представление или не совподает ли оно с текущим.
            if (this.getActiveTime() === activeTime || !(activeTime === 'hours' || activeTime === 'minutes')) {
               return false;
            }
            this._setUtilOption('activeTime', activeTime);
            return true;
         },

         _setUtilOption: function(name, value, silent) {
            this._setOption(name, value, silent);
            this._notify('onChange' + ucFirst.call(name), value);
            this._notifyOnPropertyChanged(name);
         }
      };

      return TimePickerUtils;
   }
);