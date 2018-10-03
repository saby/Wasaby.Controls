define('Controls/Filter/Button/Panel/FilterLink', [
   'Core/Control',
   'wml!Controls/Filter/Button/Panel/FilterLink/FilterLink',
   'css!Controls/Filter/Button/Panel/FilterLink/FilterLink'
], function(Control, template) {
   /**
    * Control filter link
    * @class Controls/Filter/Button/Panel/FilterLink
    * @extends Controls/Control
    * @control
    * @public
    */

   /**
    * @name Controls/Filter/Button/Panel/FilterLink#caption
    * @cfg {Object} Caption
    */

   'use strict';

   var FilterLink = Control.extend({
      _template: template,

      _clickHandler: function() {
         this._notify('valueChanged');
      }

   });

   FilterLink.getDefaultOptions = function() {
      return {
         value: true
      };
   };

   return FilterLink;
});
