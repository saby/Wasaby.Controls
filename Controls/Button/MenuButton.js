define('Controls/Button/MenuButton',
   [
      'Core/Control',
      'tmpl!Controls/Button/Menu/MenuButton',
      'WS.Data/Collection/RecordSet',
      'Controls/Controllers/SourceController',
      'Controls/Input/Dropdown/Util',
      'Controls/Button/Classes',
      'css!Controls/Button/Menu/MenuButton',
      'Controls/Button'
   ],
   function(Control, template, RecordSet, SourceController, dropdownUtil, Classes, menuHeadTemplate) {

       /**
        * Кнопка
        * @class Controls/Button
        * @extends Controls/Control
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

      var _private = {
         loadItems: function(instance, source) {
            instance._sourceController = new SourceController({
               source: source
            });
            return instance._sourceController.load().addCallback(function(items){
               instance._items = items;
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
         constructor: function (config) {
            _private.cssStyleGeneration(this, config);
            config.headCaption = config.headCaption || config.caption;
            MenuButton.superclass.constructor.apply(this, arguments);
            this._onResult = this._onResult.bind(this);
         },
         _beforeMount: function(options, context, receivedState) {
            if (receivedState) {
               this._items = receivedState;
            } else {
               if (options.source) {
                  return _private.loadItems(this, options.source, options.selectedKeys);
               }
            }
         },
         _beforeUpdate: function(newOptions) {
            if (newOptions.source && newOptions.source !== this._options.source) {
                return _private.loadItems(this, newOptions.source, newOptions.selectedKeys);
            }
         },
         _open: function() {
            dropdownUtil.open(this, this._children.popupTarget._container);
         },
         _onResult: function(args) {
            var actionName = args[0];
            var data = args[2];

            if(actionName === 'itemClick') {
               this._notify('onMenuItemActivate', data);
               this._children.DropdownOpener.close();
            }
         }
      });

      MenuButton.getDefaultOptions = function() {
         return {
            style: 'buttonDefault',
            size: 'default'
         };
      };

      return MenuButton;
   }
);