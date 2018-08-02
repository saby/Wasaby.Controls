define('Controls/Button', [
   'Core/Control',
   'Controls/Button/Classes',
   'tmpl!Controls/Button/Button',
   'css!Controls/Button/Button'
], function(Control, Classes, template) {
   'use strict';

   /**
    * Base button with support different display styles, sizes, icon styles.
    *
    * <a href="/materials/demo-ws4-buttons">Демо-пример</a>.
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
    * @category Button
    * @demo Controls-demo/Buttons/ButtonDemo
    */

   /**
    * @name Controls/Button#style
    * @cfg {String} Display style of button.
    * @variant iconButtonBordered Bordered icon button display style. Minimum number size.
    * @variant iconButtonBorderedAdditional Additional bordered icon button display style. Minimum number size
    * @variant linkMain First main link display style.
    * @variant linkMain2 Second main link display style.
    * @variant linkMain3 Third main link display style.
    * @variant linkAdditional First additional link display style.
    * @variant linkAdditional2 Second additional link display style.
    * @variant linkAdditional3 Third additional link display style.
    * @variant linkAdditional4 Fourth additional link display style.
    * @variant linkAdditional5 Fifth additional link display style.
    * @variant buttonPrimary Primary contour button display style. Minimum number size.
    * @variant buttonDefault Default contour button display style. Minimum number size. It is default value.
    * @variant buttonAdd Button add display style. Minimum number size.
    */

   /**
    * @name Controls/Button#size
    * @cfg {String} Size of the button.
    * @variant s Small button size. Not supported by button styles with label: 'Minimum number size'.
    * @variant m Medium button size. It is default value.
    * @variant l Large button size.
    * @variant xl Extra large button size. Not supported by button styles with label: 'Minimum number size'.
    */

   /**
    * @name Controls/Button#caption
    * @cfg {String} Button text.
    */

   /**
    * @name Controls/Button#icon
    * @cfg {String} Button icon. It is given by css-classes, without color class.
    */

   /**
    * @name Controls/Button#iconStyle
    * @cfg {String} Displaying icon style.
    * @variant default Default icon display style. It is different for different button styles. It is default value.
    * @variant attention Attention icon display style.
    * @variant error Error icon display style.
    * @variant done Done icon display style.
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

      constructor: function(options) {
         Button.superclass.constructor.apply(this, arguments);
         _private.cssStyleGeneration(this, options);
      },

      _beforeUpdate: function(newOptions) {
         _private.cssStyleGeneration(this, newOptions);
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
