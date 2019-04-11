define('Controls/Button/Menu',
   [
      'Core/Control',
      'wml!Controls/Button/Menu/Menu',
      'Controls/Button/Menu/MenuUtils'
   ],
   function(Control, template, MenuUtils) {

      /**
       * Button by clicking on which a drop-down list opens.
       *
       * <a href="/materials/demo-ws4-button-menu">Demo-example</a>.
       *
       * @class Controls/Button/Menu
       * @extends Core/Control
       * @mixes Controls/interface/ICaption
       * @mixes Controls/interface/ITooltip
       * @mixes Controls/interface/ISource
       * @mixes Controls/interface/IFilter
       * @mixes Controls/List/interface/IHierarchy
       * @mixes Controls/Dropdown/interface/IFooterTemplate
       * @mixes Controls/Dropdown/interface/IHeaderTemplate
       * @mixes Controls/interface/INavigation
       * @mixes Controls/interface/IMenu
       * @mises Controls/Dropdown/interface/IGroupped
       * @mixes Controls/interface/IDropdown
       * @mixes Controls/interface/IButton
       * @mixes Controls/Button/interface/IIcon
       * @mixes Controls/Button/interface/IIconStyle
       * @control
       * @public
       * @author Михайловский Д.С.
       * @category Button
       * @demo Controls-demo/Buttons/Menu/MenuPG
       */

      'use strict';

      /**
       * @event Controls/Button/Menu#menuItemActivate Occurs when an item is selected from the list.
       * @remark If the menu has items with hierarchy and item with hierarchy was selected, you can return processing result from event handler,
       * if result will equals false, dropdown will not close. By default dropdown will close, when item with hierarchy was selected.
       */

      var Menu = Control.extend({
         _template: template,
         _filter: null,

         _beforeMount: function(options) {
            this._offsetClassName = MenuUtils.cssStyleGeneration(options);
         },

         _beforeUpdate: function(options) {
            if (this._options.size !== options.size || this._options.icon !== options.icon ||
               this._options.viewMode !== options.viewMode) {
               this._offsetClassName = MenuUtils.cssStyleGeneration(options);
            }
         },

         _onItemClickHandler: function(event, result) {
            return this._notify('onMenuItemActivate', [result[0]]);
         }

      });

      Menu.getDefaultOptions = function() {
         return {
            showHeader: true,
            filter: {},
            style: 'secondary',
            viewMode: 'button',
            size: 'm',
            iconStyle: 'secondary',
            transparent: true
         };
      };

      Menu._theme = ['Controls/Button/Menu/Menu'];

      return Menu;
   }
);
