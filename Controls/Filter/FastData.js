define('Controls/Filter/FastData',
   [
      'Controls/Input/Dropdown',
      'tmpl!Controls/Filter/FastData/FastData',
      'css!Controls/Filter/FastData/FastData'
   ],
   function (Control, template) {

      /**
       *
       * @class Controls/Filter/FastData
       * @extends Controls/Control
       * @control
       * @public
       * @author Золотова Э.Е.
       */

      'use strict';
      var FastData = Control.extend({
         _template: template,

         _open: function(event) {
            var config = {
               componentOptions: {
                  items: this._items
               },
               target: event.target.parentElement
            };
            this._children.DropdownOpener.open(config, this);
         },

         _reset: function(event) {
            this._notify('selectedKeysChanged', this._items.at(0).get(this._options.keyProperty));
            event.stopPropagation();
         }
      });

      return FastData;
   }
);