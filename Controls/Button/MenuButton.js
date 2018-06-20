define('Controls/Button/MenuButton',
   [
      'Core/Control',
      'tmpl!Controls/Button/Menu/MenuButton',
      'Controls/Controllers/SourceController',
      'Controls/Input/Dropdown/Util',
      'Controls/Button/Classes',
      'css!Controls/Button/Menu/MenuButton',
      'Controls/Button'
   ],
   function(Control, template, SourceController, dropdownUtil, Classes, menuHeadTemplate) {

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
         loadItems: function(instance, source, filter) {
            instance._sourceController = new SourceController({
               source: source
            });
            return instance._sourceController.load(filter || {}).addCallback(function(items) {
               instance._items = items;
               return items;
            });
         },
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
         _menuHeadTemplate: menuHeadTemplate,

         _beforeMount: function(options) {
            _private.cssStyleGeneration(this, options);
            this._onResult = this._onResult.bind(this);
         },

         _beforeUpdate: function(newOptions) {
            /* source changed, items is not actual now */
            if (newOptions.source !== this._options.source) {
               this._items = null;
            }
         },

         _open: function() {
            var self = this;

            function open() {
               dropdownUtil.open(self, self._children.popupTarget._container);
            }

            if (this._options.source && !this._items) {
               _private.loadItems(this, this._options.source, this._filter).addCallback(function(items) {
                  self._items = items;
                  open();
                  return items;
               });
            } else {
               open();
            }
         },
         _onResult: function(result) {
            if (result.action === 'itemClick') {
               this._notify('onMenuItemActivate', result.data);
               if (!result.data[0].get('@parent')) {
                  this._children.DropdownOpener.close();
               }
            }
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
