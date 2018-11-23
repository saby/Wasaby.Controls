define('Controls/Button/Menu',
   [
      'Core/Control',
      'wml!Controls/Button/Menu/Menu',
      'Controls/Button/Menu/MenuUtils',
      'css!Controls/Button/Menu/Menu',
      'Controls/Button'
   ],
   function(Control, template, MenuUtils) {

      /**
       * Button by clicking on which a drop-down list opens.
       * @class Controls/Button/Menu
       * @extends Core/Control
       * @mixes Controls/interface/ICaption
       * @mixes Controls/interface/ITooltip
       * @mixes Controls/interface/IMenu
       * @control
       * @public
       * @author Михайловский Д.С.
       * @category Button
       * @demo Controls-demo/Dropdown/MenuVdom
       */

      'use strict';

      /**
       * @event Controls/Button/Menu#menuItemActivate Occurs when an item is selected from the list.
       */

      var Menu = Control.extend({
         _template: template,
         _filter: null,

         _beforeMount: function(options) {
            this._offsetClassName = MenuUtils.cssStyleGeneration(options);
            this._filter = options.filter;
         },

         _beforeUpdate: function(options) {
            this._offsetClassName = MenuUtils.cssStyleGeneration(options);
         },

         _onItemClickHandler: function(event, result) {
            this._notify('onMenuItemActivate', [result[0]]);
         }

      });

      Menu.getDefaultOptions = function() {
         return {
            showHeader: true,
            style: 'buttonDefault',
            size: 'm',
            filter: {}
         };
      };

      return Menu;
   }
);
