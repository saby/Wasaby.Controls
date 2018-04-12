define('Controls/Dropdown/Opener',
   [
      'Controls/Popup/Opener/Sticky',
      'WS.Data/Relation/Hierarchy',
      'WS.Data/Type/descriptor'
   ],
   function(Sticky, Hierarchy, types) {
      /**
       * Действие открытия прилипающего окна
       * @class Controls/Dropdown/Opener
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
         getIconSize: function(icon) {
            var iconSizes = ['icon-small', 'icon-medium', 'icon-large', 'icon-size'],
               iconSize;

            iconSizes.forEach(function(size) {
               if (icon.indexOf(size) !== -1) {
                  iconSize = size;
               }
            });
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
               nodeProperty = (configOptions && configOptions.nodeProperty) || compOptions && compOptions.nodeProperty,
               items = configOptions && configOptions.items,
               hierarchy = new Hierarchy({
                  idProperty: items.getIdProperty(),
                  parentProperty: parentProperty,
                  nodeProperty: nodeProperty
               }),
               headerIcon = compOptions && (compOptions.headConfig && compOptions.headConfig.icon || compOptions.icon),
               menuStyle = compOptions && compOptions.headConfig && compOptions.headConfig.menuStyle,
               parents = {},
               iconSize, children, child, pid, i, icon;

            // необходимо учесть иконку в шапке
            if (headerIcon && menuStyle !== 'cross') {
               parents['null'] = [null, this.getIconSize(headerIcon)];
            }

            items.each(function(item) {
               icon = item.get('icon');
               if (icon) {
                  pid = item.get(parentProperty);
                  if (!parents.hasOwnProperty(pid)) {
                     iconSize = _private.getIconSize(icon);
                     parents[pid] = [pid, iconSize];
                  }
               }
            });

            for (var key in parents) {
               if (parents.hasOwnProperty(key)) {
                  children = hierarchy.getChildren(parents[key][0], items);
                  for (i = 0; i < children.length; i++) {
                     child = children[i];
                     if (!child.get('icon')) {
                        child.set('icon', parents[key][1]);
                     }
                  }
               }
            }
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
         _controlName: 'Controls/Dropdown/Opener',
         _itemTemplateDeferred: undefined,

         open: function(config, opener) {
            _private.setTemplateOptions(this, config);
            _private.setPopupOptions(this, config);
            DropdownOpener.superclass.open.apply(this, arguments);
         }
      });

      DropdownOpener.getOptionTypes = function getOptionTypes() {
         return {
            keyProperty: types(String),
            parentProperty: types(String),
            nodeProperty: types(String),
            hasSelectedMarker: types(Boolean),
            multiselectable: types(Boolean)
         };
      };

      DropdownOpener.getDefaultOptions = function getDefaultOptions() {
         return {
            keyProperty: undefined,
            parentProperty: undefined,
            nodeProperty: undefined,
            itemTemplate: undefined,
            hasSelectedMarker: false,
            multiselectable: false
         };
      };

      DropdownOpener._private = _private;
      return DropdownOpener;
   }
);
