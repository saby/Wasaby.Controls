define('Controls/DragNDrop/Container',
   [
      'Core/Control',
      'tmpl!Controls/DragNDrop/Container/Container'
   ],

   function(Control, template) {
      return Control.extend({
         _template: template,

         _dragInit: function(event, dragObject) {
            this._children.dragInitDetect.start(dragObject);
         },

         _dragReset: function(event, dragObject) {
            this._children.dragResetDetect.start(dragObject);
         }
      });
   });
