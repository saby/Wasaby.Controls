define('Controls/Toggle/Switch', [
   'Core/Control',
   'wml!Controls/Toggle/Switch/Switch',
   'Types/entity'
], function(Control, template, entity) {

   /**
    * Switch button with single caption. Frequently used for 'on-off' settings.
    *
    * <a href="/materials/demo-ws4-switchers">Demo-example</a>.
    *
    * @class Controls/Toggle/Switch
    * @extends Core/Control
    * @mixes Controls/Toggle/interface/ICheckable
    * @mixes Controls/interface/ITooltip
    * @control
    * @public
    * @author Михайловский Д.С.
    * @category Toggle
    * @demo Controls-demo/Switch/SwitchDemo
    *
    * @mixes Controls/Toggle/Switch/SwitchStyles
    * @mixes Controls/Toggle/resources/SwitchCircle/SwitchCircleStyles
    */

   /**
    * @name Controls/Toggle/Switch#caption
    * @cfg {String} Caption text.
    */

   /**
    * @name Controls/Toggle/Switch#captionPosition
    * @cfg {String} Determines on which side of the button caption is located.
    * @variant left Caption before toggle.
    * @variant right Toggle before caption. It is default value.
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
         value: false,
         captionPosition: 'right'
      };
   };

   Switch.getOptionTypes = function getOptionTypes() {
      return {
         value: entity.descriptor(Boolean),
         caption: entity.descriptor(String),
         captionPosition: entity.descriptor(String).oneOf([
            'left',
            'right'
         ])
      };
   };


   Switch._theme = [ 'Controls/toggle' ];

   return Switch;
});
