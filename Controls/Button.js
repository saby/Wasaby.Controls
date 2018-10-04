define('Controls/Button', [
   'Core/Control',
   'Controls/Button/Classes',
   'wml!Controls/Button/Button',
   'css!Controls/Button/Button'
], function(Control, Classes, template) {
   'use strict';

   /**
    * Base button with support different display styles, sizes, icon styles.
    *
    * <a href="/materials/demo-ws4-buttons">Demo-example</a>.
    *
    * @class Controls/Button
    * @extends Core/Control
    * @mixes Controls/Button/interface/IHref
    * @mixes Controls/interface/ICaption
    * @mixes Controls/Button/interface/IClick
    * @mixes Controls/Button/interface/IIcon
    * @mixes Controls/interface/ITooltip
    * @control
    * @public
    * @author Михайловский Д.С.
    * @category Button
    * @demo Controls-demo/Buttons/ButtonDemoPG
    */

   /**
    * @name Controls/Button#style
    * @cfg {Enum} Button display style.
    * @variant buttonPrimary Primary contour button display style.
    * @variant buttonDefault Default contour button display style.
    * @variant iconButtonBordered Bordered button display style.
    * @variant linkMain First main link display style.
    * @default buttonDefault
    * @remark
    * There are additional button styles:
    * <ul>
    *     <li>buttonAdd - Button add display style.</li>
    *     <li>linkMain2 - Second main link display style.</li>
    *     <li>linkMain3 - Third main link display style.</li>
    *     <li>linkAdditional - First additional link display style.</li>
    *     <li>linkAdditional2 - Second additional link display style.</li>
    *     <li>linkAdditional3 - Third additional link display style.</li>
    *     <li>linkAdditional4 - Fourth additional link display style.</li>
    *     <li>linkAdditional5 - Fifth additional link display style.</li>
    *     <li>iconButtonBorderedAdditional - Additional bordered button display style.</li>
    * </ul>
    * Sizes 's' and 'xl' don't supported by styles:
    * <ul>
    *     <li>iconButtonBordered,</li>
    *     <li>iconButtonBorderedAdditional,</li>
    *     <li>buttonPrimary,</li>
    *     <li>buttonDefault,</li>
    *     <li>buttonAdd.</li>
    * </ul>
    * @example
    * Main link button with xl size.
    * <pre>
    *    <Controls.Button caption="Send document" style="linkMain" size="xl"/>
    * </pre>
    * Bordered icon button with default size.
    * <pre>
    *    <Controls.Button caption="Send document" style="iconButtonBordered"/>
    * </pre>
    * Uncorrect button. Primary button doesn't support xl size.
    * <pre>
    *    <Controls.Button caption="Send document" style="buttonPrimary" size="xl"/>
    * </pre>
    * @see Size
    */

   /**
    * @name Controls/Button#size
    * @cfg {String} Button size. The value is given by common size notations.
    * @variant s Small button size.
    * @variant m Medium button size.
    * @variant l Large button size.
    * @variant xl Extra large button size.
    * @default m
    * @remark
    * Button size is different for different button styles.
    * Sizes 's' and 'xl' don't supported by styles:
    * <ul>
    *     <li>iconButtonBordered,</li>
    *     <li>iconButtonBorderedAdditional,</li>
    *     <li>buttonPrimary,</li>
    *     <li>buttonDefault,</li>
    *     <li>buttonAdd.</li>
    * </ul>
    * @example
    * L size of primary button.
    * <pre>
    *    <Controls.Button caption="Send document" style="buttonPrimary" size="l"/>
    * </pre>
    * M size of primary button.
    * <pre>
    *    <Controls.Button caption="Send document" style="buttonPrimary"/>
    * </pre>
    * Uncorrect size of primary button.
    * <pre>
    *    <Controls.Button caption="Send document" style="buttonPrimary" size="xl"/>
    * </pre>
    * @see style
    */

   /**
    * @name Controls/Button#icon
    * @cfg {String} Button icon.
    * @default Undefined
    * @remark Icon is given by css-classes, without color class.
    * @example
    * Button with style buttonPrimary and icon Add.
    * <pre>
    *    <Controls.Button icon="icon-small icon-Add" style="buttonPrimary"/>
    * </pre>
    * @see iconStyle
    */

   /**
    * @name Controls/Button#iconStyle
    * @cfg {Enum} Icon display style.
    * @variant primary Display style to attract attention.
    * @variant success The display style of the field with success.
    * @variant warning The display style of the field with warning.
    * @variant danger Information field display style.
    * @variant info Information field display style.
    * @default Default
    * @remark Default display style is different for different button styles.
    * @example
    * Primary button with default icon style.
    * <pre>
    *    <Controls.Button icon="icon-small icon-Add" style="buttonPrimary"/>
    * </pre>
    * Primary button with done icon style.
    * <pre>
    *    <Controls.Button icon="icon-small icon-Add" iconStyle="done" style="buttonPrimary"/>
    * </pre>
    * @see Icon
    */
   var _private = {
      cssStyleGeneration: function(self, options) {
         var currentButtonClass = Classes.getCurrentButtonClass(options.style);

         self._style = currentButtonClass.style;
         self._type = currentButtonClass.type;
         self._typeWithSize = currentButtonClass.type + '_size-' + options.size;
         self._styleWithIconStyle = currentButtonClass.style + '_iconStyle-' + options.iconStyle;
         self._state = options.readOnly ? '_readOnly' : '';
         self._caption = options.caption;
         self._icon = options.icon;
         self._isTransparent = !!currentButtonClass.transparent;
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
         style: 'buttonDefault',
         size: 'm',
         iconStyle: 'default'
      };
   };

   Button._private = _private;

   return Button;
});
