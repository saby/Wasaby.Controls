define('Controls/Filter/Button/Panel/FilterText', [
   'Core/Control',
   'tmpl!Controls/Filter/Button/Panel/FilterText/FilterText',
   'css!theme?Controls/Filter/Button/Panel/FilterText/FilterText'
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

   /**
    * @event Controls/Filter/Panel#valueChanged Happens when clicking on the close button
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
