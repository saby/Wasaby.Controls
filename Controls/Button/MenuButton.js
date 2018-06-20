define('Controls/Button/MenuButton',
   [
      'Core/Control',
      'tmpl!Controls/Button/Menu/MenuButton',
      'Controls/Button/Classes',
      'css!Controls/Button/Menu/MenuButton',
      'Controls/Button'
   ],
   function(Control, template, Classes) {

      /**
       * MenuButton
       * @class Controls/Button
       * @extends Core/Control
       * @mixes Controls/Button/interface/ICaption
       * @mixes Controls/Button/interface/IClick
       * @mixes Controls/Button/interface/IIcon
       * @mixes Controls/interface/ITooltip
       * @mixes Controls/interface/ISource
       * @control
       * @public
       * @category Button
       */

      'use strict';

      /**
       * @name Controls/MenuButton#headConfig
       * @cfg {Object} Menu style menuStyle
       * @variant defaultHead The head with icon and caption
       * @variant duplicateHead The icon set under first item
       * @variant cross Menu have cross in left top corner
       */

      var _private = {
         cssStyleGeneration: function(self, options) {
            var sizes = ['small', 'medium', 'large'],
               menuStyle = options.headConfig && options.headConfig.menuStyle,
               currentButtonClass, iconSize;

            currentButtonClass = Classes.getCurrentButtonClass(options.style);

            // для каждого размера вызывающего элемента создаем класс, который выравнивает popup через margin.
            self._offsetClassName = 'controls-MenuButton controls-MenuButton_' + currentButtonClass.type + '_' + options.size;

            if (currentButtonClass.type === 'link' && options.icon) {
               sizes.forEach(function(size) {
                  if (options.icon.indexOf('icon-' + size) !== -1) {
                     iconSize = size;
                  }
               });

               // у кнопки типа 'Ссылка' высота вызывающего элемента зависит от размера иконки,
               // поэтому необходимо это учесть при сдвиге
               self._offsetClassName += '_' + iconSize;
            }
            self._offsetClassName += (menuStyle === 'duplicateHead' ? '_duplicate' : '');
         }
      };

      var MenuButton = Control.extend({
         _template: template,

         _beforeMount: function(options) {
            _private.cssStyleGeneration(this, options);
         },
   
         _onResult: function(event, result) {
            this._notify('onMenuItemActivate', [result[0]]);
         }
         
      });

      MenuButton.getDefaultOptions = function() {
         return {
            showHeader: true,
            style: 'buttonDefault',
            size: 'default'
         };
      };

      return MenuButton;
   }
);
