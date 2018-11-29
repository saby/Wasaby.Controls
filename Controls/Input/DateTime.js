define('Controls/Input/DateTime', [
   'Core/Control',
   'Core/core-merge',
   'Controls/Calendar/Utils',
   'Controls/Input/DateTime/Model',
   'Controls/Input/interface/IDateTimeMask',
   'Controls/Utils/tmplNotify',
   'wml!Controls/Input/DateTime/DateTime'
], function(
   Control,
   coreMerge,
   CalendarControlsUtils,
   Model,
   IDateTimeMask,
   tmplNotify,
   template
) {
   'use strict';

   /**
    * Control for entering date and time.
    * Depending on {@link mask mask} can be used to enter:
    * <ol>
    *    <li>just date,</li>
    *    <li>just time,</li>
    *    <li>date and time.</li>
    * </ol>
    * <a href="/materials/demo-ws4-input-datetime">Demo examples.</a>.
    *
    * @class Controls/Input/DateTime
    * @extends Core/Control
    * @mixes Controls/Input/interface/IInputBase
    * @mixes Controls/Input/interface/IInputText
    * @mixes Controls/Input/interface/IInputDateTime
    * @mixes Controls/Input/interface/IDateTimeMask
    * @mixes Controls/Input/interface/IValidation
    *
    * @control
    * @public
    * @demo Controls-demo/Input/DateTime/DateTimePG
    * @author Миронов А.Ю.
    * @category Input
    */

   var Component = Control.extend([], {
      _template: template,
      _proxyEvent: tmplNotify,

      _formatMaskChars: {
         'D': '[0-9]',
         'M': '[0-9]',
         'Y': '[0-9]',
         'H': '[0-9]',
         'm': '[0-9]',
         's': '[0-9]',
         'U': '[0-9]'
      },

      _model: null,

      _beforeMount: function(options) {
         this._model = new Model(options);
         CalendarControlsUtils.proxyModelEvents(this, this._model, ['valueChanged']);
      },

      _beforeUpdate: function(options) {
         this._model.update(options);
      },

      _inputCompletedHandler: function(event, value, textValue) {
         this._model.autocomplete(textValue);
         this._notify('inputCompleted', [this._model.value, textValue]);
      },

      _valueChangedHandler: function(e, value, textValue) {
         this._model.textValue = textValue;
         e.stopImmediatePropagation();
      },

      _beforeUnmount: function() {
         this._model.destroy();
      }
   });

   Component.getDefaultOptions = function() {
      return coreMerge({}, IDateTimeMask.getDefaultOptions());
   };

   Component.getOptionTypes = function() {
      return coreMerge({}, IDateTimeMask.getOptionTypes());
   };

   return Component;
});
