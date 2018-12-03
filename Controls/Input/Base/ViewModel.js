define('Controls/Input/Base/ViewModel',
   [
      'Core/core-clone',
      'Core/core-simpleExtend'
   ],
   function(clone, simpleExtend) {
      'use strict';

      var ViewModel = simpleExtend.extend({
         get shouldBeChanged() {
            return this._shouldBeChanged;
         },

         get oldValue() {
            return this._oldValue;
         },

         get oldDisplayValue() {
            return this.oldValue;
         },

         get oldSelection() {
            return clone(this._oldSelection);
         },

         get value() {
            return this._value;
         },

         set value(value) {
            if (this._value !== value) {
               this._value = value;
               this._selection.start = value.length;
               this._selection.end = value.length;
               this._shouldBeChanged = true;
            }
         },

         get displayValue() {
            return this.value;
         },

         set displayValue(value) {
            this.value = value;
         },

         get selection() {
            return clone(this._selection);
         },

         set selection(value) {
            switch (typeof value) {
               case 'number':
                  if (this._selection.start !== value) {
                     this._selection.start = value;
                     this._selection.end = value;
                     this._oldSelection.start = value;
                     this._oldSelection.end = value;
                     this._shouldBeChanged = true;
                  }
                  break;
               case 'object':
                  if (this._selection.start !== value.start || this._selection.end !== value.end) {
                     this._selection.start = value.start;
                     this._selection.end = value.end;
                     this._oldSelection.start = value.start;
                     this._oldSelection.end = value.end;
                     this._shouldBeChanged = true;
                  }
                  break;
            }
         },

         constructor: function(options, value) {
            var selection = {
               start: value.length,
               end: value.length
            };

            this._value = value;
            this._oldValue = value;
            this._selection = clone(selection);
            this._oldSelection = clone(selection);
            this.options = clone(options);
            this._shouldBeChanged = true;
         },

         handleInput: function(splitValue) {
            var position = splitValue.before.length + splitValue.insert.length;
            var value = splitValue.before + splitValue.insert + splitValue.after;
            var hasChangedValue = this._value !== value;

            this._value = value;
            this._selection.start = position;
            this._selection.end = position;

            this._shouldBeChanged = true;

            return hasChangedValue;
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
