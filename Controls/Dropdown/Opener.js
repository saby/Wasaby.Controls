define('Controls/Dropdown/Opener',
   [
      'Controls/Popup/Opener/Sticky',
      'Core/core-merge'
   ],
   function(Sticky, coreMerge) {
      /**
       * Opener for dropdown menu.
       *
       * @class Controls/Dropdown/Opener
       * @mixes Controls/interface/IDropdown
       * @control
       * @public
       * @category Popup
       */
      var _private = {

         /**
           * Возвращает размер иконки
           * @param icon
           * @returns {*}
           */
         getIconSize: function(icon, optIconSize) {
            var iconSizes = ['icon-small', 'icon-medium', 'icon-large', 'icon-size'],
               iconSize;
            if (optIconSize) {
               switch (optIconSize) {
                  case 's': iconSize = iconSizes[0]; break;
                  case 'm': iconSize = iconSizes[1]; break;
                  case 'l': iconSize = iconSizes[2]; break;
               }
            } else {
               iconSizes.forEach(function(size) {
                  if (icon.indexOf(size) !== -1) {
                     iconSize = size;
                  }
               });
            }
            return iconSize;
         },

         /**
           * Обходим все дерево для пунктов и проверяем наличие иконки у хотя бы одного в каждом меню
           * При наличии таковой делаем всем пунктам в этом меню фэйковую иконку для их сдвига.
           * @param self
           * @param config
           */
         checkIcons: function(self, config) {
            var compOptions = self._options.popupOptions && self._options.popupOptions.templateOptions,
               configOptions = config.templateOptions,
               parentProperty = (configOptions && configOptions.parentProperty) || compOptions && compOptions.parentProperty,
               items = configOptions && configOptions.items,
               optIconSize = configOptions && configOptions.iconSize,
               headerIcon = compOptions && (compOptions.headConfig && compOptions.headConfig.icon || compOptions.icon),
               menuStyle = compOptions && compOptions.headConfig && compOptions.headConfig.menuStyle,
               parents = {},
               iconSize, pid, icon;

            // необходимо учесть иконку в шапке
            if (headerIcon && menuStyle !== 'cross') {
               parents['null'] = [null, this.getIconSize(headerIcon, optIconSize)];
            }

            items.each(function(item) {
               icon = item.get('icon');
               if (icon) {
                  pid = item.get(parentProperty);
                  if (!parents.hasOwnProperty(pid)) {
                     iconSize = _private.getIconSize(icon, optIconSize);
                     parents[pid] = [pid, iconSize];
                  }
               }
            });

            configOptions.iconPadding = parents;
         },

         setTemplateOptions: function(self, config) {
            var pOptions = self._options.popupOptions || {};
            if (pOptions.templateOptions && pOptions.templateOptions.headConfig) {
               pOptions.templateOptions.headConfig.menuStyle = pOptions.templateOptions.headConfig.menuStyle || 'defaultHead';
            }
            this.checkIcons(self, config);
         },
         setPopupOptions: function(self, config) {
            config.className = self._options.className || 'controls-DropdownList__margin';
            config.template = 'Controls/Dropdown/resources/template/DropdownList';
            config.closeByExternalClick = true;
         }
      };

      var DropdownOpener = Sticky.extend({
         _itemTemplateDeferred: undefined,

         open: function(config, opener) {
            _private.setTemplateOptions(this, config);
            _private.setPopupOptions(this, config);
            DropdownOpener.superclass.open.apply(this, arguments);
         }
      });

      DropdownOpener._private = _private;

      DropdownOpener.getDefaultOptions = function() {
         return coreMerge(
            {closeOnTargetScroll: true},
            Sticky.getDefaultOptions());
      };

      return DropdownOpener;
   }
);
