define('Controls/Toggle/Button', [
   'Core/Control',
   'Controls/Toggle/Button/Classes',
   'tmpl!Controls/Button/Button',
   'css!Controls/Button/Button',
   'css!Controls/Toggle/Button/Button'
], function(Control, Classes, template) {
   /**
    * Button that switches between different states.
    *
    * <a href="/materials/demo-ws4-switchers">Демо-пример</a>.
    *
    * @class Controls/Toggle/Button
    * @mixes Controls/Toggle/interface/ICheckable
    * @mixes Controls/interface/ITooltip
    * @control
    * @public
    * @category Toggle
    */

   /**
    * @name Controls/Toggle/Button#iconStyle
    * @cfg {String} Displaying icon style.
    * @variant default Icon has default display style in this type of button.
    * @variant attention Icon has attention display style.
    * @variant error Icon has error display style.
    * @variant done Icon has done icon style.
    */

   /**
    * @name Controls/Toggle/Button#style
    * @cfg {String} Display style of button.
    * @variant iconButtonBordered Button display as icon with border.
    * @variant linkMain Button display as main link style.
    */

   /**
    * @name Controls/Toggle/Button#size
    * @cfg {String} Size of the button.
    * @variant s Button has s size.
    * @variant m Button has m size.
    * @variant l Button has l size.
    */

   /**
    * @name Controls/Toggle/Button#icons
    * @cfg {Array} Set of icons.
    */

   /**
    * @name Controls/Toggle/Button#captions
    * @cfg {Array} Set of captions.
    */

   var _private = {
      optionsGeneration: function(self, options) {
         var currentButtonClass = Classes.getCurrentButtonClass(options.style);

         self._style = currentButtonClass.style;
         self._type = currentButtonClass.type;
         self._typeWithSize = self._type + '_size-' + options.size;
         self._styleWithIconStyle = self._style + '_iconStyle-' + options.iconStyle;
         self._state = (options.value && currentButtonClass.toggled ? '_toggle_on' : '') + (options.readOnly ? '_readOnly' : '');
         self._caption = (options.captions ? (!options.value && options.captions[1] ? options.captions[1] : options.captions[0]) : '');
         self._icon = (options.icons ? (!options.value &&  options.icons[1] ? options.icons[1] : options.icons[0]) : '');
      }
   };
   var ToggleButton = Control.extend({
      _template: template,
      _beforeMount: function(options) {
         _private.optionsGeneration(this, options);
      },
      _clickHandler: function() {
         if (!this._options.readOnly) {
            this._notify('valueChanged', [!this._options.value]);
         }
      },
      _beforeUpdate: function(newOptions) {
         _private.optionsGeneration(this, newOptions);
      }
   });

   ToggleButton.getDefaultOptions = function() {
      return {
         style: 'linkMain',
         size: 'l',
         iconStyle: 'default'
      };
   };

   ToggleButton._private = _private;
   return ToggleButton;
});
