define('Controls/Input/Date/Picker', [
   'Core/Control',
   'Core/core-merge',
   'Controls/Calendar/Utils',
   'Controls/Input/DateTime/Model',
   'Controls/Input/interface/IDateTimeMask',
   'Controls/Utils/tmplNotify',
   'wml!Controls/Input/Date/Picker/Picker',
   'css!Controls/Input/Date/Picker/Picker'
], function(
   Control,
   coreMerge,
   CalendarControlsUtils,
   Model,
   IDateTimeMask,
   tmplNotify,
   template
) {

   /**
    * Control for entering date.
    * @class Controls/Input/Date/Picker
    * @mixes Controls/Input/interface/IInputText
    * @mixes Controls/Input/interface/IInputDateTime
    * @mixes Controls/Input/interface/IDateMask
    * @mixes Controls/Input/interface/IValidation
    * @control
    * @public
    * @category Input
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
         var className;

         if (!this._options.chooseMonths && !this._options.chooseQuarters && !this._options.chooseHalfyears) {
            className = 'controls-DateRangeLinkLite__picker-years-only';
         } else {
            className = 'controls-DateRangeLinkLite__picker-normal';
         }

         this._children.opener.open({
            opener: this,
            target: this._container,
            className: className,
            eventHandlers: {
               onResult: this._onResult.bind(this)
            },
            templateOptions: {
               startValue: this._options.value,
               endValue: this._options.value,
               selectionType: 'single'
            }
         });
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
