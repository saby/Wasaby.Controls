define('Controls/Button', [
    'Core/Control',
    'Core/IoC',
    'tmpl!Controls/Button/Button',
    'css!Controls/Button/Button'
], function(Control, IoC, template) {
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
   var classesOfButton = {
      linkMain: {
         style: 'link-main',
         type: 'link'
      },
      linkMain2: {
         style: 'link-main2',
         type: 'link'
      },
      linkMain3: {
         style: 'link-main3',
         type: 'link'
      },
      linkAdditional: {
         style: 'link-additional',
         type: 'link'
      },
      linkAdditional2: {
         style: 'link-additional2',
         type: 'link'
      },

      linkAdditional3: {
         style: 'link-additional3',
         type: 'link'
      },

      linkAdditional4: {
         style: 'link-additional4',
         type: 'link'
      },

      linkAdditional5: {
         style: 'link-additional5',
         type: 'link'
      },

      buttonPrimary: {
         style: 'primary',
         type: 'primary'
      },

      buttonDefault: {
         style: 'default',
         type: 'default'
      },

      buttonAdd: {
         style: 'primary-add',
         type: 'primary'
      }
   };

   var _private = {
     cssStyleGeneration: function (self, options) {
        if (!classesOfButton.hasOwnProperty(options.style)) {
           IoC.resolve('ILogger').error("Button", "Для кнопки задан несуществующий стиль");
           currentButtonClass = classesOfButton.buttonDefault;
        }else {
           var currentButtonClass = classesOfButton[options.style];
        }
        self._style = currentButtonClass.style + (options.enabled ? '':'-disabled');
        self._type = currentButtonClass.type + (options.enabled ? '':'-disabled');
        self._typeWithSize = currentButtonClass.type + '__size-' + options.size;
     }
   };

   var Button = Control.extend({
       _controlName: 'Controls/Button',
       _template: template,

       constructor: function (options) {
          Button.superclass.constructor.apply(this, arguments);
          _private.cssStyleGeneration(this, options);
       },

       _beforeUpdate: function (newOptions) {
          _private.cssStyleGeneration(this, newOptions);
       },

       _clickHandler: function (e) {
           if(!this.isEnabled()) {
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