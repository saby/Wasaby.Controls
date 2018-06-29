define('Controls/Toggle/Switch', [
   'Core/Control',
   'tmpl!Controls/Toggle/Switch/Switch',
   'WS.Data/Type/descriptor',
   'css!Controls/Toggle/Switch/Switch',
   'css!Controls/Toggle/resources/SwitchCircle/SwitchCircle'
], function(Control, template, types) {

   /**
    * Switch control.
    *
    * @class Controls/Toggle/Switch
    * @extends Core/Control
    * @mixes Controls/Toggle/interface/ICheckable
    * @mixes Controls/interface/ITooltip
    * @control
    * @public
    * @category Toggle
    * @demo Controls-demo/Switch/SwitchDemo
    */

   /**
    * @name Controls/Toggle/Switch#caption
    * @cfg {String} Title.
    */

   /**
    * @name Controls/Toggle/Switch#captionLeft
    * @cfg {Boolean} Switch caption has left position.
    */

   var Switch = Control.extend({
      _template: template,

      _clickHandler: function(e) {
         if (!this._options.readOnly) {
            this._notify('valueChanged', [!this._options.value]);
         }
      }
   });

   Switch.getDefaultOptions = function getDefaultOptions() {
      return {
         value: false
      };
   };

   Switch.getOptionTypes = function getOptionTypes() {
      return {
         value: types(Boolean),
         caption: types(String)
      };
   };

   return Switch;
});
