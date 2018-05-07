define('Controls/Filter/Button/Panel/FilterText', [
   'Core/Control',
   'tmpl!Controls/Filter/Button/Panel/FilterText/FilterText',
   'css!Controls/Filter/Button/Panel/FilterText/FilterText'
], function(Control, template) {

   /**
    * Control text with cross
    * @class Controls/Filter/Button/Panel/FilterText
    * @extends Controls/Control
    * @control
    * @public
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
      _visibility: true,

      _beforeMount: function() {
         this._options.value = true;
      },

      _clickHandler: function() {
         this._visibility = false;
         this._notify('valueChanged', [this._options.value, this._visibility]);
      }

   });

   return FilterText;

});
