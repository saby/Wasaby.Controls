define('Controls/Filter/Button/Panel/Lookup', [
   'Core/Control',
   'wml!Controls/Filter/Button/Panel/Lookup/Lookup',
   'css!theme?Controls/Filter/Button/Panel/Lookup/Lookup'
], function(Control, template) {
   /**
    * Control link with lookup
    * @class Controls/Filter/Button/Panel/Lookup
    * @extends Controls/Control
    * @control
    * @public
    */

   /**
    * @name Controls/Filter/Button/Panel/Lookup#caption
    * @cfg {Object} Caption
    */

   'use strict';

   var Lookup = Control.extend({
      _template: template,
      _passed: false,

      showSelector: function() {
         this._children.lookup.showSelector();
      },

      _showLookup: function() {
         this._passed = true;
      }
   });

   return Lookup;
});
