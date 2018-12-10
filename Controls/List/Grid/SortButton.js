define('Controls/List/Grid/SortButton', [
   'Core/Control',
   'wml!Controls/List/Grid/SortButton',
   'css!Controls/List/Grid/SortButton'
], function(Control, template) {
   
   'use strict';
   
   /**
    * Graphical control element that used for changing sorting in Grid control
    *
    * @class Controls/List/Grid/SortButton
    * @extends Core/Control
    */
   
   /**
    * @name Controls/List/Grid/SortButton#type
    * @cfg {String} Type of sorting.
    * @variant single Sorting by single field.
    * @variant multi Allows you to sort by multiple fields.
    */
   
   /**
    * @name Controls/List/Grid/SortButton#property
    * @cfg {String} Sorting property.
    */
   return Control.extend({
      _template: template,
      
      _clickHandler: function() {
         this._notify('sortingChanged', [this._options.property, this._options.type], {bubbling: true});
      }
      
   });
});
