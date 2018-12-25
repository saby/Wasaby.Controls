define('Controls/Button', [
   'Core/Control',
   'Controls/Button/Classes',
   'wml!Controls/Button/Button',
   'Controls/Button/validateIconStyle',
   'Core/IoC',
   'css!theme?Controls/Button/Button'
], function(Control, Classes, template, validateIconStyle, IoC) {
   'use strict';

   /**
    * Graphical control element that provides the user a simple way to trigger an event.
    *
    * <a href="/materials/demo-ws4-buttons">Demo-example</a>.
    *
    * @class Controls/Button
    * @extends Core/Control
    * @mixes Controls/Button/interface/IHref
    * @mixes Controls/interface/ICaption
    * @mixes Controls/Button/interface/IClick
    * @mixes Controls/Button/interface/IIcon
    * @mixes Controls/Button/interface/IIconStyle
    * @mixes Controls/interface/ITooltip
    * @mixes Controls/interface/IButton
    * @mixes Controls/Button/ButtonStyles
    * @control
    * @public
    * @author Михайловский Д.С.
    * @category Button
    * @demo Controls-demo/Buttons/ButtonDemoPG
    */

   /**
    * @name Controls/Button#transparent
    * @cfg {Boolean} Determines whether button having background.
    * @variant true Button has transparent background.
    * @variant false Button has default background for this viewmode and style.
    * @default false
    * @example
    * Button has transparent background.
    * <pre>
    *    <Controls.Button caption="Send document" style="primary" viewMode="toolButton" transparent="{{true}}" size="l"/>
    * </pre>
    * Button hasn't transparent background.
    * <pre>
    *    <Controls.Button caption="Send document" style="primary" viewMode="toolButton" transparent="{{false}}"/>
    * </pre>
    * @see style
    */

   var _private = {
      cssStyleGeneration: function(self, options) {
         var currentButtonClass = Classes.getCurrentButtonClass(options.style);

         self._style = currentButtonClass.style ? currentButtonClass.style : options.style;
         self._transparent = options.transparent;
         self._viewMode = currentButtonClass.viewMode ? currentButtonClass.viewMode : options.viewMode;
         if (self._viewMode === 'transparentQuickButton' || self._viewMode === 'quickButton') {
            if (self._viewMode === 'transparentQuickButton') {
               self._transparent = true;
            }
            self._viewMode = 'toolButton';
            IoC.resolve('ILogger').warn('Button', 'В кнопке используется viewMode = quickButton, transparentQuickButton используйте значение опции viewMode toolButton и опцию transparent');
         }
         self._state = options.readOnly ? '_readOnly' : '';
         self._caption = options.caption;
         self._stringCaption = typeof options.caption === 'string';
         self._icon = options.icon;
         self._iconStyle = currentButtonClass.buttonAdd ? 'default' : validateIconStyle.iconStyleTransformation(options.iconStyle);
      }
   };
   var Button = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         _private.cssStyleGeneration(this, options);
      },

      _beforeUpdate: function(newOptions) {
         _private.cssStyleGeneration(this, newOptions);
      },

      _keyUpHandler: function(e) {
         if (e.nativeEvent.keyCode === 13 && !this._options.readOnly) {
            this._notify('click');
         }
      },

      _clickHandler: function(e) {
         if (this._options.readOnly) {
            e.stopPropagation();
         }
      }
   });

   Button.getDefaultOptions = function() {
      return {
         style: 'secondary',
         viewMode: 'button',
         size: 'm',
         iconStyle: 'secondary',
         transparent: true
      };
   };

   Button._private = _private;

   return Button;
});
