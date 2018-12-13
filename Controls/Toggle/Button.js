define('Controls/Toggle/Button', [
   'Core/Control',
   'Controls/Toggle/Button/Classes',
   'wml!Controls/Button/Button',
   'Controls/Button/validateIconStyle',
   'css!theme?Controls/Button/Button',
   'css!theme?Controls/Toggle/Button/Button'
], function(Control, Classes, template, validateIconStyle) {
   /**
    * Button that switches between two states: on-state and off-state.
    *
    * <a href="/materials/demo-ws4-buttons">Demo-example</a>.
    *
    * @class Controls/Toggle/Button
    * @mixes Controls/Toggle/interface/ICheckable
    * @mixes Controls/interface/ITooltip
    * @mixes Controls/interface/IButton
    * @mixes Controls/Button/interface/IHref
    * @mixes Controls/Toggle/Button/Styles
    * @control
    * @public
    * @author Михайловский Д.С.
    * @category Toggle
    *
    * @demo Controls-demo/Buttons/Toggle/ToggleButtonPG
    */

   /**
    * @name Controls/Toggle/Button#icons
    * @cfg {Array} Set of icons.
    * Toggle button with one icon have one icon and it isn't toggled.
    * Toggle button with two icons display one icon, but it is different in free and toggled states.
    * If button has more than two icons, it work only with first and second icons.
    */

   /**
    * @name Controls/Toggle/Button#iconStyle
    * @cfg {Enum} Icon display style.
    * @variant primary attract attention.
    * @variant secondary Default field display style.
    * @variant success Success field display style.
    * @variant warning Warning field display style.
    * @variant danger Danger field display style.
    * @variant info Information field display style.
    * @default secondary
    * @example
    * Primary link with default icon style.
    * <pre>
    *    <Controls.Toggle.Button icon="icon-small icon-Add" style="primary" viewMode="link"/>
    * </pre>
    * Primary link with done icon style.
    * <pre>
    *    <Controls.Toggle.Button icon="icon-small icon-Add" iconStyle="success" style="primary" viewMode="link"/>
    * </pre>
    * @see Icons
    */

   /**
    * @name Controls/Toggle/Button#captions
    * @cfg {Array} Set of captions.
    * Toggle button with one caption have one caption and it isn't toggled.
    * Toggle button with two captions display one caption, but it is different in free and toggled states.
    * If button has more than two captions, it work only with first and second captions.
    */

   /**
    * @name Controls/Toggle/Button#viewMode
    * @cfg {Enum} Button view mode.
    * @variant link Decorated hyperlink.
    * @variant toggledLink Decorated hyperlink transform to toolbar button.
    * @variant toolButton Toolbar button.
    * @default button
    * @example
    * Toggle button with 'link' viewMode.
    * <pre>
    *    <Controls.Toggle.Button caption="Send document" style="primary" viewMode="link" size="xl"/>
    * </pre>
    * Toggle button with 'toolButton' viewMode.
    * <pre>
    *    <Controls.Toggle.Button caption="Send document" style="danger" viewMode="toolButton"/>
    * </pre>
    * Toggle button with 'toggledLink' viewMode.
    * <pre>
    *    <Controls.Toggle.Button caption="Send document" style="success" viewMode="toggledLink"/>
    * </pre>
    */
   var stickyButton = [
      'toggledLink',
      'toolButton'
   ];

   var _private = {
      optionsGeneration: function(self, options) {
         var currentButtonClass = Classes.getCurrentButtonClass(options.style);

         self._style = currentButtonClass.style ? currentButtonClass.style : options.style;
         self._transparent = options.transparent;
         self._viewMode = currentButtonClass.style ? currentButtonClass.viewMode : options.viewMode;
         self._state = (stickyButton.indexOf(self._viewMode) !== -1 && options.value ? '_toggle_on' : '') + (options.readOnly ? '_readOnly' : '');
         self._caption = (options.captions ? (!options.value && options.captions[1] ? options.captions[1] : options.captions[0]) : '');
         self._icon = (options.icons ? (!options.value && options.icons[1] ? options.icons[1] : options.icons[0]) : '');
         self._iconStyle = validateIconStyle.iconStyleTransformation(options.iconStyle);
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
         iconStyle: 'secondary'
      };
   };

   ToggleButton._private = _private;
   return ToggleButton;
});
