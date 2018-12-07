define('Controls/Input/Date/Picker', [
   'Core/Control',
   'Core/core-merge',
   'Controls/Input/interface/IDateTimeMask',
   'Controls/Utils/tmplNotify',
   'wml!Controls/Input/Date/Picker/Picker',
   'css!theme?Controls/Input/Date/Picker/Picker'
], function(
   Control,
   coreMerge,
   IDateTimeMask,
   tmplNotify,
   template
) {

   /**
    * Control for entering date. Also, the control allows you to select a date with the mouse using the drop-down box.
    * <a href="/materials/demo-ws4-input-datepicker">Demo examples.</a>.
    *
    * @class Controls/Input/Date/Picker
    * @extends Core/Control
    * @mixes Controls/Input/interface/IInputBase
    * @mixes Controls/Input/interface/IInputText
    * @mixes Controls/Input/interface/IInputDateTime
    * @mixes Controls/Input/interface/IDateMask
    * @mixes Controls/Input/interface/IValidation
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
         this._notify('valueChanged', [startValue]);
         this._children.opener.close();
         this._forceUpdate();
      },
   });

   Component.getDefaultOptions = function() {
      return coreMerge({}, IDateTimeMask.getDefaultOptions());
   };

   Component.getOptionTypes = function() {
      return coreMerge({}, IDateTimeMask.getOptionTypes());
   };

   return Component;

});
