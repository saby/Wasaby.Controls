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
                     this._shouldBeChanged = true;
                  }
                  break;
               case 'object':
                  if (this._selection.start !== value.start || this._selection.end !== value.end) {
                     this._selection.start = value.start;
                     this._selection.end = value.end;
                     this._shouldBeChanged = true;
                  }
                  break;
            }
         },

         constructor: function(options) {
            this._value = '';
            this._selection = {
               start: 0,
               end: 0
            };
            this.options = options;
            this._shouldBeChanged = true;
         },

         handleInput: function(splitValue) {
            var position = splitValue.before.length + splitValue.insert.length;

            this._selection.start = position;
            this._selection.end = position;
            this._value = splitValue.before + splitValue.insert + splitValue.after;

            this._shouldBeChanged = true;

            return true;
         },

         changesHaveBeenApplied: function() {
            this._shouldBeChanged = false;
         }
      });

      return ViewModel;
   }
);
