import cExtend = require('Core/core-simpleExtend');
import {ObservableMixin, VersionableMixin, DateTime} from 'Types/entity';
import dateRangeUtil = require('Controls/Utils/DateRangeUtil');
import DateUtil = require('Controls/Utils/Date');
import CalendarUtils from './Utils';

/**
 * Модель для контролов, предназначенных для ввода диапазона дат.
 * @author Красильников А.С.
 * @private
 */

/*
 * Model for date range controls.
 * @author Красильников А.С.
 * @public
 * @noShow
 */
var _private = {
   setStartValue: function(self, value) {
      const startValueResetTime = DateUtil.normalizeDate(self._startValue);
      if (DateUtil.isDatesEqual(startValueResetTime, value)) {
         return false;
      }
      self._startValue = value;
      self._nextVersion();
      return true;
   },
   setEndValue: function(self, value) {
      const endValueResetTime = DateUtil.normalizeDate(self._endValue);
      if (DateUtil.isDatesEqual(endValueResetTime, value)) {
         return false;
      }
      self._endValue = value;
      self._nextVersion();
      return true;
   },
   notifyRangeChanged: function(self, start: Date, end: Date): void {
      self._notify('rangeChanged', [start, end]);
   },
   createDate: function(self, date: Date): void {
      return new self._dateConstructor(date);
   }
};

var ModuleClass = cExtend.extend([ObservableMixin.prototype, VersionableMixin], {
   _startValue: null,
   _endValue: null,
   _options: null,
   _dateConstructor: DateTime,

   constructor: function(cfg) {
      ModuleClass.superclass.constructor.apply(this, arguments);
      if (cfg && cfg.dateConstructor) {
         this._dateConstructor = cfg.dateConstructor;
      }
   },

   update: function(options) {
      this._options = options;
      var changed = false;
      if (options.hasOwnProperty('startValue') && !DateUtil.isDatesEqual(options.startValue, this._startValue)) {
         this._startValue = options.startValue;
         changed = true;
      }
      if (options.hasOwnProperty('endValue') && !DateUtil.isDatesEqual(options.endValue, this._endValue)) {
         this._endValue = options.endValue;
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
         _private.notifyRangeChanged(this, value, this._endValue);
      }
   },

   get endValue() {
      return this._endValue;
   },

   set endValue(value) {
      if (_private.setEndValue(this, value)) {
         this._notify('endValueChanged', [value]);
         _private.notifyRangeChanged(this, this._startValue, value);
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
         _private.notifyRangeChanged(this, startValue, endValue);
      }
   },

   /**
    * If you select a period of several whole months, quarters, six months, or years,
    * then shift it for the same period forward.
    */
   _shiftRange(direction: number): void {
      let range = this._prepareRange();
      range = dateRangeUtil.shiftPeriod(range[0], range[1], direction);
      if (this._hasRanges()) {
         range = this._rangeSelected(range);
      }
      this.setRange(_private.createDate(this, range[0]), _private.createDate(this, range[1]));
   },

   shiftForward: function() {
      this._shiftRange(dateRangeUtil.SHIFT_DIRECTION.FORWARD);
   },

   /**
    * If a period of several whole months, quarters, six months, or years is selected,
    * it shifts it for the same period back.
    */
   shiftBack: function() {
      this._shiftRange(dateRangeUtil.SHIFT_DIRECTION.BACK);
   },

   _prepareRange(): Date[] {
      let range;
      if (this._hasRanges()) {
         //Если заданы кванты, то мы должны подстроить дату под них
         range = CalendarUtils.updateRangeByQuantum(this.startValue, this.startValue, this._options.ranges);
      } else {
         range = [this.startValue, this.endValue];
      }
      return range;
   },

   _hasRanges(): boolean {
      return this._options.selectionType === 'quantum' && this._options.ranges;
   },

   _rangeSelected(range: Date[]): Date[] {
      if (this._options.rangeSelectedCallback) {
         return this._options.rangeSelectedCallback(range[0], range[1]);
      }
      return range;
   }
});

ModuleClass._private = _private;

export default ModuleClass;
