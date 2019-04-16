define('Controls/Filter/Button/Panel/Link', [
   'Core/Control',
   'wml!Controls/Filter/Button/Panel/Link/Link',
   'css!theme?Controls/Filter/Button/Panel/Link/Link'
], function(Control, template) {
   /**
    * Control filter link
    * @class Controls/Filter/Button/Panel/Link
    * @extends Controls/Control
    * @control
    * @public
    */

   /**
    * @name Controls/Filter/Button/Panel/Link#caption
    * @cfg {Object} Caption
    */

   'use strict';

   var FilterLink = Control.extend({
      _template: template,

      _clickHandler: function() {
         this._notify('visibilityChanged', [true]);
      }

   });

   return FilterLink;
});
