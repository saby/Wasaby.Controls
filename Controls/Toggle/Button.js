define('Controls/Toggle/Button', [
   'Core/Control',
   'Controls/Toggle/Button/Classes',
   'tmpl!Controls/Button/Button',
   'css!Controls/Button/Button',
   'css!Controls/Toggle/Button/Button'
], function(Control, Classes, template) {
   /**
    * Button that switches between different states. It support different display styles, icon display styles and sizes
    *
    * <a href="/materials/demo-ws4-switchers">Demo-example</a>.
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
    * @variant default Default icon display style.  It is different for different toggle button styles. It is default value.
    * @variant attention Attention icon display style.
    * @variant error Error icon display style.
    * @variant done Done icon display style.
    */

   /**
    * @name Controls/Toggle/Button#style
    * @cfg {String} Display style of button.
    * @variant iconButtonBordered Bordered icon toggle button display style.
    * @variant linkMain Main link toggle button display style. It is default value.
    * @variant buttonLinkMain Main link button display style.
    * @variant buttonLinkAdditional Additional link button display style.
    */

   /**
    * @name Controls/Toggle/Button#size
    * @cfg {String} Size of the button.
    * @variant s Small button size.
    * @variant m Medium button size.
    * @variant l Large button size. It is default value.
    */

   /**
    * @name Controls/Toggle/Button#icons
    * @cfg {Array} Set of icons. Button with zero icons - button without icons.
    * Button with one icon have one icon and it isn't toggled.
    * Button with two icons have one icon, but it is different in free and toggled states.
    * If button has more than two icons, it work only with first and second captions.
    */

   /**
    * @name Controls/Toggle/Button#captions
    * @cfg {Array} Set of captions. Button with zero icons - button without caption.
    * Button with one caption have one caption and it isn't toggled.
    * Button with two caption have one caption, but it is different in free and toggled states.
    * If button has more than two captions, it work only with first and second captions.
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
