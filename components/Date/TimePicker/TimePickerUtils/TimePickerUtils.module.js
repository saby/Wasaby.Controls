define('js!SBIS3.CONTROLS.TimePickerUtils',
   [
      'Core/helpers/String/ucFirst'
   ],
   function(ucFirst) {

      'use strict';

      var TimePickerUtils = {
         /**
          * @event onChangeTime Происходит после смены времени.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Date} time Текущее время.
          */

         /**
          * @event onChangeMode Происходит после смены активного времени.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {String} mode Текущее активное время.
          */

         /**
          * @event onTimeSelect Происходит при окончании выбора времени.
          * @remark
          * Окончанием выбора времени является окончание работы со стрелкой выбора времени.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Date|Object} time Время, которое установили.
          */

         /**
          * Изменить время.
          * @param {Object} time новое время.
          * @public
          */
         setTime: function(time) {
            TimePickerUtils._setUtilOption.call(this, 'time', time);
         },

         /**
          * Изменить режим.
          * @param {String} mode новый режим.
          * @public
          */
         setMode: function(mode) {
            TimePickerUtils._setUtilOption.call(this, 'mode', mode);
         },

         _setUtilOption: function(name, value, silent) {
            this._setOption(name, value, silent);
            this._notify('onChange' + ucFirst.call(name), value);
            this._notifyOnPropertyChanged(name);
         },

         _notifyTimeSelect: function() {
            this._notify('onTimeSelect');
         }
      };

      return TimePickerUtils;
   }
);