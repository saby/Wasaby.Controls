define('Controls/Button', [
   'Core/Control',
   'Controls/Button/Classes',
   'tmpl!Controls/Button/Button',
   'css!Controls/Button/Button'
], function(Control, Classes, template) {
   'use strict';

   /**
	* Набор базовых компонентов VDOM.
	* @namespace Controls
	* @public
	* @author Крайнов Д.
	*/

   /**
    * Кнопка
    * @class Controls/Button
    * @extends Controls/Control
    * @mixes Controls/Button/interface/IHref
    * @mixes Controls/Button/interface/ICaption
    * @mixes Controls/Button/interface/IClick
    * @mixes Controls/Button/interface/IIcon
    * @mixes Controls/interface/ITooltip
    * @control
    * @public
    * @category Button
    */

   /**
    * @name Controls/Button#type
    * @cfg {String} Внешний вид кнопки
    * @variant standard Стандартная кнопка
    * @variant link Кнопка ссылка
    * @variant flat Кнопка без контура
    */
   var _private = {
      cssStyleGeneration: function (self, options) {
         var currentButtonClass = Classes.getCurrentButtonClass(options.style);

         self._style = currentButtonClass.style;
         self._type = currentButtonClass.type;
         self._typeWithSize = currentButtonClass.type + '_size-' + options.size;
         self._typeWithIconStyle = currentButtonClass.type + '_iconStyle-' + options.iconStyle;
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
         if (!this.isEnabled()) {
            e.stopPropagation();
         }
      }
   });

   Button.getDefaultOptions = function() {
      return {
         style: 'buttonDefault',
         size: 'default'
      };
   };

   Button._private = _private;

   return Button;
});
