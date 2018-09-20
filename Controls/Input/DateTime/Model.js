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

   /**
    * Model for 'Controls/Input/DateTime' control.
    * @author Александр Миронов
    * @public
    * @noShow
    */
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
         this._stringValueConverter.update(options);
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
         this._stringValueConverter.update(options);
         this.value = options.value;
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
         this._nextVersion();
         this._value = value;
         if (value) {
            this._lastValue = value;
         }
         this._notify('valueChanged', [value]);
      },

      /**
       * Value as a string.
       * @returns {String}
       */
      get textValue() {
         return this._textValue;
      },

      set textValue(value) {
         if (this._textValue === value) {
            return;
         }
         this._nextVersion();
         this._textValue = value;
         this.value = this._stringValueConverter.getValueByString(value, this._lastValue);
      },

      /**
       * Autocomplete not full text value.
       * @param textValue
       */
      autocomplete: function(textValue) {
         this._nextVersion();
         this._textValue = textValue;
         this.value = this._stringValueConverter.getValueByString(textValue, this._lastValue, true);
      }

   });

   return ModuleClass;
});
