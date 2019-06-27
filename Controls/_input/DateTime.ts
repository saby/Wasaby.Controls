import Control = require('Core/Control');
import Env = require('Env/Env');
import coreMerge = require('Core/core-merge');
import Model = require('Controls/_input/DateTime/Model');
import IDateTimeMask = require('Controls/_input/interface/IDateTimeMask');
import tmplNotify = require('Controls/Utils/tmplNotify');
import template = require('wml!Controls/_input/DateTime/DateTime');

//TODO Копипаста из модуля Controls/_dateRange/Utils, чтобы убрать закчиливание библиотек.
// https://online.sbis.ru/opendoc.html?guid=33a2d809-9c38-4dd4-bb3a-054afbf49bcc
function proxyModelEvents(component, model, eventNames) {
   eventNames.forEach(function(eventName) {
      model.subscribe(eventName, function(event, value) {
         component._notify(eventName, value);
      });
   });
}

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
 * @mixes Controls/_input/interface/IDateTimeMask
 * @mixes Controls/interface/IInputTag
 * @mixes Controls/interface/IInputBase
 * @mixes Controls/interface/IInputPlaceholder
 *
 * @control
 * @public
 * @demo Controls-demo/Input/DateTime/DateTimePG
 * @author Красильников А.С.
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
      proxyModelEvents(this, this._model, ['valueChanged']);
   },

   _beforeUpdate: function(options) {
      if (options.value !== this._options.value) {
         this._model.update(options);
      }
   },

   _inputCompletedHandler: function(event, value, textValue) {
      event.stopImmediatePropagation();
      this._model.autocomplete(textValue, this._options.autocompleteType);
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
         this._model.setCurrentDate();
      }
      if (key === Env.constants.key.plus || key === Env.constants.key.minus) {
      // on +/- buttons press date should be increased or decreased in field by one day
         var delta = key === Env.constants.key.plus ? 1 : -1;
         var localDate = new Date(this._model.value);
         localDate.setDate(this._model.value.getDate() + delta);
         this._model.value = localDate;
      }
   }

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
