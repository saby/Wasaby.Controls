import merge = require('Core/core-merge');
import clone = require('Core/core-clone');
import simpleExtend = require('Core/core-simpleExtend');
import { VersionableMixin } from "Types/entity";
import {isEqual} from 'Types/object';


      var _private = {
         setValue: function(self, value) {
            if (self._value !== value) {
               var oldValue = self._value;
               self._value = value;

               // если ничего не поменялось - не надо изменять версию
               if (oldValue !== value) {
                  self._nextVersion();
               }

               self._shouldBeChanged = true;
            }
         },
         setDisplayValue: function(self, displayValue) {
            if (self._displayValue !== displayValue) {
               var oldValue = self._displayValue;
               self._displayValue = displayValue;
               self.selection = self._getStartingPosition();

               // если ничего не поменялось - не надо изменять версию
               if (oldValue !== displayValue) {
                  self._nextVersion();
               }

               self._shouldBeChanged = true;
            }
         }
      };

      var ViewModel = simpleExtend.extend([VersionableMixin], {
         _convertToValue: function(displayValue) {
            return displayValue;
         },

         _convertToDisplayValue: function(value) {
            return value === null ? '' : value;
         },

         _getStartingPosition: function () {
            return this.displayValue.length;
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
          * @param {Controls/_input/Base/Types/Selection.typedef|Number} value
          */
         set selection(value) {
            var newSelection = typeof value === 'number' ? {
               start: value,
               end: value
            } : value;

            if (!isEqual(this._selection, newSelection)) {
               merge(this._selection, newSelection);
               this._nextVersion();
               this._shouldBeChanged = true;
            }
         },

         get options() {
            return clone(this._options);
         },

         set options(value) {
            this._options = clone(value);
            _private.setDisplayValue(this, this._convertToDisplayValue(this._value));
         },

         constructor: function(options, value) {
            this._selection = {};
            this._oldSelection = {};
            this._options = clone(options);

            this.value = value;

            this.changesHaveBeenApplied();
         },

         handleInput: function(splitValue) {
            var position = splitValue.before.length + splitValue.insert.length;
            var displayValue = splitValue.before + splitValue.insert + splitValue.after;
            var hasChangedDisplayValue = this._displayValue !== displayValue;

            this._value = this._convertToValue(displayValue);
            this._displayValue = displayValue;

            // здесь нельзя добавлять проверку, иначе нельзя будет поставить точку в тексте. например Number.js пишем 123.456, вот когда будем писать точку, число при этом не изменилось, но _nextVersion звать надо..
            this._nextVersion();

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

            this._nextVersion();
            this._shouldBeChanged = true;
         },

         isValueChanged: function(oldDisplayValue: string, oldValue?: string) {
            return oldDisplayValue !== this._displayValue;
         }
      });

      export = ViewModel;

