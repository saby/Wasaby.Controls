define('Controls/Filter/Button/Panel/Text', [
   'Core/Control',
   'wml!Controls/Filter/Button/Panel/Text/Text',
   'css!theme?Controls/Filter/Button/Panel/Text/Text'
], function(Control, template) {

   /**
    * Control text with cross
    * @class Controls/Filter/Button/Panel/FilterText
    * @extends Controls/Control
    * @control
    * @public
    * @author Герасимов А.М.
    */

   /**
    * @name Controls/Filter/Button/Panel/FilterText#caption
    * @cfg {Object} Caption
    */

   'use strict';

   var FilterText = Control.extend({
      _template: template,

      _afterMount: function() {
         this._notify('valueChanged', [true]);
      },

      _resetHandler: function() {
         this._notify('visibilityChanged', [false]);
      }

   });

   FilterText.getDefaultOptions = function() {
      return {
         value: true
      };
   };

   return FilterText;

});
