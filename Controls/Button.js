define('Controls/Button', [
    'Core/Control',
    'tmpl!Controls/Button/Button',
    'css!Controls/Button/Button'
], function(Control, template) {
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
   var Button = Control.extend({
       _controlName: 'Controls/Button',
       _template: template,

       constructor: function (options) {
          Button.superclass.constructor.apply(this, arguments);
          this._style = options.style + (options.enabled ? '':'-disabled');
          this._type = options.style.split('-')[0] + (options.enabled ? '':'-disabled');
          this._typeWithSize = options.style.split('-')[0] + '__size-' + options.size;
       },

       _beforeUpdate: function (newOptions) {
          this._style = newOptions.style + (newOptions.enabled ? '':'-disabled');
          this._type = newOptions.style.split('-')[0] + (newOptions.enabled ? '':'-disabled');
          this._typeWithSize = newOptions.style.split('-')[0] + '__size-' + newOptions.size;
       },

       _clickHandler: function (e) {
           if(!this.isEnabled()){
               e.stopPropagation();
           }
       }
   });

   Button.getDefaultOptions = function() {
      return {
         style: 'default',
         size: 'default'
      };
   };

    return Button;
});