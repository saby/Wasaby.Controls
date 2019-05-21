import Control = require('Core/Control');
import Env = require('Env/Env');
import coreMerge = require('Core/core-merge');
import CalendarControlsUtils = require('Controls/Calendar/Utils');
import Model = require('Controls/_input/DateTime/Model');
import IDateTimeMask = require('Controls/interface/IDateTimeMask');
import tmplNotify = require('Controls/Utils/tmplNotify');
import template = require('wml!Controls/_input/DateTime/DateTime');
   

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
 * @class Controls/_input/DateTime
 * @extends Core/Control
 * @mixes Controls/interface/IInputDateTime
 * @mixes Controls/interface/IDateTimeMask
 * @mixes Controls/interface/IInputTag
 * @mixes Controls/interface/IInputBase
 * @mixes Controls/interface/IInputPlaceholder
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

   _needInputCompletedEvent: false,

   _beforeMount: function(options) {
      this._model = new Model(options);
      CalendarControlsUtils.proxyModelEvents(this, this._model, ['valueChanged']);
   },

   _beforeUpdate: function(options) {
      if (options.value !== this._options.value) {
         this._model.update(options);
      }
   },

   _inputCompletedHandler: function(event, value, textValue) {
      event.stopImmediatePropagation();
      this._model.autocomplete(textValue, this._options.autocompleteType);
      this._needInputCompletedEvent = false;
      this._notify('inputCompleted', [this._model.value, textValue]);
   },

   _valueChangedHandler: function(e, value, textValue) {
      this._model.textValue = textValue;
      e.stopImmediatePropagation();
   },
   _onKeyDown: function(event) {
      var key = event.nativeEvent.keyCode;
      if (key === Env.constants.key.insert) {
      // on Insert button press current date should be inserted in field
         event.stopImmediatePropagation();
         this._model.setCurrentDate();
         this._needInputCompletedEvent = true;
      }
      if (key === Env.constants.key.plus || key === Env.constants.key.minus) {
      // on +/- buttons press date should be increased or decreased in field by one day
         event.stopImmediatePropagation();
         var delta = key === Env.constants.key.plus ? 1 : -1;
         var localDate = new Date(this._model.value);
         localDate.setDate(this._model.value.getDate() + delta);
         this._model.value = localDate;
      }
   },

   _onDeactivated: function(event) {
      if (this._needInputCompletedEvent) {
         this._needInputCompletedEvent = false;
         this._notify('inputCompleted', [this._model.value, this._model.textValue]);
      }
   },

   _beforeUnmount: function() {
      this._model.destroy();
   }
});

Component.getDefaultOptions = function() {
   return coreMerge({
      autocompleteType: 'default'
   }, IDateTimeMask.getDefaultOptions());
};

Component.getOptionTypes = function() {
   return coreMerge({}, IDateTimeMask.getOptionTypes());
};

export = Component;
