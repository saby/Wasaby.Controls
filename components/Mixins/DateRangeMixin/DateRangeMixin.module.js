define('js!SBIS3.CONTROLS.DateRangeMixin', [
   'js!SBIS3.CONTROLS.Utils.DateUtil'
], function (DateUtil) {
   /**
    * Миксин, добавляющий поведение хранения начального и конечного значений диапазона типа Date.
    * Используется только совместно с SBIS3.CONTROLS.DateRange.
    * @mixin SBIS3.CONTROLS.DateRangeMixin
    * @public
    * @author Миронов Александр Юрьевич
    */

   var DateRangeMixin = /**@lends SBIS3.CONTROLS.DateRangeMixin.prototype  */{
      $protected: {
      },

      $constructor: function() {
         if(!$ws.helpers.instanceOfMixin(this, 'SBIS3.CONTROLS.RangeMixin')) {
            throw new Error('RangeMixin mixin is required');
         }
         this._options.startValue = this._normalizeDate(this._options.startValue);
         this._options.endValue = this._normalizeDate(this._options.endValue);
      },

      around : {
         setStartValue: function (parentFnc, value, silent) {
            value = this._normalizeDate(value);
            return parentFnc.call(this, value, silent);
         }
         ,

         setEndValue: function (parentFnc, value, silent) {
            value = this._normalizeDate(value);
            return parentFnc.call(this, value, silent);
         }
      },

      _normalizeDate: function(date) {
         date = DateUtil.valueToDate(date);
         if (!date) {
            date = null;
         }
         return date;
      }
   };

   return DateRangeMixin;
});
