define('Controls/Date/model/DateRange', [
   'Core/core-simpleExtend',
   'Core/helpers/Function/runDelayed',
   'WS.Data/Entity/ObservableMixin',
   'WS.Data/Entity/VersionableMixin',
   'Controls/Utils/DateRangeUtil',
   'Controls/Utils/Date'
], function(
   cExtend,
   runDelayed,
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
   var ModuleClass = cExtend.extend([ObservableMixin, VersionableMixin], {
      _startValue: null,
      _endValue: null,
      _state: null,
      _rangeChanged: false,

      constructor: function() {
         ModuleClass.superclass.constructor.apply(this, arguments);
         this._state = {};
      },

      update: function(options) {
         var changed = false;
         if (!DateUtil.isDatesEqual(options.startValue, this._state.startValue)) {
            this._startValue = options.startValue;
            this._state.startValue = options.startValue;
            this._notifyRangeChanged();
            changed = true;
         }
         if (!DateUtil.isDatesEqual(options.endValue, this._state.endValue)) {
            this._endValue = options.endValue;
            this._state.endValue = options.endValue;
            this._notifyRangeChanged();
            changed = true;
         }
         return changed;
      },

      get startValue() {
         return this._startValue;
      },

      set startValue(value) {
         if (DateUtil.isDatesEqual(this._startValue, value)) {
            return;
         }
         this._startValue = value;
         this._nextVersion();
         this._notify('startValueChanged', [value]);
         this._notifyRangeChanged();
      },

      get endValue() {
         return this._endValue;
      },

      set endValue(value) {
         if (DateUtil.isDatesEqual(this._endValue, value)) {
            return;
         }
         this._endValue = value;
         this._nextVersion();
         this._notify('endValueChanged', [value]);
         this._notifyRangeChanged();
      },

      /**
         * Notification about rangeChanged event. runDelayed for waiting both events:
         * startValueChanged and endValueChanged.
      */

      _notifyRangeChanged: function(value) {
         if (this._rangeChanged) {
            return;
         }
         this._rangeChanged = true;
         runDelayed(function() {
            this._rangeChanged = false;
            this._notify('rangeChanged', [this.startValue, this.endValue]);
         }.bind(this));
      },

      /**
       * If you select a period of several whole months, quarters, six months, or years,
       * then shift it for the same period forward.
       */
      shiftForward: function() {
         var range = dateRangeUtil.shiftPeriod(this.startValue, this.endValue, dateRangeUtil.SHIFT_DIRECTION.FORWARD);
         this.startValue = range[0];
         this.endValue = range[1];
      },

      /**
       * If a period of several whole months, quarters, six months, or years is selected,
       * it shifts it for the same period back.
       */
      shiftBack: function() {
         var range = dateRangeUtil.shiftPeriod(this.startValue, this.endValue, dateRangeUtil.SHIFT_DIRECTION.BACK);
         this.startValue = range[0];
         this.endValue = range[1];
      }
   });

   return ModuleClass;
});
