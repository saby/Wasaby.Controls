define('Controls/Selector/Templates/Stack', [
   'Core/Control',
   'tmpl!Controls/Selector/Templates/Stack',
   'css!Controls/Selector/Templates/Stack'
], function(BaseControl, template) {
   
   'use strict';
   
   var Stack = BaseControl.extend({
      _template: template,
      _selectionChanged: false,
   
      _selectButtonClick: function() {
         this._notify('selectComplete');
      },
   
      _selectionChange: function() {
         this._selectionChanged = true;
      }
   });
   
   return Stack;
});
