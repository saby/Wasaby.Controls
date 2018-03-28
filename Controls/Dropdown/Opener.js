define('Controls/Dropdown/Opener',
   [
      'Controls/Popup/Opener/Sticky',
      'WS.Data/Type/descriptor'
   ],
   function (Sticky, types) {
      /**
       * Действие открытия прилипающего окна
       * @class Controls/Dropdown/Opener
       * @control
       * @public
       * @category Popup
       */
      var DropdownOpener = Sticky.extend({
         _controlName: 'Controls/Dropdown/Opener',
         _itemTemplateDeferred: undefined,

         open: function (config, opener) {
            this._setPopupOptions(config);
            this._setComponentOptions(config);
            DropdownOpener.superclass.open.apply(this, arguments);
         },
         _setPopupOptions: function(config) {
            config.className = this._options.className || 'controls-DropdownList__margin';
            config.template = 'Controls/Dropdown/resources/template/DropdownList';
         },
         _setComponentOptions: function(config) {
            var cOptions = config.componentOptions;
            cOptions.itemTemplate = cOptions.itemTemplate || this._options.itemTemplate;
            cOptions.headTemplate = cOptions.headTemplate || this._options.headTemplate;
            cOptions.footerTemplate = cOptions.footerTemplate || this._options.footerTemplate;
            cOptions.keyProperty = cOptions.keyProperty || this._options.keyProperty;
            cOptions.depth = cOptions.depth || this._options.depth;
            cOptions.selectedKeys = cOptions.selectedKeys || this._options.selectedKeys;
            cOptions.parentProperty = cOptions.parentProperty || this._options.parentProperty;
            cOptions.itemTemplateProperty = cOptions.itemTemplateProperty || this._options.itemTemplateProperty;
            cOptions.nodeProperty = cOptions.nodeProperty || this._options.nodeProperty;
         }
      });

      DropdownOpener.getOptionTypes = function getOptionTypes() {
         return {
            keyProperty: types(String),
            parentProperty: types(String),
            nodeProperty: types(String),
            hasSelectedMarker: types(Boolean),
            multiselectable: types(Boolean),
            depth: types(Number)
         }
      };

      DropdownOpener.getDefaultOptions = function getDefaultOptions() {
         return {
            keyProperty: undefined,
            parentProperty: undefined,
            nodeProperty: undefined,
            itemTemplate: undefined,
            hasSelectedMarker: false,
            multiselectable: false,
            depth: 1
         };
      };

      return DropdownOpener;
   }
);