define('Controls/Filter/Button/Panel/Selector/FieldLink', [
   'Core/Control',
   'wml!Controls/Filter/Button/Panel/Selector/FieldLink',
   'css!theme?Controls/Filter/Button/Panel/Selector/FieldLink'
], function(Control, template) {
   /**
    * Control link with lookup
    * @class Controls/Filter/Button/Panel/Selector/FieldLink
    * @extends Controls/Control
    * @control
    * @public
    */

   /**
    * @name Controls/Filter/Button/Panel/Selector/FieldLink#caption
    * @cfg {Object} Caption
    */

   'use strict';

   var FieldLink = Control.extend({
      _template: template,
      _passed: false,

      showSelector: function() {
         this._children.lookup.showSelector();
         // this._options.selectorTemplate = this._options.selectorTemplate || this._options.lookupTemplate;
         // SelectorController._private.showSelector.call(this);
      },

      showLookup: function () {
         this._passed = true;
      }
   });

   return FieldLink;
});
