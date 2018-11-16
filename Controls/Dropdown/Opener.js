define('Controls/Dropdown/Opener',
   [
      'Controls/Popup/Opener/Sticky',
      'Core/core-merge',
      'Controls/Utils/getZIndex',
      'Core/IoC'
   ],
   function(Sticky, coreMerge, getZIndex, IoC) {
      /**
       * Opener for dropdown menu.
       *
       * @class Controls/Dropdown/Opener
       * @mixes Controls/interface/IDropdownList
       * @extends Controls/Popup/Opener/Sticky
       * @control
       * @public
       * @author Красильников А.С.
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
               headerIcon = compOptions && (compOptions.headConfig && compOptions.headConfig.icon || compOptions.showHeader && compOptions.icon),
               menuStyle = compOptions && compOptions.headConfig && compOptions.headConfig.menuStyle,
               parents = {},
               iconSize, pid, icon;

            // необходимо учесть иконку в шапке
            if (headerIcon && menuStyle !== 'titleHead') {
               parents[parentProperty ? 'null' : 'undefined'] = [null, this.getIconSize(headerIcon, optIconSize)];
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
         setPopupOptions: function(self, popupOptions) {
            //TODO: Нельзя прокидывать className просто через опции, надо через popupOptions
            popupOptions.className = popupOptions.className || self._options.className || self._options.popupOptions.className;
            if (self._options.className) {
               IoC.resolve('ILogger').error('Dropdown.Opener', 'Опцию className надо передавать через popupOptions');
            }
            popupOptions.template = 'Controls/Dropdown/resources/template/DropdownList';
            popupOptions.closeByExternalClick = true;
         }
      };

      var DropdownOpener = Sticky.extend({
         _itemTemplateDeferred: undefined,

         open: function(popupOptions, opener) {
            _private.setTemplateOptions(this, popupOptions);
            _private.setPopupOptions(this, popupOptions);

            // To place zIndex in the old environment
            popupOptions.zIndex = getZIndex(this);
            DropdownOpener.superclass.open.apply(this, arguments);
         }
      });

      DropdownOpener._private = _private;

      DropdownOpener.getDefaultOptions = function() {
         return coreMerge(
            Sticky.getDefaultOptions(),
            {
               closeOnTargetScroll: true,
               _vdomOnOldPage: true
            });
      };

      return DropdownOpener;
   }
);
