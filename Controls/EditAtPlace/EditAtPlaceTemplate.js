define('Controls/EditAtPlace/EditAtPlaceTemplate', [
   'Core/Control',
   'tmpl!Controls/EditAtPlace/EditAtPlaceTemplate'
], function(Control, template) {
   'use strict';

   var EditAtPlaceTemplate = Control.extend({
      _template: template,

      _editorValueChangeHandler: function(event, value) {
         this._notify('valueChanged', value);
      }

   });

   return EditAtPlaceTemplate;
});
