define('Controls/Input/Base/ViewModel',
   [
      'Core/core-merge',
      'Core/core-clone',
      'Core/core-simpleExtend',
      'Core/helpers/Object/isEqual'
   ],
   function(merge, clone, simpleExtend, isEqual) {
      'use strict';

      var _private = {
         setValue: function(self, value) {
            if (self._value !== value) {
               self._value = value;

               self._shouldBeChanged = true;
            }
         },
         setDisplayValue: function(self, displayValue) {
            if (self._displayValue !== displayValue) {
               self._displayValue = displayValue;
               self.selection = displayValue.length;

               self._shouldBeChanged = true;
            }
         }
      };

      var ViewModel = simpleExtend.extend({
         _convertToValue: function(displayValue) {
            return displayValue;
         },

         _convertToDisplayValue: function(value) {
            return value;
         },

         get shouldBeChanged() {
            return this._shouldBeChanged;
         },

         get oldValue() {
            return this._oldValue;
         },

         get oldDisplayValue() {
            return this._oldDisplayValue;
         },

         get oldSelection() {
            return clone(this._oldSelection);
         },

         get value() {
            return this._value;
         },

         set value(value) {
            if (this._value !== value) {
               _private.setValue(this, value);
               _private.setDisplayValue(this, this._convertToDisplayValue(value));
            }
         },

         get displayValue() {
            return this._displayValue;
         },

         set displayValue(value) {
            if (this._displayValue !== value) {
               _private.setValue(this, this._convertToValue(value));
               _private.setDisplayValue(this, value);
            }
         },

         get selection() {
            return clone(this._selection);
         },

         /**
          * @param {Controls/Input/Base/Types/Selection.typedef|Number} value
          */
         set selection(value) {
            var newSelection = typeof value === 'number' ? {
               start: value,
               end: value
            } : value;

            if (!isEqual(this._selection, newSelection)) {
               merge(this._selection, newSelection);
               this._shouldBeChanged = true;
            }
         },

         get options() {
            return clone(this._options);
         },

         set options(value) {
            this._options = clone(value);
         },

         constructor: function(options, value) {
            this._options = {};
            this._selection = {};
            this._oldSelection = {};

            this.value = value;
            this.options = options;

            this.changesHaveBeenApplied();
         },

         handleInput: function(splitValue) {
            var position = splitValue.before.length + splitValue.insert.length;
            var displayValue = splitValue.before + splitValue.insert + splitValue.after;
            var hasChangedDisplayValue = this._displayValue !== displayValue;

            this._displayValue = displayValue;
            this._value = this._convertToValue(displayValue);
            this._selection.start = position;
            this._selection.end = position;

            this._shouldBeChanged = true;

            return hasChangedDisplayValue;
         },

         changesHaveBeenApplied: function() {
            this._oldValue = this._value;
            this._oldDisplayValue = this._displayValue;
            this._oldSelection = clone(this._selection);

            this._shouldBeChanged = false;
         },

         select: function() {
            this.selection = {
               start: 0,
               end: this.displayValue.length
            };

            this._shouldBeChanged = true;
         }
      });

      return ViewModel;
   });
