define('js!Controls/Input/resources/SuggestView',
[
   'Core/Control',
   'tmpl!Controls/Input/resources/SuggestView'
], function(Control, template) {
   
   'use strict';
   
   var SuggestView = Control.extend({
      _template: template,
   
      _onItemClickHandler: function(event, item) {
         this._notify('sendResult', item);
         this._notify('close');
      }
   });
   
   return SuggestView;
});