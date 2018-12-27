define('Controls/Date/model/DateRange', [
   'Core/core-simpleExtend',
   'WS.Data/Entity/ObservableMixin',
   'WS.Data/Entity/VersionableMixin',
   'Controls/Utils/DateRangeUtil',
   'Controls/Utils/Date'
], function(
   cExtend,
   ObservableMixin,
   VersionableMixin,
   dateRangeUtil,
   DateUtil
) {
   /**
    * Model for date range controls.
    * @author Александр Миронов
    * @public
    * @noShow
    */
   var _private = {
      setStartValue: function(self, value) {
         if (DateUtil.isDatesEqual(self._startValue, value)) {
            return false;
         }
         self._startValue = value;
         self._nextVersion();
         return true;
      },
      setEndValue: function(self, value) {
         if (DateUtil.isDatesEqual(self._endValue, value)) {
            return false;
         }
         self._endValue = value;
         self._nextVersion();
         return true;
      }
   };

   var ModuleClass = cExtend.extend([ObservableMixin, VersionableMixin], {
      _startValue: null,
      _endValue: null,
      _state: null,

      constructor: function() {
         ModuleClass.superclass.constructor.apply(this, arguments);
         this._state = {};
      },

      update: function(options) {
         var changed = false;
         if (!DateUtil.isDatesEqual(options.startValue, this._state.startValue)) {
            this._startValue = options.startValue;
            this._state.startValue = options.startValue;
            changed = true;
         }
         if (!DateUtil.isDatesEqual(options.endValue, this._state.endValue)) {
            this._endValue = options.endValue;
            this._state.endValue = options.endValue;
            changed = true;
         }
         return changed;
      },

      get startValue() {
         return this._startValue;
      },

      set startValue(value) {
         if (_private.setStartValue(this, value)) {
            this._notify('startValueChanged', [value]);
            this._notify('rangeChanged', [value]);
         }
      },

      get endValue() {
         return this._endValue;
      },

      set endValue(value) {
         if (_private.setEndValue(this, value)) {
            this._notify('endValueChanged', [value]);
            this._notify('rangeChanged', [value]);
         }
      },

      setRange: function(startValue, endValue) {
         var changed = false;
         if (_private.setStartValue(this, startValue)) {
            this._notify('startValueChanged', [startValue]);
            changed = true;
         }
         if (_private.setEndValue(this, endValue)) {
            this._notify('endValueChanged', [endValue]);
            changed = true;
         }
         if (changed) {
            this._notify('rangeChanged', [startValue, endValue]);
         }
      },

      /**
       * If you select a period of several whole months, quarters, six months, or years,
       * then shift it for the same period forward.
       */
      shiftForward: function() {
         var range = dateRangeUtil.shiftPeriod(this.startValue, this.endValue, dateRangeUtil.SHIFT_DIRECTION.FORWARD);
         this.setRange(range[0], range[1]);
      },

      /**
       * If a period of several whole months, quarters, six months, or years is selected,
       * it shifts it for the same period back.
       */
      shiftBack: function() {
         var range = dateRangeUtil.shiftPeriod(this.startValue, this.endValue, dateRangeUtil.SHIFT_DIRECTION.BACK);
         this.setRange(range[0], range[1]);
      }
   });

   ModuleClass._private = _private;
   return ModuleClass;
});
