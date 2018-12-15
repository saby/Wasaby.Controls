define('Controls/Input/DateTime/Model', [
   'Core/core-simpleExtend',
   'WS.Data/Entity/ObservableMixin',
   'WS.Data/Entity/VersionableMixin',
   'Controls/Input/DateTime/StringValueConverter',
   'Controls/Utils/Date'
], function(
   cExtend,
   ObservableMixin,
   VersionableMixin,
   StringValueConverter,
   dateUtils
) {
   'use strict';

   /**
    * Model for 'Controls/Input/DateTime' control.
    * @author Александр Миронов
    * @public
    * @noShow
    */

   var _private = {
      updateLastValue: function(self) {
         if (dateUtils.isValidDate(self._value)) {
            self._lastValue = self._value;
         }
      },
      updateValue: function(self, value) {
         self._nextVersion();
         self._value = value;
         _private.updateLastValue(self);
         self._textValue = self._stringValueConverter.getStringByValue(value);
      }
   };

   var ModuleClass = cExtend.extend([ObservableMixin, VersionableMixin], {
      _textValue: null,
      _value: null,
      _lastValue: null,
      _stringValueConverter: null,
      _mask: null,
      _replacer: ' ',

      constructor: function(options) {
         ModuleClass.superclass.constructor.apply(this, arguments);
         this._stringValueConverter = new StringValueConverter();
         this._stringValueConverter.update({
            replacer: this._replacer,
            mask: options.mask
         });
         this._mask = options.mask;
         this._value = options.value;
         this._lastValue = this._value;
         this._textValue = this._stringValueConverter.getStringByValue(options.value);
      },

      /**
       * Updates model fields.
       * @param options
       */
      update: function(options) {
         this._stringValueConverter.update({
            replacer: this._replacer,
            mask: options.mask
         });
         if (this._mask !== options.mask || !dateUtils.isDatesEqual(this._value, options.value)) {
            this._mask = options.mask;
            _private.updateValue(this, options.value);
         }
      },

      /**
       * Value as a Date object
       * @returns {Date}
       */
      get value() {
         return this._value;
      },

      set value(value) {
         if (dateUtils.isDatesEqual(this._value, value)) {
            return;
         }
         _private.updateValue(this, value);
         this._notify('valueChanged', [value, this._textValue]);
      },

      /**
       * Value as a string.
       * @returns {String}
       */
      get textValue() {
         return this._textValue;
      },

      set textValue(value) {
         var newValue;
         if (this._textValue === value) {
            return;
         }
         this._nextVersion();
         this._textValue = value;
         newValue = this._stringValueConverter.getValueByString(value, this._lastValue);
         if (!dateUtils.isDatesEqual(this._value, newValue)) {
            this._value = newValue;
            _private.updateLastValue(this);
            this._notify('valueChanged', [this._value, this._textValue]);
         }
      },

      /**
       * Value as a string without delimiters.
       * @returns {String}
       */
      get clearTextValue() {
         return this._textValue.replace(/[ -.:]/g, '');
      },

      /**
       * Autocomplete not full text value.
       * @param textValue
       */
      autocomplete: function(textValue) {
         this._nextVersion();
         this._textValue = textValue;
         this.value = this._stringValueConverter.getValueByString(textValue, this._lastValue, true);
      },
      setCurrentDate: function() {
         this.value = this._stringValueConverter.getCurrentDate(this._lastValue, this._mask);
      }

   });

   return ModuleClass;
});
