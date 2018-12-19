define('Controls/Input/DateTime', [
   'Core/Control',
   'Core/constants',
   'Core/core-merge',
   'Controls/Calendar/Utils',
   'Controls/Input/DateTime/Model',
   'Controls/Input/interface/IDateTimeMask',
   'Controls/Utils/tmplNotify',
   'wml!Controls/Input/DateTime/DateTime'
], function(
   Control,
   CoreConstants,
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
    * @mixes Controls/Input/interface/IInputTag
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

      _inputCompletedHandler: function(event, value) {
         this._model.autocomplete(value);
         this._notify('inputCompleted', [this._model.value]);
      },

      _valueChangedHandler: function(e, value) {
         this._model.textValue = value;
         e.stopImmediatePropagation();
      },
      _onKeyDown: function(event) {
         if (event.nativeEvent.keyCode === CoreConstants.key.insert) {
         // on Insert button press current date should be inserted in field
            this._model.setCurrentDate();
         }
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
