import Control = require('Core/Control');
import coreMerge = require('Core/core-merge');
import StringValueConverter = require('Controls/_input/DateTime/StringValueConverter');
import IDateTimeMask = require('Controls/interface/IDateTimeMask');
import tmplNotify = require('Controls/Utils/tmplNotify');
import template = require('wml!Controls/_input/Date/Picker/Picker');
import 'css!theme?Controls/_input/Date/Picker/Picker';

   /**
    * Control for entering date. Also, the control allows you to select a date with the mouse using the drop-down box.
    * <a href="/materials/demo-ws4-input-datepicker">Demo examples.</a>.
    *
    * @class Controls/_input/Date/Picker
    * @extends Core/Control
    * @mixes Controls/interface/IInputDateTime
    * @mixes Controls/interface/IDateMask
    * @mixes Controls/interface/IInputTag
    * @mixes Controls/interface/IInputBase
    * @mixes Controls/interface/IInputPlaceholder
    *
    * @css @spacing_DatePicker-between-input-button Spacing between input field and button.
    *
    * @control
    * @public
    * @demo Controls-demo/Input/Date/PickerPG
    * @category Input
    * @author Миронов А.Ю.
    */

   var Component = Control.extend([], {
      _template: template,
      _proxyEvent: tmplNotify,

      // _beforeMount: function(options) {
      // },
      //
      // _beforeUpdate: function(options) {
      // },
      //
      // _beforeUnmount: function() {
      // },

      _openDialog: function(event) {
         this._children.opener.open({
            opener: this,
            target: this._container,
            className: 'controls-PeriodDialog__picker-withoutModeBtn',
            isCompoundTemplate: true,
            horizontalAlign: { side: 'right' },
            corner: { horizontal: 'left' },
            eventHandlers: {
               onResult: this._onResult.bind(this)
            },
            templateOptions: {
               startValue: this._options.value,
               endValue: this._options.value,
               mask: this._options.mask,
               selectionType: 'single',
               headerType: 'input',
               closeButtonEnabled: true,
               handlers: {
                  onChoose: this._onResultWS3.bind(this)
               }
            }
         });
      },

      _onResultWS3: function(event, startValue) {
         this._onResult(startValue);
      },

      _onResult: function(startValue) {
         var
            stringValueConverter = new StringValueConverter({
               mask: this._options.mask,
               replacer: this._options.replacer
            }),
            textValue = stringValueConverter.getStringByValue(startValue);
         this._notify('valueChanged', [startValue, textValue]);
         this._children.opener.close();
         this._notify('inputCompleted', [startValue, textValue]);
      },
   });

   Component.getDefaultOptions = function() {
      return coreMerge({}, IDateTimeMask.getDefaultOptions());
   };

   Component.getOptionTypes = function() {
      return coreMerge({}, IDateTimeMask.getOptionTypes());
   };

   export = Component;


