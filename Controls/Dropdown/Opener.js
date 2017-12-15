define('Controls/Dropdown/Opener',
   [
      'Core/Control',
      'tmpl!Controls/Dropdown/resources/Opener',
      'WS.Data/Type/descriptor',
      'Controls/Dropdown/resources/template/OpenerTemplate'
   ],
   function (Control, Template, types) {
      var DEFAULT_OFFSET = { //TODO после доработки в попапе, которая будет учитывать смещение на margin'ах, этого кода не будет
         horizontal: -13,
         vertical: -6
      };
      /**
       * Действие открытия прилипающего окна
       * @class Controls/Dropdown/Opener
       * @control
       * @public
       * @category Popup
       */
      var Menu = Control.extend([], {
         _template: Template,
         _controlName: 'Controls/Dropdown/Opener',
         _itemTemplateDeferred: undefined,
         _beforeMount: function (newOptions) {
            //TODO после доработки в попапе, которая будет учитывать смещение на margin'ах, этого кода не будет
            this._horizontalOffset = newOptions.horizontalOffset !== undefined ? newOptions.horizontalOffset : DEFAULT_OFFSET.horizontal;
            this._verticalOffset = newOptions.verticalOffset !== undefined ? newOptions.verticalOffset : DEFAULT_OFFSET.vertical;
         },

         open: function (config, opener) {
            this._prepareConfig(config);
            this._children.StickyOpener.open(config, opener);
         },
         _prepareConfig: function(config) {
            config.componentOptions.itemTemplate = this._options.itemTemplate;
            config.componentOptions.headTemplate = this._options.headTemplate;
            config.componentOptions.footerTemplate = this._options.footerTemplate;
         },
         close: function() {
            this._children.StickyOpener.close.apply(this._children.StickyOpener, arguments);
         }
      });

      Menu.getOptionTypes = function getOptionTypes() {
         return {
            keyProperty: types(String),
            parentProperty: types(String),
            nodeProperty: types(String),
            hasSelectedMarker: types(Boolean),
            multiselectable: types(Boolean),
            depth: types(Number)
         }
      };

      Menu.getDefaultOptions = function getDefaultOptions() {
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

      return Menu;
   }
);